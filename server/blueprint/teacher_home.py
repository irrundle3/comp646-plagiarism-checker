from flask import Blueprint, request, jsonify
from app import db
from user_models import  Class, Teacher, Student

teacher_home_bp = Blueprint('teacher_home_bp', __name__)

@teacher_home_bp.route("/api/teacher/home", methods=["POST"])
def create_class_with_students():
    # Get data from the request
    data = request.json
    teacher_id = data.get('teacher_username')
    class_name = data.get('class_name')
    student_ids = data.get('student_usernames')

    # Find the teacher by username
    teacher = Teacher.query.get(teacher_id)

    if teacher:
        # Create a new class
        new_class = Class(name=class_name, teacher_id=teacher.id)
        students = Student.query.filter(Student.id.in_(student_ids)).all()

        new_class.enrolled_students.extend(students)

        teacher.classes_taught.append(new_class)
        db.session.add(new_class)
        db.session.commit()
        


        return jsonify({'message': 'Class created successfully'}), 200
    else:
        return jsonify({'error': 'Teacher not found'}), 404
    
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