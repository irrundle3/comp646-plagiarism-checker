from flask import request, Blueprint, jsonify, session, abort
from app import db
from user_models import Teacher
from werkzeug.security import generate_password_hash, check_password_hash

teacher_auth_bp = Blueprint('teacher_auth', __name__)

# Define route for user login
@teacher_auth_bp.route("/api/teacher/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        data = request.json
        username = data.get("username")
        password = data.get("password")

        # Query the database for the user with the provided username
        user = Teacher.query.filter_by(username=username).first()

        # Check if the user exists and the password is correct
        if user and check_password_hash(user.password, password):
            # Store the username in the session to indicate the user is logged in
            session["username"] = username
            return jsonify({"message": "Login successful"})
        else:
            # Return unauthorized error if login fails
            abort(401, description="Unauthorized: Invalid username or password")
    elif request.method == "GET":
        # Return username if user is logged in
        if "username" in session:
            return jsonify({"username": session["username"]})
        else:
            # Return unauthorized error if user is not logged in
            abort(401, description="Unauthorized: Invalid credentials")

# Define route for user logout
@teacher_auth_bp.route("/api/teacher/logout")
def logout():
    if "username" in session:
        # Remove username from session to logout user
        session.pop("username")
        return "Successfully logged out"
    return {}

# Define route for user registration
@teacher_auth_bp.route("/api/teacher/register", methods=["POST"])
def register():
    print("registering!")
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if Teacher.query.filter_by(username=username).first():
        abort(409, description="Conflict: Username already exists")

    # Hash the password before storing it in the database
    hashed_password = generate_password_hash(password)
    new_user = Teacher(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["username"] = username
    return jsonify({"message": "Registration successful"})

@teacher_auth_bp.route("/api/teachers", methods=["GET"])
def get_teacher():
    # Query all teachers from the database
    teachers = Teacher.query.all()
    
    # Convert the list of teachers objects to a list of dictionaries
    teacher_list = [{"id": teacher.id, "username": teacher.username} for teacher in teachers]

    # Return the list of teachers as JSON
    return jsonify({"teachers": teacher_list})