from flask.cli import AppGroup
from .users import seed_users, undo_users
from .friend import seed_friends, undo_friends
from .friend_request import seed_friend_request, undo_friend_request
from .match import seed_match, undo_match
from .chat import seed_chat, undo_chat
from .history import seed_history, undo_history

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_history()
        undo_chat()
        undo_match()
        undo_friend_request()
        undo_friends()
        undo_users()
    seed_users()
    seed_friends()
    seed_friend_request()
    seed_match()
    seed_chat()
    seed_history()

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_history()
    undo_chat()
    undo_match()
    undo_friend_request()
    undo_friends()
    undo_users()
    # Add other undo functions here
