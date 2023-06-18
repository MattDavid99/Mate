from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from .all_tables import Chat, FriendRequest, History, Match


Friends = db.Table(
    'friends',
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    ForeignKeyConstraint(['user_id'], [add_prefix_for_prod('users.id')], ondelete='CASCADE'),
    ForeignKeyConstraint(['friend_id'], [add_prefix_for_prod('users.id')], ondelete='CASCADE')
)



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


    matches_as_white = relationship('Match', back_populates='white_player', foreign_keys='Match.white_player_id')
    matches_as_black = relationship('Match', back_populates='black_player', foreign_keys='Match.black_player_id')
    chats = relationship('Chat', back_populates='user', foreign_keys='Chat.user_id')
    sent_requests = relationship('FriendRequest', back_populates='sender', foreign_keys='FriendRequest.sender_id')
    received_requests = relationship('FriendRequest', back_populates='receiver', foreign_keys='FriendRequest.receiver_id')

    friends = relationship(
        'User',
        secondary=Friends,
        primaryjoin='User.id==friends.c.user_id',
        secondaryjoin='User.id==friends.c.friend_id'
    )



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
            'friends': [friend.username for friend in self.friends]
        }
