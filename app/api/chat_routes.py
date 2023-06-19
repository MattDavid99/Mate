from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, FriendRequest, Friend, Match, User, Chat
from datetime import datetime
import chess


chat_routes = Blueprint('chat', __name__)


@chat_routes.route('/<int:match_id>', methods=['POST'])
@login_required
def chat(match_id):
    """
    Chat during match
    """

    match = Match.query.get(match_id)

    if not match:
      return jsonify({'error': 'chat_routes def chat() match not found'}), 404


    if current_user.id not in [match.white_player_id, match.black_player_id]:
       return jsonify({'error': 'chat_routes def chat() current player is not in the specific match'}), 403

    message = request.json.get('message')

    if not message:
       return jsonify({'error': 'provide a message to hit this route'}), 400

    chat = Chat(
       match_id=match_id,
       user_id=current_user.id,
       message=message
    )

    db.session.add(chat)
    db.session.commit()

    #    {
    #     "chat": [
    #         {
    #             "createdAt": "Mon, 19 Jun 2023 17:29:07 GMT",
    #             "id": 3,
    #             "matchId": 2,
    #             "message": "yo",
    #             "updatedAt": "Mon, 19 Jun 2023 17:29:07 GMT",
    #             "userId": 1
    #         }
    #     ]
    #   }

    return {'chat': [chat.to_dict()]}, 201


@chat_routes.route('/<int:match_id>', methods=['GET'])
@login_required
def get_chats(match_id):
    """
    Get all chats in a match
    """

    match = Match.query.get(match_id)

    if not match:
        return jsonify({'error': 'chat_routes def get_chats() match not found'}), 404

    if current_user.id not in [match.white_player_id, match.black_player_id]:
        return jsonify({'error': 'chat_routes def get_chats() current player is not in the specific match'}), 403

    chats = Chat.query.filter(Chat.match_id == match_id).all()

    if not chats:
        return jsonify({'error': 'No chats found for this match'}), 404

    return jsonify({'chats': [chat.to_dict() for chat in chats]}), 200
