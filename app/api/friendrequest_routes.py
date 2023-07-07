from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, FriendRequest, Friend, User
from datetime import datetime
import chess


friendrequest_routes = Blueprint('friend-request', __name__)


@friendrequest_routes.route('/<int:friend_id>/add', methods=['POST'])
@login_required
def add_friend(friend_id):
    """
    Add a friend directly
    """
    friends = Friend(
        user_id=current_user.id,
        friend_id=friend_id
    )

    db.session.add(friends)
    db.session.commit()

    return jsonify({"friends": [friends.to_dict()]}), 200


@friendrequest_routes.route('/<int:receiver_id>', methods=['POST'])
@login_required
def send_friend_request(receiver_id):
    """
    Send a friend request
    """

    friend_request = FriendRequest(
        sender_id = current_user.id,
        receiver_id = receiver_id,
        status = 'Sent',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(friend_request)
    db.session.commit()

    return jsonify({'message': 'Friend request sent'}), 201


@friendrequest_routes.route('/<int:request_id>/accept', methods=['POST']) # ⭐⭐⭐ Might need to add addictional info in Friend and FriendRequest to_dict()
@login_required
def accept_friend_request(request_id):
    """
    Accept a friend request
    """

    friend_request = FriendRequest.query.get(request_id)

    if friend_request is None or friend_request.receiver_id != current_user.id:
        return jsonify({'error': 'error at friendrequest_routes def accept_friend_request()'})


    friend = Friend(
        user_id=friend_request.sender_id,
        friend_id=friend_request.receiver_id
    )

    db.session.add(friend)

    friend_request.status = 'Accepted'

    db.session.commit()

    return {'friend_requests': [friend_request.to_dict()]}


@friendrequest_routes.route('/<int:friend_id>/remove', methods=['DELETE'])
@login_required
def remove_friend(friend_id):
    """
    Remove a friend
    """

    friend = Friend.query.filter((Friend.user_id == current_user.id) & (Friend.friend_id == friend_id)).first()

    if not friend:
        return jsonify({'error': 'No such friend exists'}), 404

    db.session.delete(friend)
    db.session.commit()

    return jsonify({'message': 'Friend removed'}), 200


@friendrequest_routes.route('/friends', methods=['GET'])
@login_required
def get_friends():
    """
    Get all friends of the current user
    """

    friends = User.query.get(current_user.id).added_friends

    return jsonify({"friends": [friend.friend.to_dict_simple() for friend in friends]}), 200
