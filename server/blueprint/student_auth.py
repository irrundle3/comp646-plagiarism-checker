from flask import request, Blueprint, jsonify, session, abort
from app import db
from user_models import Student
from werkzeug.security import generate_password_hash, check_password_hash

student_auth_bp = Blueprint('student_auth', __name__)

# Define route for user login
@student_auth_bp.route("/api/student/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        data = request.json
        username = data.get("username")
        password = data.get("password")

        # Query the database for the user with the provided username
        user = Student.query.filter_by(username=username).first()

        # Check if the user exists and the password is correct
        if user and check_password_hash(user.password, password):
            # Store the username in the session to indicate the user is logged in
            session["username"] = username
            return jsonify(data)
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



# Define route for user registration
@student_auth_bp.route("/api/student/register", methods=["POST"])
def register():
    print("registering!")
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if Student.query.filter_by(username=username).first():
        abort(409, description="Conflict: Username already exists")

    # Hash the password before storing it in the database
    hashed_password = generate_password_hash(password)
    new_student = Student(username=username, password=hashed_password)
    db.session.add(new_student)
    db.session.commit()

    session["username"] = username
    return jsonify({"message": "Registration successful"})

@student_auth_bp.route("/api/students", methods=["GET"])
def get_students():
    # Query all students from the database
    students = Student.query.all()
    
    # Convert the list of student objects to a list of dictionaries
    student_list = [{"id": student.id, "username": student.username} for student in students]

    # Return the list of students as JSON
    return jsonify({"students": student_list})

