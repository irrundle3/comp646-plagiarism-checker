from flask import request, Blueprint, jsonify, session, abort, send_file
import os
from preprocessing import path_to_txt
import model

student_document_bp = Blueprint('student_document', __name__)

# Define route to get the documents associated with a class ID for the logged-in user
@student_document_bp.route("/api/documents/<id>", methods=["GET"])
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
@student_document_bp.route("/api/download/<id>/<document>", methods=["GET"])
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
@student_document_bp.route("/api/text/<id>/<document>", methods=["GET"])
def get_text(id: str, document: str):
    if "username" not in session:
        # Return unauthorized error if user is not logged in
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    file_path = f"user_files/{session['username']}_files/{id}/{document}"
    file_path = path_to_txt(file_path)
    if file_path is not None and os.path.isfile(file_path):
        with open(file_path, "r") as file:
            text = file.read()
            return jsonify({"text": text})
    abort(404, description="File not found")

# Define route to get matches of a document associated with a class ID for the logged-in user
@student_document_bp.route("/api/matches/<id>/<document>", methods=["GET"])
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