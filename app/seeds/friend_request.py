from app.models import db, FriendRequest, environment, SCHEMA
from sqlalchemy.sql import text

def seed_friend_request():
    demo = FriendRequest(
        sender_id=1,
        receiver_id=2,
        status="Sent"
    )
    bobbie = FriendRequest(
        sender_id=2,
        receiver_id=3,
        status="Sent"
    )
    marnie = FriendRequest(
        sender_id=3,
        receiver_id=1,
        status="Sent"
    )


    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.

def undo_friend_request():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friend_requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friend_requests"))

    db.session.commit()
