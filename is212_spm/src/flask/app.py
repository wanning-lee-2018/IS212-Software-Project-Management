import db_class_creation as db_class
from multiprocessing import synchronize
import os
import sys
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import importlib.util
from sqlalchemy import delete
from sqlalchemy import create_engine
import pathlib


# In order to use unit test and regression test at the same time
sys.path.append("src/flask")


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:' + \
    "@localhost:3306/sample_data"


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100,
                                           'pool_recycle': 280}

db = SQLAlchemy(app)

CORS(app)
db.metadata.clear()

############## LOGIN #############


@app.route("/login/<staff_id>")
def login_status(staff_id):
    staff_record = db.session.query(db_class.Staff).filter_by(
        staff_id=str(staff_id)).first()
    print(staff_record)
    if not staff_record:
        return jsonify({
            "code": 404,
            "message": "Error in finding staff record"

        }), 404
    else:
        return str(staff_record.json()["role_id"])


############## COURSES #####################


@app.route("/courses")
def get_all_courses():
    list_courses = db.session.query(db_class.Course).all()

    if len(list_courses):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": [list_courses.json() for list_courses in list_courses]
                }
            }
        ), 200
    return jsonify(
        {
            "code": 404,
            "message": "There are no courses."
        }
    ), 404


# Function to Get Courses from selected Skills(1 or more)
@app.route("/get_courses_for_skills/<skill_id_list_in_str>")
def get_courses_for_skills(skill_id_list_in_str):

    # STEP 1: Decode the str into list
    list_of_skills = json.dumps(skill_id_list_in_str)
    # print("JSON DUMPS:   ", list_of_skills)
    list_of_courses = []

    list_of_skills = list_of_skills.replace(
        "\\", "").replace("\"", "").replace("[", "").replace("]", "")
    if "," in list_of_skills:
        list_of_skills = list_of_skills.split(",")
    # print("JSON REPLACE:   ", list_of_skills)

    for skill_id in list_of_skills:
        course_temp = db.session.query(db_class.Course).join(db_class.skill_course_association_table).join(db_class.Skill).filter(
            (db_class.Skill.skill_id == db_class.skill_course_association_table.skill_id) & (db_class.skill_course_association_table.skill_id == skill_id)).all()

        # AVOID repeats
        for course in course_temp:
            if course not in list_of_courses:
                list_of_courses.append(course)

    if len(list_of_courses):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": [c.json() for c in list_of_courses]
                }
            }
        ), 200
    elif len(list_of_courses) and type(list_of_courses) == "list":
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": []
                }
            }
        ), 200
    return jsonify(
        {
            "code": 404,
            "message": "There are no Courses found."
        }
    ), 404

# View COURSES in a STAFF's LearningJourney (requires staff_id)


@app.route("/get_all_lj_courses/<staff_id_in_str>")
def get_staff_courses_in_lj(staff_id_in_str):
    # search thru learning_journeys aka LearningJourney table to extract ones with staff_id==staff_id
    list_of_ljs_belonging_to_staffId = db.session.query(db_class.LearningJourney).filter(
        db_class.LearningJourney.staff_id == staff_id_in_str).all()
    # print("list_of_ljs_belonging_to_staffId:  ", list_of_ljs_belonging_to_staffId, staff_id_in_str)

    courses_in_LJ_Staff = []
    for lj in list_of_ljs_belonging_to_staffId:
        if(db.session.query(db_class.LJcourseAssociationTable).filter(db_class.LJcourseAssociationTable.lj_id == lj.lj_id).all() != []):
            courses_in_LJ_Staff += db.session.query(db_class.LJcourseAssociationTable).filter(
                db_class.LJcourseAssociationTable.lj_id == lj.lj_id).all()
    # print("courses_in_LJ_Staff ", courses_in_LJ_Staff)

    if len(courses_in_LJ_Staff):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": [course_list.json() for course_list in courses_in_LJ_Staff]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no courses."
        }
    ), 404


@app.route("/courses/<course_id>")
def get_specific_course(course_id):
    course = db.session.query(db_class.Course).filter_by(
        course_id=course_id).first()
    if not course:
        return jsonify({
            "code": 404,
            "message": "Course not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "course": course.json()
            }
        }
    )


