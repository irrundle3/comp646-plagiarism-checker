from flask import Blueprint, request, jsonify
from app import db
from user_models import  Class, Teacher, Student

teacher_home_bp = Blueprint('teacher_home_bp', __name__)

@teacher_home_bp.route("/api/teacher/home", methods=["POST"])
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

    
@teacher_home_bp.route("/api/teacher/register-student", methods=["POST"])
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

    
@teacher_home_bp.route("/api/teacher/classesget", methods=["GET"])
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

@teacher_home_bp.route("/api/teacher/classes", methods=["GET"])
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
