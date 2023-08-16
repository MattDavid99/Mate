from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import  db, Match, History, Move, User, Challenge, Lobby
import chess
from app.socket import socketio
from flask_socketio import join_room, leave_room, emit
from collections import defaultdict
from datetime import datetime
import random


match_routes = Blueprint('match', __name__)

rematch_requests = {}
waiting_players = {}
user_sockets = {}


@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('user_id')
    if user_id:
        user_sockets[user_id] = request.sid

@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected')


@socketio.on('new_match')
def new_match(data):
    print("Received new_match event ==========>", data)
    waiting_players[request.sid] = data['player_id']

    if len(waiting_players) >= 2:
        # white_player_sid, white_player_id = waiting_players.popitem()
        # black_player_sid, black_player_id = waiting_players.popitem()

        (white_player_sid, white_player_id), (black_player_sid, black_player_id) = random.sample(waiting_players.items(), 2)

        del waiting_players[white_player_sid]
        del waiting_players[black_player_sid]


        if not white_player_id or not black_player_id:
            return jsonify({"error": "White and Black player id's must be provided"}), 400

        board = chess.Board()

        match = Match(
            white_player_id=white_player_id,
            black_player_id=black_player_id,
            status="In Progress",
            board_state=board.fen(),
            current_turn='w'
        )

        try:
            db.session.add(match)
            db.session.commit()
            match_id = match.id

            join_room(str(match_id), sid=white_player_sid)
            join_room(str(match_id), sid=black_player_sid)


            emit('new_match', {
                "match": [match.to_dict()],
                "players": {
                    "white": white_player_id,
                    "black": black_player_id
                }}, room=str(match_id))

            print(board)

        except Exception as e:
            print(e)
            return jsonify({"error": "Database error at new_match: " + str(e)}), 500

        return {
            "match": [match.to_dict()],
            "players": {
                "white": white_player_id,
                "black": black_player_id
            }}, 201

# @socketio.on('new_match')
# def new_match(data):
#     print("Received new_match event ==========>", data)
#     user_id = data['player_id']
#     waiting_player = Lobby(user1_id=user_id)

#     try:
#         db.session.add(waiting_player)
#         db.session.commit()

#         waiting_lobbies = Lobby.query.filter_by(user2_id=None).all()

#         print("Number of waiting lobbies:", len(waiting_lobbies))
#         print("Waiting lobbies:", waiting_lobbies)

#         if len(waiting_lobbies) >= 2:

#             print("Condition met: waiting lobbies >= 2")
#             lobby1 = random.choice(waiting_lobbies)
#             lobby2 = random.choice([lobby for lobby in waiting_lobbies if lobby.id != lobby1.id])
#             print("Selected lobbies:", lobby1, lobby2)

#             white_player_id = lobby1.user1_id
#             black_player_id = lobby2.user1_id
#             white_player_sid = user_sockets[white_player_id]
#             black_player_sid = user_sockets[black_player_id]

#             print("white_player_sid:", white_player_sid, "black_player_sid:", black_player_sid)

#             # Updating the Lobby to include the second player
#             lobby1.user2_id = black_player_id
#             db.session.commit()

#             board = chess.Board()

#             match = Match(
#                 white_player_id=white_player_id,
#                 black_player_id=black_player_id,
#                 status="In Progress",
#                 board_state=board.fen(),
#                 current_turn='w'
#             )

#             db.session.add(match)
#             db.session.commit()
#             match_id = match.id

#             join_room(str(match_id), sid=white_player_sid)
#             join_room(str(match_id), sid=black_player_sid)

#             emit('new_match', {
#                 "match": [match.to_dict()],
#                 "players": {
#                     "white": white_player_id,
#                     "black": black_player_id
#                 }}, room=str(match_id))

#             print(board)

#             return {
#                 "match": [match.to_dict()],
#                 "players": {
#                     "white": white_player_id,
#                     "black": black_player_id
#                 }}, 201

#     except Exception as e:
#         print(e)
#         return jsonify({"error": "Database error at new_match: " + str(e)}), 500

