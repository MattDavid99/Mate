from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Match
import chess


friendrequest_routes = Blueprint('friend-request', __name__)


@friendrequest_routes.route('/<int:id>')
@login_required
def new_match(id):
    """
    Start a new chess match
    """
