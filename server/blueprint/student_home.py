from flask import request, Blueprint, jsonify, session, abort
import os
from preprocessing import to_txt
import model

student_home_bp = Blueprint('student_home', __name__)


# Dictionary to store class lists associated with each user
class_lists = {}

# Define route to get class list associated with the logged-in user
@student_home_bp.route("/api/class-list", methods=["GET"])
def class_list():
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    if session["username"] not in class_lists:
        class_lists[session["username"]] = []
    class_list = class_lists[session["username"]]
    return jsonify(class_list)

# Define route to add a class ID to the class list of the logged-in user
@student_home_bp.route("/api/add-class-id/<id>", methods=["POST"])
def add_class_id(id: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    if session["username"] not in class_lists:
        class_lists[session["username"]] = []
    class_lists[session["username"]].append(id)
    return {"id": id}

# Define route to upload a file associated with a class ID for the logged-in user
@student_home_bp.route("/api/upload/<id>", methods=["POST"])
def upload_file(id: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    file = request.files["file"]
    dirs = [item for item in os.listdir("user_files") if os.path.isdir(f"user_files/{item}")]
    if f"{session['username']}_files" not in dirs:
        os.mkdir(f"user_files/{session['username']}_files")
    dirs = [item for item in os.listdir(f"user_files/{session['username']}_files") if os.path.isdir(f"user_files/{session['username']}_files/{item}")]
    if id not in dirs:
        os.mkdir(f"user_files/{session['username']}_files/{id}")
    filename = os.path.join(f"user_files/{session['username']}_files/{id}", file.filename)
    file.save(filename)
    to_txt(filename)
    model.add_file_to_db(session["username"], id, filename.split("/")[-1])
    return {"id": id}