############# LEARNING JOURNEY #################

# add courses to lj-course table
@app.route("/add_lj_courses/<staff_id>", methods=['POST'])
def add_courses_to_lj(staff_id):
    if request.is_json:

        request_obj = request.get_json()
        course_id = request_obj["course_id"]
        jobrole_id_arr = request_obj["jobrole_id"]
        for id in jobrole_id_arr:
            # print("here" + str(id))
            learning_journeys = db.session.query(db_class.LearningJourney).filter_by(
                staff_id=staff_id, jobrole_id=id).first()
            print(learning_journeys.json()["lj_id"])
            lj_id = learning_journeys.json()["lj_id"]

            # Initialise course_completion as empty FIRST as adding of courses into LJ does not equate to enrolling which does not equate to getting started on course so NOT OnGoing
            course_completion = None
            ljcourseassociation = db_class.LJcourseAssociationTable(
                lj_id=lj_id, course_id=course_id, course_completion=course_completion)
            try:
                db.session.add(ljcourseassociation)
                db.session.commit()

            except Exception as e:
                # unexpected error in code
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ex_str = str(e) + " at " + str(exc_type) + ": " + \
                    fname + ": line " + str(exc_tb.tb_lineno)
                print(ex_str)

                return jsonify({
                    "code": 401,
                    "message": "Duplicate course found, course already added"
                }), 401

        return jsonify({
            "code": 201,
            "message": "course Saved Successfully"
        }), 201

# add delete to lj-course table


@app.route("/delete_lj_course/<lj_id>/<course_id>", methods=['DELETE'])
def delete_courses_of_lj(lj_id, course_id,):
    course = db.session.query(db_class.LJcourseAssociationTable).filter_by(
        lj_id=lj_id, course_id=course_id).first()
    try:
        local_mapping = db.session.merge(course)
        db.session.delete(course)
        db.session.commit()
    except Exception as e:
        # unexpected error in code
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        ex_str = str(e) + " at " + str(exc_type) + ": " + \
            fname + ": line " + str(exc_tb.tb_lineno)
        print(ex_str)

    return jsonify({
        "code": 201,
        "message": "Course remove from LJ"
    }), 201

# Add job role selected by staff


@app.route("/add_role_to_LJ", methods=['POST'])
def add_role_to_LJ():
    if request.is_json:
        try:
            request_obj = request.get_json()
            staff_id = request_obj['staff_id']
            # print(staff_id)
            role_id = request_obj['jobrole_id']
            # print(role_id)
            role_name = request_obj['jobrole_name']

            LearningJourney = db_class.LearningJourney(
                staff_id=staff_id, jobrole_id=role_id, jobrole_name=role_name)

            try:
                db.session.add(LearningJourney)
                db.session.commit()
            except Exception as e:
                # unexpected error in code
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ex_str = str(e) + " at " + str(exc_type) + ": " + \
                    fname + ": line " + str(exc_tb.tb_lineno)
                print(ex_str)

                return jsonify({
                    "code": 401,
                    "message": "Duplicate jobrole or id"
                }), 401

            return jsonify({
                "code": 201,
                "message": "job role Saved Successfully"
            }), 201

        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "Error saving job role to database: " + ex_str
            }), 500

# Get specific learning_journeys by staff_id


@app.route("/learning_journey/<staff_id>")
def get_specific_learning_journey(staff_id):
    roles = db.session.query(db_class.LearningJourney).filter_by(
        staff_id=staff_id).all()
    if not roles:
        return jsonify({
            "code": 404,
            "message": "No roles for specific Staff found / staff_id not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "jobrole": [roles.json() for roles in roles]
            }
        }
    )

# Get specific learning_journeys by staff_id


@app.route("/learning_journey/<staff_id>/<role_id>")
def get_specific_learning_journey_role(staff_id, role_id):
    roles = db.session.query(db_class.LearningJourney).filter_by(
        staff_id=staff_id, jobrole_id=role_id).first()
    print(roles)
    if not roles:
        return jsonify({
            "code": 404,
            "message": "No roles for specific Staff found / staff_id not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "jobrole": roles.json()
            }
        }
    )

