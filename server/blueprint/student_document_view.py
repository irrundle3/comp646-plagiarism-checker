from flask import request, Blueprint, jsonify, session, abort, send_file
import os
import model
from user_models import  Class, Teacher, Student

student_document_bp = Blueprint('student_document', __name__)

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
            # Get all files, including full filenames with extensions
            files = [file for file in os.listdir(file_path) if not file.startswith('.')]
            print(files)
        else:
            files = []
    
    except Exception as e:
        return jsonify({'error': f"An error occurred while accessing files: {str(e)}"}), 500
    
    # Return the full filenames with extensions in the response
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
@student_document_bp.route("/student/document/text", methods=["GET"])
def get_text():
    student_username = request.args.get('student_username')
    class_id = request.args.get('class_id')
    document = request.args.get('document_name')
    print(document)

    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400
    
    if not document:
        return jsonify({'error': 'Document provided'}), 400

    # Ensure the document name doesn't contain potentially malicious characters
    if '..' in document or '/' in document or '\\' in document:
        return jsonify({'error': 'Invalid document name'}), 400
    
    file_path = f"user_files/{class_id}_files/{student_username}/{document}"
    print("ejfijefi")
    print(file_path)
    # /Users/jonathanmak/comp321/comp646-plagiarism-checker/server/user_files/1_files/tg/Science essay #2.docx
    # user_files/1_files/tg/Science essay

    if file_path is not None and os.path.isfile(file_path):
        text = model.read_doc(file_path)
        text += "\n\n" + str(model.get_file_data(file_path))
        text += "\n\n" + str(model.find_matches(file_path))
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
    
    student = Student.query.filter_by(username = student_username).first()
    if not student:
        return jsonify({"error": "Student does not exist."})

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400
    
    # Get the uploaded file
    file = request.files["file"]

    # Ensure directory structure exists
    base_dir = "user_files"
    class_dir = f"{base_dir}/{class_id}_files"
    student_dir = f"{class_dir}/{student_username}"
    if not os.path.exists(class_dir):
        os.mkdir(class_dir)
    
    if not os.path.exists(student_dir):
        os.mkdir(student_dir)
    # Save the file with its original name
    file_path = os.path.join(student_dir, file.filename)
    file.save(file_path)
    print(file_path)
    
    # Record the file in the database
    model.add_file_to_db(file_path, class_id, student.id)

    return jsonify({'status': 'File uploaded successfully'}), 200

@student_document_bp.route("/student/document/matches/", methods=["GET"])
def get_matches():
    student_username = request.args.get('student_username')
    class_id = request.args.get('class_id')
    document = request.args.get('document_name')
    print(document)

    if not student_username:
        return jsonify({'error': 'No student username provided'}), 400

    if not class_id:
        return jsonify({'error': 'No class ID provided'}), 400
    
    if not document:
        return jsonify({'error': 'Document provided'}), 400

    # Ensure the document name doesn't contain potentially malicious characters
    if '..' in document or '/' in document or '\\' in document:
        return jsonify({'error': 'Invalid document name'}), 400
    
    file_path = f"user_files/{class_id}_files/{student_username}/{document}"
    print("ejfijefi")
    print(file_path)


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