from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from datetime import datetime


# Friends = db.Table(
#     'friends',
#     db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
#     db.Column('friend_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
#     ForeignKeyConstraint(['user_id'], [add_prefix_for_prod('users.id')], ondelete='CASCADE'),
#     ForeignKeyConstraint(['friend_id'], [add_prefix_for_prod('users.id')], ondelete='CASCADE')
# )

class Friend(db.Model):
    __tablename__ = 'friends'

    if environment == "production":
        __table_args__ = (
            ForeignKeyConstraint(['user_id'], [add_prefix_for_prod('users.id')], name='user_id_fkey',ondelete='CASCADE'),
            ForeignKeyConstraint(['friend_id'], [add_prefix_for_prod('users.id')], name='friend_id_fkey',ondelete='CASCADE'),
            {'schema': SCHEMA}
        )

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    user = relationship('User', foreign_keys=[user_id], back_populates='added_friends')
    friend = relationship('User', foreign_keys=[friend_id], back_populates='added_by')


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_pic_url = db.Column(db.String(800), nullable=True)


    added_friends = relationship(
        'Friend',
        primaryjoin='User.id==Friend.user_id',
        back_populates='user'
    )
    added_by = relationship(
        'Friend',
        primaryjoin='User.id==Friend.friend_id',
        back_populates='friend'
    )
    matches_as_white = relationship('Match', back_populates='white_player', foreign_keys='Match.white_player_id')
    matches_as_black = relationship('Match', back_populates='black_player', foreign_keys='Match.black_player_id')
    chats = relationship('Chat', back_populates='user', foreign_keys='Chat.user_id')
    sent_requests = relationship('FriendRequest', back_populates='sender', foreign_keys='FriendRequest.sender_id')
    received_requests = relationship('FriendRequest', back_populates='receiver', foreign_keys='FriendRequest.receiver_id')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'username': self.username,
            'profilePicUrl': self.profile_pic_url,
            'addedFriends': [friend.friend.username for friend in self.added_friends],
            'addedBy': [friend.friend.username for friend in self.added_by]
        }




class Match(db.Model):
    __tablename__ = 'matches'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    white_player_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    black_player_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String(100))
    result = db.Column(db.String(40))
    board_state = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    white_player = relationship('User', back_populates='matches_as_white', foreign_keys=[white_player_id])
    black_player = relationship('User', back_populates='matches_as_black', foreign_keys=[black_player_id])
    chats = relationship('Chat', back_populates='match', foreign_keys='Chat.match_id')
    histories = relationship('History', back_populates='match', foreign_keys='History.match_id')


    def to_dict(self):
        return {
            'id': self.id,
            'whitePlayerId': self.white_player_id,
            'blackPlayerId': self.black_player_id,
            'status': self.status,
            'result': self.result,
            'boardState': self.board_state,
            'chats': [chat.to_dict() for chat in self.chats],
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }



class Chat(db.Model):
    __tablename__ = 'chats'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('matches.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    message = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    match = relationship('Match', back_populates='chats')
    user = relationship('User', back_populates='chats')

    def to_dict(self):
        return {
            'id': self.id,
            'matchId': self.match_id,
            'userId': self.user_id,
            'message': self.message,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }


class History(db.Model):
    __tablename__ = 'histories'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('matches.id')), nullable=False)
    move = db.Column(db.String(50))
    turn = db.Column(db.String(100))
    total_moves = db.Column(db.Integer)
    status = db.Column(db.String(50), default='In progress...')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    match = relationship('Match', back_populates='histories')

    def to_dict(self):
        return {
            'id': self.id,
            'matchId': self.match_id,
            'move': self.move,
            'turn': self.turn,
            'totalMoves': self.total_moves,
            'status': self.status,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }


class FriendRequest(db.Model):
    __tablename__ = 'friend_requests'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    receiver_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    status = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sender = relationship('User', back_populates='sent_requests', foreign_keys=[sender_id])
    receiver = relationship('User', back_populates='received_requests', foreign_keys=[receiver_id])

    def to_dict(self):
        return {
            'id': self.id,
            'senderId': self.sender_id,
            'receiverId': self.receiver_id,
            'status': self.status,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
