from flask import Flask, session
import os
import atexit
import shutil
from sqlalchemy import inspect
from user_models import db
from blueprint.student_auth import student_auth_bp
from blueprint.student_home import student_home_bp
from blueprint.student_document_view import student_document_bp
from blueprint.teacher_auth import teacher_auth_bp

# Create a Flask application instance
app = Flask(__name__)

# Set a secret key for the session to enable session-based authentication
app.secret_key = "DEBUG"

# Create a directory to store user files
if not os.path.exists("user_files"):
    os.mkdir("user_files")

# Configure SQLAlchemy to use the app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db.init_app(app)

# Register blueprints
app.register_blueprint(student_auth_bp)
app.register_blueprint(teacher_auth_bp)
app.register_blueprint(student_home_bp)
app.register_blueprint(student_document_bp)

# Define route for user logout
@app.route("/api/logout")
def logout():
    if "username" in session:
        # Remove username from session to logout user
        session.pop("username")
        return "Successfully logged out"
    return {}

# Define exit handler to remove user files directory on application exit
def exit_handler():
    if os.path.exists("user_files/"):
        shutil.rmtree("user_files/")
    else:
        print("user_files directory does not exist.")

# Register exit handler
atexit.register(exit_handler)

# To avoid the application context error, run the Flask application within the application context
with app.app_context():
    # Create all database tables
    db.create_all()
    
    # Use SQLAlchemy's inspect module to check if the Student table exists
    inspector = inspect(db.engine)
    if 'Student' in inspector.get_table_names():
        print("Student table successfully created!")
    else:
        print("Student table creation failed!")

    # Run the Flask application
    app.run()
