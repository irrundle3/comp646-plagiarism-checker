from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY

# Create a SQLAlchemy instance
db = SQLAlchemy()

enrollment = db.Table('enrollment',
    db.Column('student_id', db.Integer, db.ForeignKey('Student.id'), primary_key=True),
    db.Column('class_id', db.Integer, db.ForeignKey('Class.id'), primary_key=True),
    db.Column('teacher_id', db.Integer, db.ForeignKey('Teacher.id'), primary_key=True),
    db.ForeignKeyConstraint(['student_id'], ['Student.id']),
    db.ForeignKeyConstraint(['teacher_id'], ['Teacher.id'])
)

# Define the Student model
class Class(db.Model):
    __tablename__ = 'Class'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('Teacher.id'), nullable=False)
    teacher = db.relationship('Teacher', backref=db.backref('taught_classes', lazy=True))
    enrolled_students = db.relationship('Student', secondary=enrollment, backref='enrolled_classes')

class Student(db.Model):
    __tablename__ = 'Student'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Teacher(db.Model):
    __tablename__ = 'Teacher'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    classes_taught = db.relationship('Class', backref='taught_by_teacher', lazy=True)
    students = db.relationship('Student', secondary=enrollment, backref='teachers')
