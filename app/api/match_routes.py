from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import  db, Match, History
import chess


match_routes = Blueprint('match', __name__)


@match_routes.route('/', methods=['POST'])
@login_required
def new_match():
    """
    Start a new chess match
    """

    # grabbing the two user(id)'s that we need
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

    db.session.add(match)
    db.session.commit()


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


@match_routes.route('/<int:match_id>/move', methods=['POST'])
@login_required
def move(match_id):
    """
    Make a move in a chess match
    """

    uci_move = request.json.get('move')

    # if move is illegal
    if not uci_move:
        return jsonify({"error": "<-------- error at line 50 in match_routes"})

    match = Match.query.get(match_id)
    if not match:
        return jsonify({"error": "<--------- NO match found match_routes"})

    board = chess.Board(match.board_state)

    try:
        move = chess.Move.from_uci(uci_move)
    except:
        return jsonify({"error": "<--------- invalid move format in match_routes def move(match_id)"})

    if move not in board.legal_moves:
        return jsonify({"error": "Illegal move"}), 400

    board.push(move)
    match.board_state = board.fen() # <<-- board.fen() handles the current state of the chess game


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


        # check if game has ended
    if board.is_checkmate():

        match.status = "Checkmate"
        print("???----------->>>,  Checkmate works")
        db.session.commit()

    elif board.is_stalemate() or board.is_insufficient_material() or board.is_seventyfive_moves() or board.is_fivefold_repetition() or board.is_variant_draw():

        match.status = "Draw"
        db.session.commit()

    return {"match": [match.to_dict()]}, 200
