from flask import Flask
from flask import request, jsonify, session, abort
import json

app = Flask(__name__)

app.secret_key = "DEBUG"

class_lists = {}

print("hi")
@app.route("/")
def slash():
    return "Hello"

@app.route("/api")
def index():
    print("hi")
    return "Hello world!"

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
    if session["username"] not in class_lists:
        class_lists[session["username"]] = []
    print(request.data)
    class_lists[session["username"]].append(id)
    return {"id":id}