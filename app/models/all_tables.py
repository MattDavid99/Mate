from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .user import User



class Match(db.Model):
    __tablename__ = 'matches'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    white_player_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    black_player_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String(100))
    result = db.Column(db.String(40))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    white_player = relationship('User', back_populates='matches_as_white')
    black_player = relationship('User', back_populates='matches_as_black')
    chats = relationship('Chat', back_populates='match', foreign_keys='Chat.match_id')
    histories = relationship('History', back_populates='match', foreign_keys='History.match_id')


    def to_dict(self):
        return {
            'id': self.id,
            'whitePlayerId': self.white_player_id,
            'blackPlayerId': self.black_player_id,
            'status': self.status,
            'result': self.result,
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
            'match': [m.to_dict() for m in self.match],
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

    sender = relationship('User', back_populates='sent_requests')
    receiver = relationship('User', back_populates='received_requests')

    def to_dict(self):
        return {
            'id': self.id,
            'senderId': self.sender_id,
            'receiverId': self.receiver_id,
            'status': self.status,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
