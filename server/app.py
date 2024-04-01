from flask import Flask
from flask import request, jsonify, session, abort, send_file
import json
import os
import atexit
import shutil
from preprocessing import to_txt

app = Flask(__name__)

app.secret_key = "DEBUG"

class_lists = {}
os.mkdir("user_files")

@app.route("/api/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        data = json.loads(request.data)
        session["username"] = data["username"]
        return jsonify(data)
    if request.method == "GET":
        print(session)
        if "username" in session:
            print("here")
            return jsonify({
                "username":session["username"]
            })
        else:
            abort(401, description="Unauthorized: Invalid credentials")
            return {}
        
@app.route("/api/logout")
def logout():
    if "username" in session:
        session.pop("username")
        print(session)
        return "Successfully logged out"
    return {}

@app.route("/api/register", methods = ["POST"])
def register():
    data = json.loads(request.data)
    session["username"] = data["username"]
    return jsonify(data)

@app.route("/api/class-list", methods = ["GET"])
def class_list():
    if "username" not in session:
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    if session["username"] not in class_lists:
        class_lists[session["username"]] = []
    class_list = class_lists[session["username"]]
    return jsonify(class_list)

@app.route("/api/add-class-id/<id>", methods = ["POST"])
def add_class_id(id: str):
    if "username" not in session:
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    if session["username"] not in class_lists:
        class_lists[session["username"]] = []
    class_lists[session["username"]].append(id)
    return {"id":id}

@app.route("/api/upload/<id>", methods = ["POST"])
def upload_file(id: str):
    if "username" not in session:
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
    return {"id":id}

@app.route("/api/documents/<id>", methods = ["GET"])
def get_documents(id: str):
    if "username" not in session:
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    if os.path.isdir(f"user_files/{session['username']}_files/{id}"):
        files = os.listdir(f"user_files/{session['username']}_files/{id}")
        files = [file for file in files if file[0] != "."]
    else:
        files = []
    return files

@app.route("/api/download/<id>/<document>", methods=["GET"])
def download(id: str, document: str):
    if "username" not in session:
        abort(401, description="Unauthorized: Invalid credentials")
        return {}
    file_path = f"user_files/{session['username']}_files/{id}/{document}"
    if os.path.isfile(file_path):
        return send_file(file_path, as_attachment=True)
    abort(401, description="Unauthorized: Invalid credentials")
    return {}

def exit_handler():
    shutil.rmtree("user_files/")

atexit.register(exit_handler)