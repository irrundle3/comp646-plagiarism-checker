from flask import request, Blueprint, jsonify, session, abort, send_file
import os
from preprocessing import path_to_txt,to_txt
import model
from user_models import  Class, Teacher, Student

student_document_bp = Blueprint('student_document', __name__)

# Define route to get the documents associated with a class ID for the logged-in user
@student_document_bp.route("/student/document", methods=["GET"])
def get_documents():
    student_username = request.args.get('student_username')
    class_id = request.args.get('class_id')

    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400

    student = Student.query.filter_by(username=student_username).first()

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    class_ = Class.query.filter_by(id=class_id).first()

    if not class_:
        return jsonify({'error': 'Class not found'}), 404
    file_path = f"user_files/{class_id}_files/{student_username}"
    
    try:
        if os.path.isdir(file_path):
            files = os.listdir(file_path)
            # Exclude hidden files and directories
            files = [file for file in files if not file.startswith('.')]
        else:
            files = []

    
    except Exception as e:
        return jsonify({'error': f"An error occurred while accessing files: {str(e)}"}), 500
    # return jsonify({'files': files}), 200
    return files


# Define route to download a document associated with a class ID for the logged-in user
@student_document_bp.route("/student/document/download/<document>", methods=["GET"])
def download(document: str):
    student_username = request.args.get('student_username')
    class_id = request.args.get('class_id')

    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400

    # Ensure the document name doesn't contain potentially malicious characters
    if '..' in document or '/' in document or '\\' in document:
        return jsonify({'error': 'Invalid document name'}), 400

    file_path = f"user_files/{class_id}_files/{student_username}/{document}"

    try:
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': f"An error occurred while accessing the file: {str(e)}"}), 500

# Define route to get the text content of a document associated with a class ID for the logged-in user
@student_document_bp.route("/student/document/text/<document>", methods=["GET"])
def get_text( document: str):
    student_username = request.args.get('student_username')
    class_id = request.args.get('class_id')

    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400

    # Ensure the document name doesn't contain potentially malicious characters
    if '..' in document or '/' in document or '\\' in document:
        return jsonify({'error': 'Invalid document name'}), 400
    
    file_path = f"user_files/{class_id}_files/{student_username}/{document}"

    file_path = path_to_txt(file_path)

    if file_path is not None and os.path.isfile(file_path):
        with open(file_path, "r") as file:
            text = file.read()
            return jsonify({"text": text})
    abort(404, description="File not found")

@student_document_bp.route("/student/document/upload/", methods=["POST"])
def upload_file():
    # Check if form-data was used instead of JSON data
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    # Retrieve class ID and student username from form-data
    student_username = request.form.get("student_username")
    class_id = request.form.get("class_id")

    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400
    
    # Get the uploaded file
    print("hello1")
    file = request.files["file"]

    # Ensure directory structure exists
    print("hello2")
    base_dir = "user_files"
    class_dir = f"{base_dir}/{class_id}_files"
    student_dir = f"{class_dir}/{student_username}"
    print("hello3")
    if not os.path.exists(class_dir):
        os.mkdir(class_dir)
    
    if not os.path.exists(student_dir):
        os.mkdir(student_dir)
    print("hello4")
    # Save the file with its original name
    file_path = os.path.join(student_dir, file.filename)
    file.save(file_path)
    print(file_path)
    # Call custom function to convert to text (if needed)
    to_txt(file_path)  # Uncomment if required in your case
    
    # Record the file in the database
    model.add_file_to_db(student_username, class_id, file.filename)

    return jsonify({'status': 'File uploaded successfully'}), 200

# # Define route to get matches of a document associated with a class ID for the logged-in user
# @student_document_bp.route("/matches/<id>/<document>", methods=["GET"])
# def get_matches(id: str, document: str):
#     if "username" not in session:
#         # Return unauthorized error if user is not logged in
#         abort(401, description="Unauthorized: Invalid credentials")
#         return {}
#     try:
#         results = model.find_matches(session["username"], id, document)
#         return jsonify(results)
#     except:
#         abort(404, description="File not found")