from app.models import db, User, Friend, environment, SCHEMA
from sqlalchemy.sql import text

def seed_friends():

    demo = User.query.filter(User.username == 'Demo').one()
    marnie = User.query.filter(User.username == 'marnie').one()


    friend1 = Friend(user_id=demo.id, friend_id=marnie.id)

    db.session.add(friend1)

    db.session.commit()

def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