# Get skills of a specific jobrole


@app.route("/skills_of_lj/<jobrole_id>")
def get_skills_of_lj(jobrole_id):
    skills = db.session.query(db_class.skill_jobrole_association_table).filter_by(
        jobrole_id=jobrole_id).all()
    if not skills:
        return jsonify({
            "code": 404,
            "message": "No skills for jobrole."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "skill": [skills.json() for skills in skills]
            }
        }
    )

# Get courses of a specific learning journey


@app.route("/courses_of_lj/<lj_id>")
def get_courses_lj_id(lj_id):
    courses = db.session.query(db_class.LJcourseAssociationTable).filter_by(
        lj_id=lj_id).all()
    if not courses:
        return jsonify({
            "code": 404,
            "message": "No courses for specific learning journey."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "course": [courses.json() for courses in courses]
            }
        }
    )

# Get course completion status of a  specific course of aspecific learning journey


@app.route("/course_status/<lj_id>/<course_id>")
def get_course_status(lj_id, course_id):
    status = db.session.query(db_class.LJcourseAssociationTable).filter_by(
        lj_id=lj_id, course_id=course_id).all()
    if not status:
        return jsonify({
            "code": 404,
            "message": "Error in finding course"
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "status": [status.json() for status in status]
            }
        }
    )

# Get completion status of skills in learning journey and num of completed learning journey


@app.route("/completed_lj/<staff_id>")
def get_completed_lj(staff_id):

    lj_status_tup = db.session.query(
        db_class.LearningJourney.jobrole_id,
        db_class.skill_jobrole_association_table.skill_id,
        db_class.skill_course_association_table.course_id,
        db_class.LJcourseAssociationTable.course_completion
    ).outerjoin(
        db_class.skill_jobrole_association_table,
        db_class.LearningJourney.jobrole_id == db_class.skill_jobrole_association_table.jobrole_id
    ).outerjoin(
        db_class.skill_course_association_table,
        db_class.skill_jobrole_association_table.skill_id == db_class.skill_course_association_table.skill_id
    ).outerjoin(
        db_class.LJcourseAssociationTable,
        db_class.skill_course_association_table.course_id == db_class.LJcourseAssociationTable.course_id
    ).filter(
        db_class.LearningJourney.staff_id == staff_id
    ).all()
    #  Return result is as follows:
    # (jobrole_id, skill_id, course_id, course_status)
    # (1, 1, 'ABC123', None)
    # (1, 2, 'COR1305', 'Completed')

    if len(lj_status_tup):
        completed_lj_num = 0
        # Transform data to dict
        jobrole_dict = {"jobrole_id": {}}
        for item in lj_status_tup:
            jobrole_dict["jobrole_id"].update({item[0]: {"skill_id": {}}})

        for item in lj_status_tup:
            jobrole_dict['jobrole_id'][item[0]]["skill_id"].update(
                {item[1]: {"course_id": {}}})
            if item[3] == "Completed":
                jobrole_dict['jobrole_id'][item[0]]["skill_id"].update(
                    {item[1]: {"skill_completion": "Completed", "course_id": {}}})

        for item in lj_status_tup:
            jobrole_dict['jobrole_id'][item[0]]["skill_id"][item[1]]["course_id"].update(
                {item[2]: {"course_completion": item[3]}})

        for key in jobrole_dict['jobrole_id']:
            criteria_skill_completion = 0
            completed_actual = 0
            for skill in jobrole_dict['jobrole_id'][key]["skill_id"]:
                criteria_skill_completion += 1
                if "skill_completion" in jobrole_dict['jobrole_id'][key]["skill_id"][skill]:
                    completed_actual += 1

            if completed_actual >= criteria_skill_completion:
                completed_lj_num += 1

        print(completed_lj_num)

        # Transforms data in lj_status_dict to {(jobrole_id: job_role completion status)}

        return jsonify(
            {
                "code": 200,
                "data": {
                    "lj_completed_num": completed_lj_num,
                    "data_raw": jobrole_dict
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no completed learning journeys for the staff specified."
        }
    ), 404

# Delete Learning Journey


@app.route("/delete_lj/<lj_id>", methods=["DELETE"])
def delete_lj(lj_id):
    lj = db.session.query(db_class.LearningJourney).filter_by(
        lj_id=lj_id).first()
    assoc = db.session.query(
        db_class.LJcourseAssociationTable).filter_by(lj_id=lj_id).first()
    msg = ""

    if lj != None:
        stmt1 = (
            delete(db_class.LearningJourney).
            where(db_class.LearningJourney.lj_id == lj_id)
        )
        db.engine.execute(stmt1)
        msg += "| Learning journey deleted |"

    if assoc != None:
        stmt2 = (
            delete(db_class.LJcourseAssociationTable).
            where(db_class.LJcourseAssociationTable.lj_id == lj_id)
        )
        db.engine.execute(stmt2)
        msg += "| Association deleted |"

    if msg != "":
        return jsonify({
            "message": msg
        }, 200)
    else:
        return jsonify({
            "message": "No learning journey or Association found!"
        }, 404)


################ SKILLS #####################
# Get all skills & respective associations
@app.route("/skills")
def get_skills():
    skilllist = db.session.query(db_class.Skill).all()
    if len(skilllist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skill": [skill.json() for skill in skilllist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no skills."
        }
    ), 404


