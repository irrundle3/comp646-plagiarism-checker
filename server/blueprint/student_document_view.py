from flask import request, Blueprint, jsonify, session, abort, send_file
import os
import model

student_document_bp = Blueprint('student_document', __name__)

# Define route to get the documents associated with a class ID for the logged-in user
@student_document_bp.route("/documents/<id>", methods=["GET"])
def get_documents(id: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    if os.path.isdir(f"user_files/{session['username']}_files/{id}"):
        files = os.listdir(f"user_files/{session['username']}_files/{id}")
        files = [file for file in files if file[0] != "."]
    else:
        files = []
    return files

# Define route to download a document associated with a class ID for the logged-in user
@student_document_bp.route("/download/<id>/<document>", methods=["GET"])
def download(id: str, document: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    file_path = f"user_files/{session['username']}_files/{id}/{document}"
    if os.path.isfile(file_path):
        return send_file(file_path, as_attachment=True)
    abort(401, description="Unauthorized: Invalid credentials")
    return {}

# Define route to get the text content of a document associated with a class ID for the logged-in user
@student_document_bp.route("/text/<id>/<document>", methods=["GET"])
def get_text(id: str, document: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    file_path = f"user_files/{session['username']}_files/{id}/{document}"
    if file_path is not None and os.path.isfile(file_path):
        text = model._get_sentences(file_path)
        return jsonify({"text": text})
    abort(404, description="File not found")

# Define route to get matches of a document associated with a class ID for the logged-in user
@student_document_bp.route("/matches/<id>/<document>", methods=["GET"])
def get_matches(id: str, document: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    try:
        results = model.find_matches(session["username"], id, document)
        return jsonify(results)
    except:
        abort(404, description="File not found")