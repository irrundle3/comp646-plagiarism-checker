from flask import Flask
import os
import atexit
import shutil

from blueprint.student_auth import student_auth_bp
from blueprint.student_home import student_home_bp
from blueprint.student_document_view import student_document_bp

# Create a Flask application instance
app = Flask(__name__)

# Set a secret key for the session to enable session-based authentication
app.secret_key = "DEBUG"

# Create a directory to store user files
if not os.path.exists("user_files"):
    os.mkdir("user_files")

# Register blueprints
app.register_blueprint(student_auth_bp)
app.register_blueprint(student_home_bp)
app.register_blueprint(student_document_bp)

# Define exit handler to remove user files directory on application exit
def exit_handler():
    shutil.rmtree("user_files/")

# Register exit handler
atexit.register(exit_handler)