# Get specific skill and its associations
@app.route("/skills/<skill_id>")
def get_specific_skill(skill_id):
    skill = db.session.query(db_class.Skill).filter_by(
        skill_id=skill_id).first()
    if not skill:
        return jsonify({
            "code": 404,
            "message": "Skill not found"
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "skill": skill.json()
            }
        }
    )


# Create new skill
@app.route("/create_skill", methods=['POST'])
def create_skill():
    if request.is_json:
        try:
            skill = request.get_json()
            print("\n Skill received in: ", type(skill), skill)
            # skill_id = skill['skill_id']
            # print(skill_id)
            skill_name = skill['skill_name']
            skill_status = skill['skill_status']

            skill = db_class.Skill(skill_name=skill_name,
                                   skill_status=skill_status)

            try:
                db.session.add(skill)
                db.session.commit()
            except Exception as e:
                # unexpected error in code
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ex_str = str(e) + " at " + str(exc_type) + ": " + \
                    fname + ": line " + str(exc_tb.tb_lineno)
                print(ex_str)

                return jsonify({
                    "code": 401,
                    "message": "Duplicate skill or id"
                }), 401

            return jsonify({
                "code": 201,
                "message": "Skill Saved Successfully"
            }), 201

        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "Error saving skill to database: " + ex_str
            }), 500

# Function to Get Skills from selected Job Roles(1 or more)


@app.route("/skills_for_jobroles_list/<jobroles_list_in_str>")
def get_skills_for_jobrole(jobroles_list_in_str):

    # STEP 1: Decode the str into list
    list_of_roles = json.dumps(jobroles_list_in_str)
    # print("BEFORE", list_of_roles)
    skill_list = []

    list_of_roles = list_of_roles.replace(
        "\\", "").replace("\"", "").replace("[", "").replace("]", "")
    if "," in list_of_roles:
        list_of_roles = list_of_roles.split(",")
    else:
        list_of_roles = [list_of_roles]

    # print("AFTER", list_of_roles)

    for jobrole_id in list_of_roles:
        print("HELOOOOOOOOOOOOOOOOOOOOOOOOOoo", jobrole_id)
        skills_temp = db.session.query(db_class.Skill).join(db_class.skill_jobrole_association_table).join(db_class.JobRole).filter(
            (db_class.Skill.skill_id == db_class.skill_jobrole_association_table.skill_id) & (db_class.skill_jobrole_association_table.jobrole_id == jobrole_id)).all()

        # AVOID repeats
        for skill in skills_temp:
            if skill not in skill_list:
                skill_list.append(skill)
    print("SKILLS: ", skill_list)

    if len(skill_list):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skill": [s.json() for s in skill_list]
                }
            }
        )
    elif len(skill_list) and type(skill_list) == "list":
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skill": []
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no skills for the specific job role."
        }
    ), 404

# soft delete skill


