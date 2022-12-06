from ast import And
import os
from re import S
import sys
# from flask import Flask, request, jsonify
import flask_sqlalchemy
import flask_cors
import flask
from sqlalchemy.orm import backref


app = flask.Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:' + \
    "@localhost:3306/sample_data"


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100,
                                           'pool_recycle': 280}

db = flask_sqlalchemy.SQLAlchemy(app)

flask_cors.CORS(app)
db.metadata.clear()

##### code here ##############################


class LJcourseAssociationTable(db.Model):
    __tablename__ = "lj_course_association_table"

    course_id = db.Column(db.String(355), primary_key=True)
    # course_completion = db.Column(db.String(20), db.ForeignKey(
    #     "registration.completion_status"))
    course_completion = db.Column(db.String(20))
    lj_id = db.Column(db.Integer, db.ForeignKey(
        "learning_journey.lj_id"), primary_key=True)

    lj_child = db.relationship(
        "LearningJourney", back_populates="lj_parent")
    # registration = db.relationship(
    #     "Registration", back_populates="lj_course_association_table")

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)

        return result

    def json(self):
        # dto == data transfer object
        dto = {
            "lj_id": self.lj_id,
            "course_id": self.course_id,
            "course_completion": self.course_completion,
        }
        return dto


class Registration(db.Model):
    __tablename__ = "registration"

    reg_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(6))
    staff_id = db.Column(db.String(6))
    reg_status = db.Column(db.String(10))
    completion_status = db.Column(db.String(9))
    # lj_course_association_table = db.relationship(
    #     "LJcourseAssociationTable", back_populates="registration")

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)

        return result

    def json(self):
        # dto == data transfer object
        dto = {
            "reg_id": self.reg_id,
            "course_id": self.course_id,
            "staff_id": self.staff_id,
            "reg_status": self.reg_status,
            "completion_status": self.completion_status,
        }

        print("dto ", dto)
        return dto

# ONE Skill can exist independently
# ONE Skill can be in MANY Courses, ONE Course can have MANY Skills (Many-to-Many)
# ONE Skill can be in MANY JobRoles, ONE JobRole can have MANY Skills (Many-to-Many)


class skill_course_association_table(db.Model):
    __tablename__ = "skill_course_association_table"

    skill_id = db.Column(db.Integer, db.ForeignKey(
        "skill.skill_id"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey(
        "course.course_id"), primary_key=True)
    skill = db.relationship("Skill", back_populates="course")
    course = db.relationship("Course", back_populates="skill")

    def json(self):
        # dto == data transfer object
        dto = {
            "skill_id": self.skill_id,
            "course_id": self.course_id,
        }

        return dto


class skill_jobrole_association_table(db.Model):
    __tablename__ = "skill_jobrole_association_table"

    skill_id = db.Column(db.Integer, db.ForeignKey(
        "skill.skill_id"), primary_key=True)
    jobrole_id = db.Column(db.Integer, db.ForeignKey(
        "jobrole.jobrole_id"), primary_key=True)
    skill = db.relationship("Skill", back_populates="jobrole")
    jobrole = db.relationship("JobRole", back_populates="skill")

    def json(self):
        # dto == data transfer object
        dto = {
            "skill_id": self.skill_id,
            "jobrole_id": self.jobrole_id,
        }

        return dto


class Skill(db.Model):
    __tablename__ = 'skill'
    __table_args__ = {'extend_existing': True}

    skill_id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(50), nullable=False)
    skill_status = db.Column(db.String(15))

    course = db.relationship(
        'skill_course_association_table', back_populates='skill')
    jobrole = db.relationship(
        'skill_jobrole_association_table', back_populates='skill')

    # for skills n all its associations
    def json(self):
        # dto == data transfer object
        dto = {
            "skill_id": self.skill_id,
            "skill_name": self.skill_name,
            "skill_status": self.skill_status,
        }
        # Appending one or more COURSES to a skill
        dto['course'] = []
        for x in self.course:
            dto['course'].append(x.json())

        # Appending one or more JOB ROLES to a skill
        dto['jobrole'] = []
        for x in self.jobrole:
            dto['jobrole'].append(x.json())

        return dto

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)

        return result


