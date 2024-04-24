from flask import Blueprint, request, jsonify
from app import db
import os
from user_models import  Class, Teacher, Student, UploadedFile

teacher_home_bp = Blueprint('teacher_home_bp', __name__)

@teacher_home_bp.route("/teacher/home", methods=["POST"])
def create_class_with_students():
    # Get data from the request
    data = request.json
    teacher_username = data.get('teacher_username')
    class_name = data.get('class_name')

    # Find the teacher by username
    teacher = Teacher.query.filter_by(username=teacher_username).first()

    if teacher:
        # Create a new class
        new_class = Class(name=class_name, teacher_id=teacher.id,teacher = teacher)
        
        # Get all students associated with the teacher
        students = teacher.students.all()

        # Add each student to the new class if not already enrolled
        for student in students:
            if student not in new_class.enrolled_students:
                new_class.enrolled_students.append(student)

        # Add the new class to the teacher's classes_taught
        teacher.classes_taught.append(new_class)
        
        # Commit changes to the database
        db.session.add(new_class)
        db.session.commit()

        return jsonify({'message': 'Class created successfully'}), 200
    else:
        return jsonify({'error': 'Teacher not found'}), 404

    
@teacher_home_bp.route("/teacher/register-student", methods=["POST"])
def register_student():
    # Get data from the request
    data = request.json
    teacher_username = data.get('teacher_username')
    student_username = data.get('student_username')

    # Find the teacher by username
    teacher = Teacher.query.filter_by(username=teacher_username).first()
    student = Student.query.filter_by(username=student_username).first()

    if teacher and student:
        teacher.students.append(student)
        db.session.commit()

        return jsonify({'message': 'Student registered successfully'}), 200
    else:
        return jsonify({'error': 'Teacher or student not found'}), 404

    
@teacher_home_bp.route("/teacher/classesget", methods=["GET"])
def get_all_classes():
    classes = Class.query.all()
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
from flask import request



@teacher_home_bp.route("/teacher/classes", methods=["GET"])
def get_teacher_classes():
    teacher_username = request.args.get('teacher_username')
    if not teacher_username:
        return jsonify({'error': 'No teacher username provided'}), 400

    teacher = Teacher.query.filter_by(username=teacher_username).first()
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    classes = teacher.classes_taught
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

@teacher_home_bp.route("/teacher/students", methods=["GET"])
def get_student_classes():
    teacher_username = request.args.get('teacher_username')
    if not teacher_username:
        return jsonify({'error': 'No teacher username provided'}), 400

    teacher = Teacher.query.filter_by(username=teacher_username).first()
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    students = teacher.students
    student_data = []
    for student_obj in students:
        student_info = {
            'id': student_obj.id,
            'username': student_obj.username,
            'password': student_obj.password
        }
        student_data.append(student_info)
    return jsonify(student_data)

@teacher_home_bp.route("/teacher/class/students", methods=["GET"])
def get_student_from_classes():
    classId = request.args.get('class_id')
    if not classId:
        return jsonify({'error': 'No classid provided'}), 400

    class_obj = Class.query.filter_by(id=classId).first()
    if not class_obj:
        return jsonify({'error': 'Class not found'}), 404

    students = class_obj.enrolled_students
    student_data = []
    for student_obj in students:
        student_info = {
            'id': student_obj.id,
            'username': student_obj.username,
            'password': student_obj.password
        }
        student_data.append(student_info)
    return jsonify(student_data)

@teacher_home_bp.route("/teacher/class/students/document", methods=["GET"])
def get_document_from_id():
    print("jfei")
    document_id = request.args.get('document_id')

    if not document_id:
        return jsonify({'error': 'No document provided'}), 400

    file_obj = UploadedFile.query.filter_by(id=document_id).first()
    student_obj = Student.query.filter_by(id=file_obj.student_id).first()
    print("jfei")

    if not file_obj:
        return jsonify({'error': 'Document not found'}), 404

    file_name_with_extension = os.path.basename(file_obj.path) 
    response_data = {
        'file_name': file_name_with_extension, 
        'class_id': file_obj.class_id,  
        'student_name': student_obj.username 
    }

    return jsonify(response_data)
