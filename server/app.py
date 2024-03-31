from flask import Flask
from flask import request, jsonify, session, abort
import json

app = Flask(__name__)

app.secret_key = "DEBUG"

print("hi")
# @app.route("/api")
# def index():
#     print("hi")
#     return "Hello world!"

@app.route("/api/login", methods = ["POST", "GET"])
def login():
    print(request.method)
    if request.method == "POST":
        data = json.loads(request.data)
        print(data)
        session["username"] = data["username"]
        session["class_id"] = data["class_id"]
        return jsonify(data)
    if request.method == "GET":
        print(session)
        if "username" in session and "class_id" in session:
            print("here")
            return jsonify({
                "username":session["username"], 
                "class_id": session["class_id"]
            })
        else:
            abort(401, description="Unauthorized: Invalid credentials")
            return {}
        
@app.route("/api/logout")
def logout():
    if "username" in session and "class_id" in session:
        print("bruh")
        session.pop("username")
        session.pop("class_id")
        print(session)
        return "Successfully logged out"
    return {}