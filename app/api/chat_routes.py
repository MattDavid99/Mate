from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, FriendRequest, Friend, Match, User, Chat
from datetime import datetime
from app.socket import socketio
from flask_socketio import join_room, leave_room, emit
import chess


chat_routes = Blueprint('chat', __name__)


@socketio.on('connect')
def on_connect():
    print('User connected')

@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected')



@socketio.on('send_message')
def handle_send_message(data):
  print("----------------->", data)

  if 'match_id' in data and 'user_id' in data and 'message' in data:
    chat = Chat(
      match_id=data['match_id'],
      user_id=data['user_id'],
      message=data['message']
    )

    db.session.add(chat)
    db.session.commit()

    emit('new_message', chat.to_dict(), broadcast=True)
  else:
    print("Received incomplete message data:", data)



@socketio.on('receive_message')
def handle_receive_message(data):
    print("Received message:", data)

    if 'match_id' in data and 'user_id' in data and 'message' in data:
        print(f"Message from user {data['user_id']} in match {data['match_id']}: {data['message']}")
        chat = Chat(
            match_id=data['match_id'],
            user_id=data['user_id'],
            message=data['message']
        )

        db.session.add(chat)
        db.session.commit()
        emit('receive_message', chat.to_dict(), room=data['match_id'])
    else:
        print("Received incomplete message data:", data)

# ------------------------------------------------------------ (edit and delete for chat)
@socketio.on('edit_message')
def handle_edit_message(data):
    if 'message_id' in data and 'new_message' in data:
        chat = Chat.query.get(data['message_id'])
        if chat:
            chat.message = data['new_message']
            db.session.commit()
            emit('message_edited', chat.to_dict(), broadcast=True)
        else:
            print("Chat message not found:", data['message_id'])

@socketio.on('delete_message')
def handle_delete_message(data):
    if 'message_id' in data:
        chat = Chat.query.get(data['message_id'])
        if chat:
            db.session.delete(chat)
            db.session.commit()
            emit('message_deleted', {'message_id': data['message_id']}, broadcast=True)
        else:
            print("Chat message not found:", data['message_id'])




@chat_routes.route('/<int:message_id>', methods=['PUT'])
@login_required
def edit_message(message_id):
    """
    Edit a chat message
    """
    message = request.json.get('message')
    chat = Chat.query.get(message_id)
    if chat and chat.user_id == current_user.id:
        chat.message = message
        db.session.commit()
        return chat.to_dict()
    else:
        return jsonify({'error': 'Message not found or user not authorized'}), 404

@chat_routes.route('/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    """
    Delete a chat message
    """
    chat = Chat.query.get(message_id)
    if chat and chat.user_id == current_user.id:
        db.session.delete(chat)
        db.session.commit()
        return {'message_id': message_id}
    else:
        return jsonify({'error': 'Message not found or user not authorized'}), 404

# ------------------------------------------------------------------------------------------


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