@socketio.on('chess_move')
def handle_move(data):
    print("Received move event ============> MOVE", data)

    match_id = data['room']
    uci_move = data['move']
    player_id = data['player_id']
    print(match_id, "<=== match_id", uci_move, "<=== uci_move")


    match = Match.query.get(match_id)

    if not match:
        emit('error', {"error": f"No match found with id {match_id}"}, room=match_id)
        return

    if match.current_turn == 'w' and player_id != match.white_player_id or \
      match.current_turn == 'b' and player_id != match.black_player_id:
       emit('error', {"error": "Not your turn"}, room=match_id)
       return


    board = chess.Board(match.board_state)
    move = chess.Move.from_uci(uci_move)

    if move not in board.legal_moves:
        emit('error', {"error": "Illegal move"}, room=match_id)
        return

    board.push(move)
    match.current_turn = 'b' if match.current_turn == 'w' else 'w'
    match.board_state = board.fen()
    print(board)

    the_move = Move(
        match_id=match_id,
        uci_move=uci_move,
        turn=match.current_turn,
        board_state=board.fen()
    )

    db.session.add(the_move)


    history = History(
        match_id=match_id,
        move=uci_move,
        turn=match.current_turn,
        total_moves=board.fullmove_number,
        status=match.status
    )
    db.session.add(history)

    if board.is_checkmate():
        match.status = "Finished"
        if board.turn:
            match.result = "Black wins by checkmate"
        else:
            match.result = "White wins by checkmate"

    elif board.is_stalemate() or board.is_insufficient_material() or board.can_claim_draw():
        match.status = "Finished"
        match.result = "Draw"

    if match.status == "Finished":
        history_entries = History.query.filter_by(match_id=match_id).all()
        for entry in history_entries:
            entry.status = match.status
            db.session.add(entry)


    db.session.commit()


    match_data = {
        "match": [match.to_dict()],
        "boardState": board.fen(),
        "status": match.status,
        "result": match.result
    }


    emit('chess_move', match_data, room=str(match_id))
    return {"match": [match.to_dict()], "move": uci_move}, 200


@socketio.on('rematch_request')
def handle_rematch_request(data):
    print("Received rematch_request event ==========>", data)

    match_id = data['room']
    player_id = data['player_id']

    if match_id not in rematch_requests:
        rematch_requests[match_id] = [player_id]
    else:
        rematch_requests[match_id].append(player_id)

    match = Match.query.get(match_id)
    if not match:
        emit('error', {"error": f"No match found with id {match_id}"})
        return

    if match.white_player_id in rematch_requests[match_id] and match.black_player_id in rematch_requests[match_id]:
        white_player_id = match.white_player_id
        black_player_id = match.black_player_id

        board = chess.Board()

        new_match = Match(
            white_player_id=white_player_id,
            black_player_id=black_player_id,
            status="In Progress",
            board_state=board.fen(),
            current_turn='w'
        )

        try:
            db.session.add(new_match)
            db.session.commit()
            new_match_id = new_match.id

            emit('new_match', {
                "match": [new_match.to_dict()],
                "players": {
                    "white": white_player_id,
                    "black": black_player_id
                }}, room=str(new_match_id))

            print(board)

        except Exception as e:
            print(e)
            return jsonify({"error": "Database error at rematch_request: " + str(e)}), 500

        del rematch_requests[match_id]

        return {
            "match": [new_match.to_dict()],
            "players": {
                "white": white_player_id,
                "black": black_player_id
            }}, 201
    else:
        return {"message": "Waiting for other player's rematch request"}, 200





@match_routes.route('/<int:match_id>/move', methods=['POST'])
@login_required
def move(match_id):
    """
    Make a move in a chess match
    """
    uci_move = request.json.get('move')
    print("DEBUG: Got move:", uci_move)
    # if move is illegal
    if not uci_move:
        return jsonify({"error": "<-------- error at line 50 in match_routes"}), 404

    match = Match.query.get(match_id)
    print("DEBUG: Got match:", match)

    if not match:
        return jsonify({"error": "<--------- NO match found match_routes"}), 404

    board = chess.Board(match.board_state)
    print("DEBUG: Created board:", board)
    try:
        move = chess.Move.from_uci(uci_move)
        print("DEBUG: Created move:", move)
        # emit('move_made', {"match": match.to_dict()}, room=match_id)
    except:
        return jsonify({"error": "<--------- invalid move format in match_routes def move(match_id)"}), 404
    if move not in board.legal_moves:
        return jsonify({"error": "Illegal move"}), 400
    board.push(move)
    print("DEBUG=========>: Updated turn:", board.turn)
    match.board_state = board.fen() # <<-- board.fen() handles the current state of the chess game
    print("DEBUG: Updated board state:", match.board_state)
    print("---------------------->Current board\n",board)

    history = History(
        match_id=match_id,
        move=uci_move,
        turn="white" if board.turn else "black",
        total_moves=board.fullmove_number,
        status=match.status
    )
    db.session.add(history)
    db.session.commit()


        # check if game has ended
    if board.is_checkmate():

        winner = "black" if board.turn else "white"
        match.status = "Checkmate"
        print("???----------->>>,  Checkmate works")
        match.result = winner + " wins"
        db.session.commit()
    elif board.is_stalemate() or board.is_insufficient_material() or board.is_seventyfive_moves() or board.is_fivefold_repetition() or board.is_variant_draw():
        match.status = "Draw"
        match.result = "Draw"
        db.session.commit()
    return {"match": [match.to_dict()]}, 200


