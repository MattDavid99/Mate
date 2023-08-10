from app.models import db, User, Friend, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        first_name="demo", last_name="lition", username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        first_name="Marnie", last_name="david", username='marnie', email='marnie@aa.io', password='password')
    bobbie = User(
        first_name="Bobbie", last_name="davis", username='bobbie', email='bobbie@aa.io', password='password')
    matt = User(
        first_name="Matt", last_name="greg", username='matt', email='matt@aa.io', password='password')
    steve = User(
        first_name="Steve", last_name="kast", username='steve', email='steve@aa.io', password='password')
    bryce = User(
        first_name="Bryce", last_name="foggin", username='bryce', email='bryce@aa.io', password='password')
    brit = User(
        first_name="Brit", last_name="lewis", username='brit', email='brit@aa.io', password='password')
    mom = User(
        first_name="Mom", last_name="dav", username='mom', email='mom@aa.io', password='password')
    dad = User(
        first_name="Dad", last_name="dav", username='dad', email='dad@aa.io', password='password')
    jess = User(
        first_name="Jess", last_name="dav", username='jess', email='jess@aa.io', password='password')


    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(matt)
    db.session.add(steve)
    db.session.add(bryce)
    db.session.add(brit)
    db.session.add(mom)
    db.session.add(dad)
    db.session.add(jess)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
