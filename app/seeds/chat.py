from app.models import db, User, Friends, Chat,Match,environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_chat():

    chat1 = Chat(match_id=1, user_id=1, message="Yo")
    chat2 = Chat(match_id=1, user_id=2, message="Hey")


    db.session.add(chat1)
    db.session.add(chat2)

    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_chat():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.chats RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM chats"))

    db.session.commit()
