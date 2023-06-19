from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Match
import chess


history_routes = Blueprint('history', __name__)


@history_routes.route('/<int:id>')
@login_required
def new_match(id):
    """
    Start a new chess match
    """
