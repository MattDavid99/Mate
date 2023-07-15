import os
from flask_socketio import SocketIO

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://mate-project.onrender.com",
        "https://mate-project.onrender.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins, logger=True, engineio_logger=True)

# socketio = SocketIO(cors_allowed_origins="*")
