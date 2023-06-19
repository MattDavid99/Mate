from app.models import db, User, Friend, environment, SCHEMA
from sqlalchemy.sql import text

def seed_friends():

    demo = User.query.filter(User.username == 'Demo').one()
    marnie = User.query.filter(User.username == 'marnie').one()
    bobbie = User.query.filter(User.username == 'bobbie').one()

    friend1 = Friend(user_id=demo.id, friend_id=marnie.id)
    friend2 = Friend(user_id=demo.id, friend_id=bobbie.id)
    friend3 = Friend(user_id=marnie.id, friend_id=bobbie.id)

    db.session.add(friend1)
    db.session.add(friend2)
    db.session.add(friend3)

    db.session.commit()

def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
