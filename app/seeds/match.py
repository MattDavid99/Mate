from app.models import db, User, Friend, Match,environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_match():

    demo_user = User.query.filter_by(username='Demo').first()
    marnie_user = User.query.filter_by(username='marnie').first()

    demo_vs_marnie = Match(
        white_player_id=demo_user.id,
        black_player_id=marnie_user.id,
        status='In progress',
        result='incomplete'
    )


    db.session.add(demo_vs_marnie)

    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_match():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.matches RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM matches"))

    db.session.commit()
