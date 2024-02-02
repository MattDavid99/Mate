from app.models import db, User, Friend, Chat,Match,environment, SCHEMA
from sqlalchemy.sql import text

def seed_chat():
    chat1 = Chat(match_id=1, user_id=1, message="Yo")
    chat2 = Chat(match_id=1, user_id=2, message="Hey")
    db.session.add(chat1)
    db.session.add(chat2)
    db.session.commit()


def undo_chat():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.chats RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM chats"))

    db.session.commit()