class Course(db.Model):
    __tablename__ = 'course'
    __table_args__ = {'extend_existing': True}

    course_id = db.Column(db.String(20), nullable=False, primary_key=True)
    course_name = db.Column(db.String(50), nullable=False)
    course_desc = db.Column(db.String(255))
    course_status = db.Column(db.String(15))

    skill = db.relationship(
        'skill_course_association_table', back_populates="course")

    def json(self):
        # dto == data transfer object
        dto = {
            "course_id": self.course_id,
            "course_name": self.course_name,
            "course_desc": self.course_desc,
            "course_status": self.course_status,
        }

        return dto

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)

        return result


class LearningJourney(db.Model):
    __tablename__ = 'learning_journey'
    __table_args__ = {'extend_existing': True}

    lj_id = db.Column(
        db.Integer, nullable=False, primary_key=True)
    staff_id = db.Column(db.String(6), db.ForeignKey(
        "staff.staff_id"), primary_key=False)
    jobrole_id = db.Column(db.Integer, db.ForeignKey(
        "jobrole.jobrole_id"), nullable=True, primary_key=False)
    jobrole_name = db.Column(db.Integer, nullable=True, primary_key=False)

    lj_parent = db.relationship(
        "LJcourseAssociationTable", back_populates="lj_child", cascade="all,delete-orphan")
    staffs = db.relationship("Staff", back_populates="LearningJourneys",)
    jobrole_child = db.relationship("JobRole", back_populates="jobrole_parent")

    def json(self):
        # dto == data transfer object
        dto = {
            "lj_id": self.lj_id,
            "staff_id": self.staff_id,
            "jobrole_id": self.jobrole_id,
            "jobrole_name": self.jobrole_name,
        }

        print("dto ", dto)
        return dto


class JobRole(db.Model):
    __tablename__ = 'jobrole'
    __table_args__ = {'extend_existing': True}

    jobrole_id = db.Column(db.Integer, nullable=False, primary_key=True)
    jobrole_name = db.Column(db.String(50), nullable=False)
    # jobrole_desc = db.Column(db.String(55555))
    jobrole_status = db.Column(db.String(15))

    jobrole_parent = db.relationship(
        "LearningJourney", back_populates="jobrole_child")
    skill = db.relationship(
        "skill_jobrole_association_table", back_populates="jobrole")

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        print("result ", result)
        return result

    def json(self):
        # dto == data transfer object
        dto = {
            "jobrole_id": self.jobrole_id,
            "jobrole_name": self.jobrole_name,
            # "jobrole_desc": self.jobrole_desc,
            "jobrole_status": self.jobrole_status,
        }

        print("dto ", dto)
        return dto


class Role(db.Model):
    __tablename__ = 'role'
    __table_args__ = {'extend_existing': True}

    role_id = db.Column(db.Integer, nullable=False, primary_key=True)
    role_name = db.Column(db.String(20), nullable=False)
    staffs = db.relationship(
        "Staff", back_populates="roles")

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        print("result ", result)
        return result

    def json(self):
        # dto == data transfer object
        dto = {
            "role_id": self.role_id,
            "role_name": self.role_name,
        }

        print("dto ", dto)
        return dto


class Staff(db.Model):
    __tablename__ = 'staff'
    __table_args__ = {'extend_existing': True}

    staff_id = db.Column(db.String(6), nullable=False, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey(
        "role.role_id"), primary_key=False)

    roles = db.relationship(
        "Role", back_populates="staffs")

    LearningJourneys = db.relationship(
        "LearningJourney", back_populates="staffs")

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        print("result ", result)
        return result

    def json(self):
        # dto == data transfer object
        dto = {
            "staff_id": self.staff_id,
            "role_id": self.role_id,
        }

        print("dto ", dto)
        return dto
