from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Match, History
import chess


history_routes = Blueprint('history', __name__)


@history_routes.route('/<int:match_id>')
@login_required
def match_history(match_id):
    """
    Get history of specific match
    """
    history = History.query.filter(History.match_id == match_id).all()

    return {"history": [h.to_dict() for h in history]}

#     {
#     "history": [
#         {
#             "createdAt": "Mon, 19 Jun 2023 08:03:10 GMT",
#             "id": 2,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "e2e4",
#             "totalMoves": 1,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 08:03:10 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 08:06:37 GMT",
#             "id": 3,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "e7e5",
#             "totalMoves": 2,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 08:06:37 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 08:12:00 GMT",
#             "id": 4,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "d1g4",
#             "totalMoves": 2,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 08:12:00 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 11:54:25 GMT",
#             "id": 5,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "d7d6",
#             "totalMoves": 3,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 11:54:25 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 11:56:27 GMT",
#             "id": 6,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "g4d7",
#             "totalMoves": 3,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 11:56:27 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 11:58:08 GMT",
#             "id": 7,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "d8d7",
#             "totalMoves": 4,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 11:58:08 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:03:57 GMT",
#             "id": 8,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "e1e2",
#             "totalMoves": 4,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 12:03:57 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:06:20 GMT",
#             "id": 9,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "d6d5",
#             "totalMoves": 5,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 12:06:20 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:09:02 GMT",
#             "id": 10,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "a2a3",
#             "totalMoves": 5,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 12:09:02 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:10:30 GMT",
#             "id": 11,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "d7g4",
#             "totalMoves": 6,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 12:10:30 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:11:37 GMT",
#             "id": 12,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "e2e1",
#             "totalMoves": 6,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 12:11:37 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:12:29 GMT",
#             "id": 13,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "g4f3",
#             "totalMoves": 7,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 12:12:29 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:13:19 GMT",
#             "id": 14,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "a3a4",
#             "totalMoves": 7,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 12:13:19 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:14:15 GMT",
#             "id": 15,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "c8g4",
#             "totalMoves": 8,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 12:14:15 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:15:05 GMT",
#             "id": 16,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "a4a5",
#             "totalMoves": 8,
#             "turn": "black",
#             "updatedAt": "Mon, 19 Jun 2023 12:15:05 GMT"
#         },
#         {
#             "createdAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#             "id": 17,
#             "match": {
#                 "blackPlayerId": 2,
#                 "boardState": "rn2kbnr/ppp2ppp/8/P2pp3/4P1b1/8/1PPP1PPP/RNBqKBNR w kq - 1 9",
#                 "chats": [],
#                 "createdAt": "Mon, 19 Jun 2023 07:59:56 GMT",
#                 "id": 2,
#                 "result": null,
#                 "status": "Checkmate",
#                 "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT",
#                 "whitePlayerId": 1
#             },
#             "matchId": 2,
#             "move": "f3d1",
#             "totalMoves": 9,
#             "turn": "white",
#             "updatedAt": "Mon, 19 Jun 2023 12:15:39 GMT"
#         }
#     ]
# }
