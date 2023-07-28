from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import  db, Match, History
import chess
from app.socket import socketio
from flask_socketio import join_room, leave_room, emit


match_routes = Blueprint('match', __name__)

waiting_players = {}
rematch_requests = {}


@socketio.on('connect')
def on_connect():
    print('User connected')

@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected')


@socketio.on('new_match')
def new_match(data):
    print("Received new_match event ==========>", data)
    waiting_players[request.sid] = data['player_id']

    if len(waiting_players) >= 2:
        white_player_sid, white_player_id = waiting_players.popitem()
        black_player_sid, black_player_id = waiting_players.popitem()

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
