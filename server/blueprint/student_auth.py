from flask import request, Blueprint, jsonify, session, abort
import json

student_auth_bp = Blueprint('student_auth', __name__)

# Define route for user login
@student_auth_bp.route("/api/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        # Extract username from request data and store in session
        data = json.loads(request.data)
        session["username"] = data["username"]
        return jsonify(data)
    elif request.method == "GET":
        # Return username if user is logged in
        if "username" in session:
            return jsonify({"username": session["username"]})
        else:
            # Return unauthorized error if user is not logged in
            abort(401, description="Unauthorized: Invalid credentials")
            return {}


# Define route for user logout
@student_auth_bp.route("/api/logout")
def logout():
    if "username" in session:
        # Remove username from session to logout user
        session.pop("username")
        return "Successfully logged out"
    return {}

# Define route for user registration
@student_auth_bp.route("/api/register", methods=["POST"])
def register():
    # Store username from request data in session
    data = json.loads(request.data)
    session["username"] = data["username"]
    return jsonify(data)