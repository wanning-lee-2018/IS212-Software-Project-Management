import csv
import os
import sys
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json


# SWITCH TO THIS FOR RUNNING UNIT TESTS
# import src.flask.db_class_creation as db_class

# SWITCH BACK TO THIS FOR app.py
# KEEP THE FOLLOWING LINE COMMENTED WHEN PUSHING TO GITHUB!
import db_class_creation as db_class
# Configuration to MySQL DB


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:' + \
                                        "@localhost:3306/sample_data"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100,
                                           'pool_recycle': 280}

db = SQLAlchemy(app)

CORS(app)
db.metadata.clear()
registrationtable = []


# 1. Read CSV file, store in registration table list
with open("./registration.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        course_id = row[1]
        staff_id = row[2]
        status = row[4]

        # Add if conditional if we only want completed course contents
        # if status == "Completed":
        registrationtable.append([staff_id, course_id, status])


# 2. Based on entries in CSV, find the corresponding entry in DB
for item in registrationtable:
    # Grab the data from registration table
    staff_id_local = item[0]
    course_id_local = item[1]
    status = item[2]

    # Query for matching entry in DB
    staff_courses = db.session.query(
        db_class.LJcourseAssociationTable.course_id,
        db_class.LJcourseAssociationTable.lj_id,
        db_class.LearningJourney.staff_id,
        db_class.LJcourseAssociationTable.course_completion
    ).outerjoin(
        db_class.LearningJourney,
        db_class.LJcourseAssociationTable.lj_id == db_class.LearningJourney.lj_id
    ).filter(
        (db_class.LearningJourney.staff_id == staff_id_local) & (
            db_class.LJcourseAssociationTable.course_id == course_id_local)
    ).first()

    # If there is a match, update the completion status in LJ course Association table.
    if staff_courses:
        try:
            LJCourse = db.session.query(db_class.LJcourseAssociationTable).filter(
                db_class.LJcourseAssociationTable.lj_id == staff_courses[1]).first()
            LJCourse.course_completion = status
            db.session.commit()
        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)
print("SUCCESS!")