@app.route("/delete_skill/<skill_id>", methods=['GET'])
def delete_skill(skill_id):

    #print("\n Skill received in: ", type(skill_id), skill_id)
    #print("json" + request.get_json())
    # old ver:   skill = db_class.Skill.query.filter_by(skill_id=skill_id).first()
    skill = db.session.query(db_class.Skill).filter_by(
        skill_id=skill_id).first()
    # print(skill)
    try:
        skill.skill_status = "Retired"
        # print(skill.skill_id)
        # print(skill.skill_status)
        db.session.commit()
    except Exception as e:
        # unexpected error in code
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        ex_str = str(e) + " at " + str(exc_type) + ": " + \
            fname + ": line " + str(exc_tb.tb_lineno)
        print(ex_str)

        return jsonify({
            "code": 401,
            "message": "Error with Deletion of skill(Soft delete not HARD)"
        }), 401

    return jsonify({
        "code": 200,
        "data": {
            "Skill": skill.json()
        }
    }), 201


# update skill name for skill id
@app.route("/update_skill/<skill_id>", methods=['POST'])
def update_skill(skill_id):
    if request.is_json:
        skill = request.get_json()
        #print("\n Skill IN UPDATE ", type(skill), skill)
        # print(skill)
        skill_db = db.session.query(db_class.Skill).filter_by(
            skill_id=skill_id).first()
        #skill = Skill(skill_name=skill_name, skill_status=skill_status)
        try:
            skill_db.skill_name = skill['skill_name']
            db.session.commit()
            skill_db.skill_status = skill['skill_status']
            db.session.commit()
        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 401,
                "message": "Duplicate skill or id"
            }), 401

        return jsonify({
            "code": 201,
            "message": "Skill Saved Successfully"
        }), 201


################ JOB ROLES #####################
@app.route("/job_roles_all")
def get_all_jobroles():
    rolelist = db.session.query(db_class.JobRole).all()
    roles_skills = db.session.query(db_class.JobRole.jobrole_id, db_class.Skill.skill_name).filter((db_class.skill_jobrole_association_table.jobrole_id == db_class.JobRole.jobrole_id) & (
        db_class.skill_jobrole_association_table.skill_id == db_class.Skill.skill_id)).all()
    if len(rolelist):
        jobrole = [jobrole.json() for jobrole in rolelist]
        temp = {}
        for (role, skill) in roles_skills:
            if role not in temp:
                temp[role] = []
            temp[role].append(skill)
        for dic in jobrole:
            dic["skills"] = "-"
            for role in temp:
                if dic["jobrole_id"] == role:
                    dic["skills"] = ", ".join(temp[role])
        return jsonify(
            {
                "code": 200,
                "data": {
                    "jobrole": jobrole
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no Job Roles."
        }
    ), 404

# Get all job roles dto


@app.route("/job_roles_filtered/<staff_id>")
# Note, only use this for the Staff View Roles page because there is additional configurations to
# filter to display only job roles that are not previously selected to create LJs
# and filter to display only active job roles
def get_remaining_jobroles(staff_id):
    # rolelist = db_class.JobRole.query.all()
    subquery = db.session.query(db_class.LearningJourney).all()
    subquery2 = [x.json() for x in subquery]
    id_lst = []
    for d in subquery2:
        print(d)
        if d["staff_id"] == staff_id:
            id_lst.append(d["jobrole_id"])
    print(id_lst)  # contains job role id that are alrdy in LJ for staff_id

    rolelist = db.session.query(db_class.JobRole).filter((
        db_class.JobRole.jobrole_id.not_in(id_lst)) & (db_class.JobRole.jobrole_status == "Active")).all()

    roles_skills = db.session.query(db_class.JobRole.jobrole_id, db_class.Skill.skill_name).filter((db_class.skill_jobrole_association_table.jobrole_id == db_class.JobRole.jobrole_id) & (
        db_class.skill_jobrole_association_table.skill_id == db_class.Skill.skill_id)).all()

    if len(rolelist):
        jobrole = [jobrole.json() for jobrole in rolelist]
        temp = {}
        for (role, skill) in roles_skills:
            if role not in temp:
                temp[role] = []
            temp[role].append(skill)
        for dic in jobrole:
            dic["skills"] = "-"
            for role in temp:
                if dic["jobrole_id"] == role:
                    dic["skills"] = ", ".join(temp[role])
        return jsonify(
            {
                "code": 200,
                "data": {
                    "jobrole": jobrole
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no Job Roles."
        }
    ), 404

# Get specific job role based on jobrole_id


@app.route("/job_role_by_id/<jobrole_id>")
def get_specific_jobrole_by_id(jobrole_id):
    role = db.session.query(db_class.JobRole).filter_by(
        jobrole_id=jobrole_id).first()
    if not role:
        return jsonify({
            "code": 404,
            "message": "Job role ID not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "jobrole": role.json()
            }
        }
    )

# Get specific job role based on jobrole_name


@app.route("/job_role/<jobrole_name>")
def get_specific_jobrole_by_name(jobrole_name):
    role = db.session.query(db_class.JobRole).filter_by(
        jobrole_name=jobrole_name).first()
    if not role:
        return jsonify({
            "code": 404,
            "message": "Job role name not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "jobrole": role.json()
            }
        }
    )

