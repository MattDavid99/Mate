from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def valid_email(form, field):
    email = field.data
    if len(email) < 5 or email != email.strip() or "@" not in email or "." not in email:
        raise ValidationError('Invalid email address.')


class SignUpForm(FlaskForm):
    first_name = StringField('First name', validators=[DataRequired()])
    last_name = StringField('Last name', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), valid_email, user_exists])
    username = StringField(
        'username', validators=[DataRequired(), username_exists, Length(min=3, message="Username must be at least 3 characters long.")])
    password = StringField('password', validators=[DataRequired(), Length(min=5, message="Password must be at least 5 characters long.")])
    profile_pic_url = StringField('Profile picture')
