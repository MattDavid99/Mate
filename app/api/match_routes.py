from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import  db, Match, History
import chess
from app.socket import socketio
from flask_socketio import join_room, leave_room, emit

match_routes = Blueprint('match', __name__)

waiting_players = []


@socketio.on('connect')
def on_connect():
    print('User connected')

@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected')


@socketio.on('new_match')
def new_match(data):
    print("Received new_match event", data)
    waiting_players.append(data['player_id'])

    if len(waiting_players) >= 2:
        white_player_id = waiting_players.pop(0)  # White player is the first who clicked "Start Match"
        black_player_id = waiting_players.pop(0)  # Black player is the second one

        if not white_player_id or not black_player_id:
            return jsonify({"error": "White and Black player id's must be provided"}), 400

        board = chess.Board()

        match = Match(
            white_player_id=white_player_id,
            black_player_id=black_player_id,
            status="In Progress",
            board_state=board.fen()
        )

        try:
            db.session.add(match)
            db.session.commit()

            emit('new_match', {"match": [match.to_dict()]}, broadcast=True)

        except Exception as e:
            print(e)
            return jsonify({"error": "Database error at new_match: " + str(e)}), 500

        return {"match": [match.to_dict()]}, 201



@socketio.on('move')
def move(data):
    """
    Make a move in a chess match
    """

    # match_id = data['match_id']
    print("----------->",data)
    match_id = data['room']
    uci_move = data['move']
    print("----------->",data)

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
        emit('move', {"match": [match.to_dict()], "move": uci_move}, broadcast=True)
        print("DEBUG: Created move:", move)
    except:
        return jsonify({"error": "<--------- invalid move format in match_routes def move(match_id)"}), 404

    if move not in board.legal_moves:
        emit('error', {"error": "Illegal move", "move": uci_move, "match": [match.to_dict()]})
        return

    if board.is_check() and board.gives_check(move):
        emit('error', {"error": "Illegal move - you are in check", "move": uci_move, "match": [match.to_dict()]})
        return

    board.push(move)
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

    # emit('move_made', {"match": [match.to_dict()]})
    emit('move', {"match": [match.to_dict()], "move": uci_move}, broadcast=True)  # Include move in the emitted data
    return {"match": [match.to_dict()], "move": uci_move}, 200

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
    match_id = data['room']
    match = Match.query.get(match_id)
    if not match:
        return jsonify({"error": "No match found with the given ID"}), 404
    emit('load_match', {"match": [match.to_dict()]}, broadcast=True)
    return {"match": [match.to_dict()]}, 200