# Create new Job Role


@app.route("/create_jobrole", methods=['POST'])
def create_jobrole():
    if request.is_json:
        try:
            jobrole = request.get_json()
            print("\n Job Role received in: ", type(jobrole), jobrole)
            if jobrole['jobrole_name'] != "":
                jobrole_name = jobrole['jobrole_name']
            else:
                return jsonify({
                    "code": 402,
                    "message": "jobrole name missing!"
                }), 402
            # jobrole_name = jobrole['jobrole_name']
            jobrole_status = jobrole['jobrole_status']

            jobrole = db_class.JobRole(
                jobrole_name=jobrole_name, jobrole_status=jobrole_status)

            try:
                db.session.add(jobrole)
                db.session.commit()
            except Exception as e:
                # unexpected error in code
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ex_str = str(e) + " at " + str(exc_type) + ": " + \
                    fname + ": line " + str(exc_tb.tb_lineno)
                print(ex_str)

                return jsonify({
                    "code": 401,
                    "message": "Duplicate jobrole or id"
                }), 401

            return jsonify({
                "code": 201,
                "message": "Jobrole Saved Successfully"
            }), 201

        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "Error saving job role to database: " + ex_str
            }), 500


# soft delete job role.
@app.route("/delete_jobrole/<jobrole_id>", methods=['GET'])
def delete_jobrole(jobrole_id):
    #print("\n Jobrole received in: ", type(jobrole_id), jobrole_id)
    jobrole = db.session.query(db_class.JobRole).filter_by(
        jobrole_id=jobrole_id).first()
    jobrole.jobrole_status = "Retired"
    # print(jobrole)
    db.session.commit()

    if not jobrole:
        return jsonify({
            "code": 404,
            "message": "Job role name not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "JobRole": jobrole.json()
            }
        }
    )


# Edit existing Job Role
@app.route("/update_jobrole/<jobrole_id>", methods=['POST'])
def update_jobrole(jobrole_id):
    if request.is_json:
        jobrole = request.get_json()
        # OLD VER:  jobrole_details = db_class.JobRole
        # NEW VER:  jobrole_details = db.session.query(db_class.JobRole)
        jobrole_details = db.session.query(db_class.JobRole).filter_by(
            jobrole_id=jobrole_id).first()

        try:
            if jobrole_details.jobrole_name != jobrole['jobrole_name']:
                jobrole_details.jobrole_name = jobrole['jobrole_name']
                db.session.commit()
            print("SAMENAME")
            jobrole_details.jobrole_status = jobrole['jobrole_status']
            db.session.commit()
        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 401,
                "message": "Duplicate name or id"
            }), 401

        return jsonify({
            "code": 201,
            "message": "Jobrole edits Saved Successfully"
        }), 201

# Create new link Job Role - Skill relation


