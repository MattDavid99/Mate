from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import  db, Match, History, Lobby
import chess


match_routes = Blueprint('match', __name__)


lobby = []


@match_routes.route('/', methods=['POST'])
@login_required
def new_match():


    #---------------------------------------------------------------------------------------------------
    """
    Start a new chess match
    """

    # grabbing the two user(id)'s that we need from the json body
    white_player_id = request.json.get('white_player_id')
    black_player_id = request.json.get('black_player_id')

    if not white_player_id or not black_player_id:
        return jsonify({"error": "White and Black player id's must be provided"}), 400


    board = chess.Board()
    print("---------------------------------------------->",board)
# r n b q k b n r
# p p p p p p p p
# . . . . . . . .
# . . . . . . . .
# . . . . . . . .
# . . . . . . . .
# P P P P P P P P
# R N B Q K B N R

    match = Match(
        white_player_id=white_player_id,
        black_player_id=black_player_id,
        status="In Progress",
        board_state=board.fen()
    )

    try:
        db.session.add(match)
        db.session.commit()

    except Exception as e:
        print(e)  # Or use a logging system
        return jsonify({"error": "Database error at new_match: " + str(e)}), 500


    # ⬇️ Returns
#     {
#     "match": [
#         {
#             "blackPlayerId": 2,
#             "boardState": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
#             "chats": [],
#             "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#             "id": 2,
#             "result": null,
#             "status": "In Progress",
#             "updatedAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#             "whitePlayerId": 1
#         }
#     ]
# }

    return {"match": [match.to_dict()]}, 201
# -----------------------------------------------------------------------------------------------


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
    except:
        return jsonify({"error": "<--------- invalid move format in match_routes def move(match_id)"}), 404

    if move not in board.legal_moves:
        return jsonify({"error": "Illegal move"}), 400

    board.push(move)
    match.board_state = board.fen() # <<-- board.fen() handles the current state of the chess game
    print("DEBUG: Updated board state:", match.board_state)


    print("---------------------->Current board\n",board)
    # In postman I did:

      # { "move": "e2e4" }   <---- White
      # { "move": "e7e5" }   <---- Black
      # { "move": "d1g4" }   <---- White
      # { "move": "d7d6" }   <---- Black
      # { "move": "g4d7" }   <---- White
      # { "move": "d8d7" }   <---- Black   took the Queen, taking works
      # { "move": "e1e2" }   <---- White
      # { "move": "d6d5" }   <---- Black
      # { "move": "a2a3" }   <---- White
      # { "move": "d7g4" }   <---- Black
      # { "move": "e2e1" }   <---- White
      # { "move": "g4f3" }   <---- Black
      # { "move": "a3a4" }   <---- White
      # { "move": "c8g4" }   <---- Black
      # { "move": "a4a5" }   <---- White
      # { "move": "f3d1" }   <---- Black   # Checkmate #

      # r n . . k b n r
      # p p p . . p p p
      # . . . . . . . .
      # P . . p p . . .
      # . . . . P . b .
      # . . . . . . . .
      # . P P P . P P P
      # R N B q K B N R



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

    return {'match', [match.to_dict()]}, 200


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


@match_routes.route('/lobby', methods=['GET'])
def get_lobby():
    """
    Get a list of all ongoing matches
    """

    matches_in_progress = Match.query.filter_by(status="In Progress").all()

    if not matches_in_progress:
        return jsonify({'error': 'No matches currently in progress'}), 404

    matches_in_progress = [match.to_dict() for match in matches_in_progress]

    return {'matches': matches_in_progress}, 200



@match_routes.route('/lobby', methods=['POST'])
def join_lobby():

    current_user_id = current_user.id

    if not current_user_id:
        return jsonify({"error": "User must be logged in"}), 400

    existing_lobby = Lobby.query.filter_by(user2_id=None).first()

    if existing_lobby:
        existing_lobby.user2_id = current_user_id
        try:
            db.session.commit()

            board = chess.Board()
            match = Match(
                white_player_id=existing_lobby.user1_id,
                black_player_id=current_user_id,
                status="In Progress",
                board_state=board.fen()
            )
            db.session.add(match)
            db.session.commit()

            db.session.delete(existing_lobby)
            db.session.commit()

            return jsonify({"success": "Match started"}), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "Database error at join_lobby: " + str(e)}), 500
    else:
        new_lobby = Lobby(user1_id=current_user_id)
        try:
            db.session.add(new_lobby)
            db.session.commit()
            return jsonify({"message": "Waiting for opponent"}), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "Database error at join_lobby: " + str(e)}), 500



@match_routes.route('/status', methods=['GET'])
def check_match_status():
    current_user_id = current_user.id

    match = Match.query.filter((Match.white_player_id == current_user_id) | (Match.black_player_id == current_user_id)).filter_by(status="In Progress").first()

    if match:
        return {"match": match.to_dict()}, 200
    else:
        return {"message": "Waiting for match"}, 200