@match_routes.route('/<int:match_id>/resign', methods=['POST'])
@login_required
def handle_resign(match_id):
    """
    Resign from a chess match
    """

    current_user_id = current_user.id
    match = Match.query.get(match_id)

    if not match or (match.white_player_id != current_user_id and match.black_player_id != current_user_id):
        return jsonify({"error": "@ handle_resign() line 169"}), 400


    match.status = "Resigned"
    match.result = "White wins" if match.black_player_id == current_user_id else "Black wins"

    db.session.commit()

    return {"match": [match.to_dict()]}, 200


@match_routes.route('/<int:match_id>', methods=['GET'])
@login_required
def get_match(match_id):
    """
    Get the state of an ongoing chess match
    """
    print(f"Accessing match with ID: {match_id}")
    match = Match.query.get(match_id)

    if not match:
        return jsonify({'error': 'error in def get_match() in match_routes, cannot get specific match'}), 404

    return {'match': [match.to_dict()]}, 200


@match_routes.route('/<int:match_id>/reset', methods=['POST'])
@login_required
def reset_match(match_id):
    """
    Reset a chess match
    """

    match = Match.query.get(match_id)

    current_user_id = current_user.id
    if not match or (match.white_player_id != current_user_id and match.black_player_id != current_user_id):
        return jsonify({"error": "Match not found or user not part of the match"}), 404

    board = chess.Board()

    match.board_state = board.fen()
    match.status = "In Progress"
    match.result = None

    db.session.commit()

    return {"match": [match.to_dict()]}, 200


@socketio.on('load_match')
def load_match(data):
    if 'match_id' not in data:
        return {"error": "No match_id provided"}

    match_id = data['match_id']
    match = Match.query.get(match_id)
    if not match:
        return {"error": "No match found with the given ID"}

    emit('load_match', {"match": [match.to_dict()]}, broadcast=True)
    return {"match": [match.to_dict()]}



@match_routes.route('/<int:match_id>/moves', methods=['GET'])
def get_moves(match_id):

    match = Match.query.get(match_id)
    if match is None:
        return jsonify({"error": "Match not found"}), 404
    moves = Move.query.filter_by(match_id=match_id).all()
    return jsonify([move.to_dict() for move in moves])


@match_routes.route('/challenges', methods=['GET'])
@login_required
def get_challenges():
    """
    Get all challenges of the current user
    """
    challenges = Challenge.query.filter_by(receiver_id=current_user.id).all()

    return jsonify({"challenges": [challenge.to_dict() for challenge in challenges]}), 200

@match_routes.route('/challenge/<int:receiver_id>', methods=['POST'])
@login_required
def send_challenge(receiver_id):
    """
    Send a challenge to a friend
    """

    challenge = Challenge(
        challenger_id=current_user.id,
        receiver_id=receiver_id,
        status='Sent',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(challenge)
    db.session.commit()

    return jsonify({'message': 'Challenge sent'}), 201

@match_routes.route('/<int:challenge_id>/decline', methods=['POST'])
@login_required
def decline_challenge(challenge_id):
    """
    Decline a challenge
    """
    challenge = Challenge.query.get(challenge_id)

    if challenge is None or challenge.receiver_id != current_user.id:
        return jsonify({'error': 'error at match_routes def decline_challenge()'})

    challenge.status = 'Declined'

    db.session.delete(challenge)
    db.session.commit()

    return {'message': 'Challenge declined'}


# @socketio.on('accept_challenge')
# def accept_challenge(data):
#     print("DATATAATATAT====>", data)
#     challenge_id = data['challenge_id']
#     challenge = Challenge.query.get(challenge_id)
#     challenge.status = 'Accepted'
#     db.session.commit()

#     white_player_id = challenge.receiver_id
#     black_player_id = challenge.challenger_id

#     board = chess.Board()

#     match = Match(
#         white_player_id=white_player_id,
#         black_player_id=black_player_id,
#         status="In Progress",
#         board_state=board.fen(),
#         current_turn='w'
#     )

#     try:
#         db.session.add(match)
#         db.session.commit()
#         match_id = match.id

#         white_socket = user_sockets.get(str(white_player_id))
#         black_socket = user_sockets.get(str(black_player_id))

#         if white_socket:
#             join_room(str(match_id), sid=white_socket)
#         if black_socket:
#             join_room(str(match_id), sid=black_socket)

#         new_match_data = {
#             "match": [match.to_dict()],
#             "match_id": match_id,
#             "players": {
#                 "white": white_player_id,
#                 "black": black_player_id
#             }
#         }

#         emit('new_match', new_match_data, room=str(match_id))

#     except Exception as e:
#         print(e)
#         return jsonify({"error": "Database error at accept_challenge: " + str(e)}), 500
