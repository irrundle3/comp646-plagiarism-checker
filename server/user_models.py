import sys
print(sys.version)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY

# Create a SQLAlchemy instance
db = SQLAlchemy()

enrollment = db.Table('enrollment',
    db.Column('student_id', db.Integer, db.ForeignKey('Student.id'), primary_key=True),
    db.Column('class_id', db.Integer, db.ForeignKey('Class.id'), primary_key=True)
)
teacher_student_association = db.Table('teacher_student_association',
    db.Column('teacher_id', db.Integer, db.ForeignKey('Teacher.id'), primary_key=True),
    db.Column('student_id', db.Integer, db.ForeignKey('Student.id'), primary_key=True)
)

class Student(db.Model):
    __tablename__ = 'Student'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    classes_enrolled = db.relationship('Class', secondary='enrollment', backref='students_enrolled', lazy='dynamic')
    teachers = db.relationship('Teacher', secondary='teacher_student_association', backref='teachers', lazy='dynamic')

class Teacher(db.Model):
    __tablename__ = 'Teacher'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    classes_taught = db.relationship('Class', backref='taught_by_teacher', lazy=True)
    students = db.relationship('Student', secondary='teacher_student_association', backref='students', lazy='dynamic')

class Class(db.Model):
    __tablename__ = 'Class'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('Teacher.id'), nullable=False)
    teacher = db.relationship('Teacher', backref='classes', lazy=True, overlaps="classes_taught, taught_by_teacher")
    enrolled_students = db.relationship('Student', secondary='enrollment', backref='enrolled_classes', lazy='dynamic')

class UploadedFile(db.Model):
    __tablename__ = "File"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('Student.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('Class.id'), nullable=False)
    path = db.Column(db.String(100), nullable=False)
    embedding = db.Column(db.LargeBinary, nullable=False)