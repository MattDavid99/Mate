from app.models import db, User, Friend, Match,environment, SCHEMA
from sqlalchemy.sql import text

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


def undo_match():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.matches RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM matches"))
    db.session.commit()
