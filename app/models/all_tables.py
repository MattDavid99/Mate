from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

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

    def to_dict(self):
     return {
         'userId': self.user_id,
         'friendId': self.friend_id,
         'user': self.user.to_dict_simple() if self.user else None,
         'friend': self.friend.to_dict() if self.friend else None
     }

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

    challenges_sent = relationship(
        'Challenge',
        primaryjoin='User.id==Challenge.challenger_id',
        back_populates='challenger'
    )
    challenges_received = relationship(
        'Challenge',
        primaryjoin='User.id==Challenge.receiver_id',
        back_populates='receiver'
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
            'addedFriends': [friend.friend.id for friend in self.added_friends],
            'addedBy': [friend.friend.id for friend in self.added_by]
        }

    def to_dict_simple(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'username': self.username,
            'profilePicUrl': self.profile_pic_url,
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
    current_turn = db.Column(db.String(1))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    white_player = relationship('User', back_populates='matches_as_white', foreign_keys=[white_player_id])
    black_player = relationship('User', back_populates='matches_as_black', foreign_keys=[black_player_id])
    chats = relationship('Chat', back_populates='match', foreign_keys='Chat.match_id')
    histories = relationship('History', back_populates='match', foreign_keys='History.match_id')
    moves = relationship('Move', back_populates='match', order_by='Move.id')


    def to_dict(self):
        return {
            'id': self.id,
            'whitePlayerId': self.white_player_id,
            'blackPlayerId': self.black_player_id,
            'whitePlayerUsername': self.white_player.username,
            'blackPlayerUsername': self.black_player.username,
            'status': self.status,
            'result': self.result,
            'boardState': self.board_state,
            'currentTurn': self.current_turn,
            'chats': [chat.to_dict() for chat in self.chats],
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
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
            'username': self.user.username if self.user else None,
            'message': self.message,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
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
            'sender': self.sender.to_dict_simple() if self.sender else None,
            'receiver': self.receiver.to_dict_simple() if self.receiver else None,
            'status': self.status,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }


class Lobby(db.Model):
    __tablename__ = 'lobbies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    user2_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))

    user1 = relationship('User', foreign_keys=[user1_id])
    user2 = relationship('User', foreign_keys=[user2_id])

    def to_dict(self):
        return {
            'id': self.id,
            'user1Id': self.user1_id,
            'user2Id': self.user2_id,
        }


class Move(db.Model):
    __tablename__ = 'moves'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('matches.id')), nullable=False)
    uci_move = db.Column(db.String(50), nullable=False)
    turn = db.Column(db.String(1), nullable=False)
    board_state = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    match = relationship('Match', back_populates='moves')

    def to_dict(self):
        return {
            'id': self.id,
            'matchId': self.match_id,
            'uciMove': self.uci_move,
            'turn': self.turn,
            'boardState': self.board_state,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }


class Challenge(db.Model):
    __tablename__ = 'challenges'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    challenger_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String(100), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    challenger = relationship('User', back_populates='challenges_sent', foreign_keys=[challenger_id])
    receiver = relationship('User', back_populates='challenges_received', foreign_keys=[receiver_id])

    def to_dict(self):
        return {
            'id': self.id,
            'challenger': self.challenger.to_dict_simple() if self.challenger else None,
            'receiver': self.receiver.to_dict_simple() if self.receiver else None,
            'status': self.status,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
