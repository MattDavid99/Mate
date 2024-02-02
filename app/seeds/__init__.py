from flask.cli import AppGroup
from .users import seed_users, undo_users
from .match import seed_match, undo_match
from .chat import seed_chat, undo_chat
from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_chat()
        undo_match()
        undo_users()
    seed_users()
    seed_match()
    seed_chat()

@seed_commands.command('undo')
def undo():
    undo_chat()
    undo_match()
    undo_users()
    # Add other undo functions here
