from flask import request, Blueprint, jsonify, session, abort
import os
import model
from user_models import  Class, Teacher, Student

student_home_bp = Blueprint('student_home', __name__)


# Dictionary to store class lists associated with each user
class_lists = {}

# Define route to get class list associated with the logged-in user
@student_home_bp.route("/class-list", methods=["GET"])
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
@student_home_bp.route("/add-class-id/<id>", methods=["POST"])
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
@student_home_bp.route("/upload/<id>", methods=["POST"])
def upload_file(id: str):
    if ("username" not in session):
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
    student = Student.query.filter_by(username=session["username"]).first()
    class_obj = Class.query.filter_by(id=id).first()
    if class_obj not in student.classes_enrolled:
        abort(401, description="Unauthorized: Invalid credentials")
    
    file = request.files["file"]
    dirs = [item for item in os.listdir("user_files") if os.path.isdir(f"user_files/{item}")]
    if f"{session['username']}_files" not in dirs:
        os.mkdir(f"user_files/{session['username']}_files")
    dirs = [item for item in os.listdir(f"user_files/{session['username']}_files") if os.path.isdir(f"user_files/{session['username']}_files/{item}")]
    if id not in dirs:
        os.mkdir(f"user_files/{session['username']}_files/{id}")

    filename = os.path.join(f"user_files/{session['username']}_files/{id}", file.filename)
    file.save(filename)
    model.add_file_to_db(filename, id, student.id)
    return {"id": id}


@student_home_bp.route("/student/classes", methods=["GET"])
def get_student_classes():
    student_username = request.args.get('student_username')
    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    student = Student.query.filter_by(username=student_username).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    classes = student.enrolled_classes
    class_data = []
    for class_obj in classes:
        class_info = {
            'id': class_obj.id,
            'name': class_obj.name,
            'teacher': class_obj.teacher.username,
            'enrolled_students': [student.username for student in class_obj.enrolled_students]
        }
        class_data.append(class_info)
    return jsonify(class_data)