@app.route("/create_mapping_jobrole_skill", methods=['POST'])
def map_jobrole_skill():
    if request.is_json:
        try:
            new_mapping_obj = request.get_json()
            new_jobrole_id = new_mapping_obj['jobrole_id']

            skills = new_mapping_obj['skill_array']

            # Clear existing links FIRST before adding new ones
            db.session.query(db_class.skill_jobrole_association_table).filter_by(
                jobrole_id=new_jobrole_id).delete()

            for skill in skills:
                new_skill = db_class.skill_jobrole_association_table(
                    skill_id=skill["skill_id"], jobrole_id=new_jobrole_id)
                try:
                    db.session.add(new_skill)
                except Exception as e:
                    exc_type, exc_obj, exc_tb = sys.exc_info()
                    fname = os.path.split(
                        exc_tb.tb_frame.f_code.co_filename)[1]
                    ex_str = str(e) + " at " + str(exc_type) + ": " + \
                        fname + ": line " + str(exc_tb.tb_lineno)
                    print(ex_str)
                    return jsonify({
                        "code": 401,
                        "message": "Error with Linking Jobrole to Skill #1"
                    }), 401

            try:
                db.session.commit()
            except Exception as e:
                # unexpected error in code
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ex_str = str(e) + " at " + str(exc_type) + ": " + \
                    fname + ": line " + str(exc_tb.tb_lineno)
                print(ex_str)

                return jsonify({
                    "code": 401,
                    "message": "Error with Linking Jobrole to Skill #2"
                }), 401

            return jsonify({
                "code": 201,
                "message": "mapping Saved Successfully"
            }), 201

        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "Error saving jobrole-skill mapping to database: " + ex_str
            }), 500

# Create new link Course - Skill relation


@app.route("/create_mapping_skill_courses", methods=['POST'])
def map_skill_courses():
    if request.is_json:
        try:
            new_mapping_obj = request.get_json()
            print("new_mapping_obj ", new_mapping_obj)
            new_skill_id = new_mapping_obj['skill_id']
            courses = new_mapping_obj['course_array']

            for course in courses:
                new_course = db_class.skill_course_association_table(
                    course_id=course["course_id"], skill_id=new_skill_id)
                try:
                    db.session.add(new_course)
                except Exception as e:
                    exc_type, exc_obj, exc_tb = sys.exc_info()
                    fname = os.path.split(
                        exc_tb.tb_frame.f_code.co_filename)[1]
                    ex_str = str(e) + " at " + str(exc_type) + ": " + \
                        fname + ": line " + str(exc_tb.tb_lineno)
                    print(ex_str)
                    return jsonify({
                        "code": 401,
                        "message": "Error with Linking Courses to Skill #1"
                    }), 401

            try:
                db.session.commit()
            except Exception as e:
                # unexpected error in code
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ex_str = str(e) + " at " + str(exc_type) + ": " + \
                    fname + ": line " + str(exc_tb.tb_lineno)
                print(ex_str)

                return jsonify({
                    "code": 401,
                    "message": "Error with Linking Courses to Skill #2"
                }), 401

            return jsonify({
                "code": 201,
                "message": "mapping Saved Successfully"
            }), 201

        except Exception as e:
            # unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "Error saving course-skill mapping to database: " + ex_str
            }), 500


# get mapping by skill and course id
@app.route("/get_mapping/<skill_id>/<course_id>")
def get_specific_skill_course_mapping(skill_id, course_id):
    mappings = db.session.query(db_class.skill_course_association_table).filter_by(
        skill_id=skill_id, course_id=course_id).first()
    if not mappings:
        return jsonify({
            "code": 404,
            "message": "mapping not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "mapping": mappings.json()
            }
        }
    )


@app.route("/delete_mapping/<skill_id>/<course_id>", methods=["DELETE"])
def mapping_delete(skill_id, course_id):
    mapping = db.session.query(db_class.skill_course_association_table).filter_by(
        skill_id=skill_id, course_id=course_id).first()
    try:
        local_mapping = db.session.merge(mapping)
        db.session.delete(local_mapping)
        db.session.commit()
    except Exception as e:
        # unexpected error in code
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        ex_str = str(e) + " at " + str(exc_type) + ": " + \
            fname + ": line " + str(exc_tb.tb_lineno)
        print(ex_str)
        return jsonify({
            "code": 500,
            "message": "Mapping could not be deleted"
        }), 500

    return jsonify({
        "code": 201,
        "message": "Mapping deleted"
    }), 201


