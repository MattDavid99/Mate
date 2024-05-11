from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Match, History
import chess

history_routes = Blueprint('history', __name__)

@history_routes.route('/<int:user_id>/matches')
@login_required
def user_matches(user_id):
    """
    Get all matches of a specific user
    """
    matches = Match.query.filter((Match.white_player_id == user_id) | (Match.black_player_id == user_id)).all()

    print(f"Found {len(matches)} matches for user {user_id}")

    return {"matches": [m.to_dict() for m in matches]}


@history_routes.route('/<int:match_id>')
@login_required
def match_history(match_id):
    """
    Get history of specific match
    """
    history = History.query.filter(History.match_id == match_id).all()

    return {"history": [h.to_dict() for h in history]}