# -------------------------- ROUTES FOR TESTING PURPOSES ONLY --------------------------
# ROUTE FOR TESTING PURPOSE: to ACTUALLY "reset" DB (ACTUALLY HARD DELETE test role and test skill created during regression testing)
@app.route("/testing_purpose_delete_skill/<skill_name>", methods=["DELETE"])
def testing_purpose_delete_skill(skill_name):
    skill_to_delete = db.session.query(
        db_class.Skill).filter_by(skill_name=skill_name).first()

    if skill_to_delete != None:
        stmt1 = (
            delete(db_class.Skill).
            where(db_class.Skill.skill_name == skill_name)
        )
        db.engine.execute(stmt1)
        msg = "| Skill deleted |"

        return jsonify({
            "message": msg
        }, 200)
    else:
        return jsonify({
            "message": "Skill could not be found!"
        }, 404)

# ROUTE FOR TESTING PURPOSE: to ACTUALLY "reset" DB (ACTUALLY HARD DELETE test role and test skill created during regression testing)


@app.route("/testing_purpose_delete_jobrole/<jobrole_name>", methods=["DELETE"])
def testing_purpose_delete_jobrole(jobrole_name):
    jobrole_to_delete = db.session.query(db_class.JobRole).filter_by(
        jobrole_name=jobrole_name).first()

    if jobrole_to_delete != None:
        stmt1 = (
            delete(db_class.JobRole).
            where(db_class.JobRole.jobrole_name == jobrole_name)
        )
        db.engine.execute(stmt1)
        msg = "| Job Role deleted |"

        return jsonify({
            "message": msg
        }, 200)
    else:
        return jsonify({
            "message": "Job Role could not be found!"
        }, 404)


# Delete Learning Journey
@app.route("/testing_purpose_delete_all_lj/<staff_id>", methods=["DELETE"])
def testing_purpose_delete_all_lj(staff_id):
    print("TESTING PURPOSE ONLY: testing_purpose_delete_all_lj", staff_id)
    # GET ALL STAFF's LJs
    LJs = db.session.query(db_class.LearningJourney).filter_by(
        staff_id=staff_id).all()
    msg = ""
    for x in LJs:
        print("--------------", x)

        lj = db.session.query(db_class.LearningJourney).filter_by(
            lj_id=x.lj_id).first()
        assoc = db.session.query(db_class.LJcourseAssociationTable).filter_by(
            lj_id=x.lj_id).first()

        if lj != None:
            stmt1 = (
                delete(db_class.LearningJourney).
                where(db_class.LearningJourney.lj_id == x.lj_id)
            )
            db.engine.execute(stmt1)
            msg += "| Learning journey deleted |"

        if assoc != None:
            stmt2 = (
                delete(db_class.LJcourseAssociationTable).
                where(db_class.LJcourseAssociationTable.lj_id == x.lj_id)
            )
            db.engine.execute(stmt2)
            msg += "| Association deleted |"

    if msg != "":
        return jsonify({
            "message": msg
        }, 200)
    else:
        return jsonify({
            "message": "No learning journey or Association found!"
        }, 404)


# Search for jobrole by name (possible due to no repeated names allowed)
@app.route("/searchbyname_jobrole/<jobrole_name>", methods=['GET'])
def search_jobrole(jobrole_name):
    jobrole = db.session.query(db_class.JobRole).filter_by(
        jobrole_name=jobrole_name).first()

    if not jobrole:
        return jsonify({
            "code": 404,
            "message": "Job role name not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "JobRole": jobrole.json()
            }
        }
    )

# Search for skill by name (possible due to no repeated names allowed)


@app.route("/searchbyname_skill/<skill_name>", methods=['GET'])
def search_skill(skill_name):
    skill = db.session.query(db_class.Skill).filter_by(
        skill_name=skill_name).first()

    if not skill:
        return jsonify({
            "code": 404,
            "message": "Skill name not found / not valid."
        }), 404
    return jsonify(
        {
            "code": 200,
            "data": {
                "Skill": skill.json()
            }
        }
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
