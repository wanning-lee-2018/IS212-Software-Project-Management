"""
@api {get} /courses Get all course information
@apiName get_all_courses
@apiGroup Courses
@apiSuccess {Object[]} courses Array of Course Objects.
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "courses": [
            {
                "course_desc": "This foundation module aims to introduce students to the fundamental concepts and underlying principles of systems thinking,",
                "course_id": "COR001",
                "course_name": "Systems Thinking and Design",
                "course_status": "Active"
            },
            {
                "course_desc": "Apply Lean Six Sigma methodology and statistical tools such as Minitab to be used in process analytics",
                "course_id": "COR002",
                "course_name": "Lean Six Sigma Green Belt Certification",
                "course_status": "Active"
            }
        ]
    }
@apiError {String} message No courses found.
@apiErrorExample Error-Response: 
     HTTP/1.1 404 Not Found
     {
       "error": "UserNotFound"
     }
"""

"""
@api {get} /courses/:course_id Get a course for given course id
@apiParam {String} course_id Course unique ID.
@apiName get_specific_course
@apiGroup Courses
@apiSuccess {Object} course Single Course Object
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "course": {
                "course_desc": "This foundation module aims to introduce students to the fundamental concepts and underlying principles of systems thinking,",
                "course_id": "COR001",
                "course_name": "Systems Thinking and Design",
                "course_status": "Active"
        }
    }
@apiError {String}  message No course found for given course id.
@apiErrorExample Error-Response: 
     HTTP/1.1 404 Not Found
     {
       "message": "Course not found / not valid."
     }
"""

"""
@api {get} /skills Get all skills
@apiName get_skills
@apiGroup Skills

@apiSuccess {Object[]} skill Array of skill object & it's association.

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "skill": [
        {
            "course": [
            {
                "course_id": "COR001",
                "skill_id": 1
            }
            ],
            "jobrole": [
            {
                "jobrole_id": 2,
                "skill_id": 1
            }
            ],
            "skill_id": 1,
            "skill_name": "Data Analytics",
            "skill_status": "Active"
        },
        {
            "course": [
            {
                "course_id": "COR004",
                "skill_id": 2
            }
            ],
            "jobrole": [
            {
                "jobrole_id": 3,
                "skill_id": 2
            }
            ],
            "skill_id": 2,
            "skill_name": "Customer Service",
            "skill_status": "Active"
        }
      ]
    }

@apiError {String}  message Skill not found.
@apiErrorExample Error-Response: 
     HTTP/1.1 404 Not Found
     {
       "message": "Skill not found."
     }

"""
"""
@api {get} /skills/:skill_id Get a skill for given skill id
@apiName get_specific_skill
@apiGroup Skills

@apiParam {String} skill_id Skill unique ID.

@apiSuccess {Object} skill Single Skill Object.

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "skill": {
            "course": [
                {
                "course_id": "COR001",
                "skill_id": 1
                }
            ],
            "jobrole": [
                {
                "jobrole_id": 2,
                "skill_id": 1
                }
            ],
            "skill_id": 1,
            "skill_name": "Data Analytics",
            "skill_status": "Active"
        }
    }

@apiError {String}  message Skill not found.
@apiErrorExample Error-Response: 
     HTTP/1.1 404 Not Found
     {
       "message": "Skill not found."
     }

"""
"""
@api {POST} /create_skill Create new skill
@apiName create_skill
@apiGroup Skills
 
@apiBody {String} skill_name Skill Name.
@apiBody {String} skill_status Skill Status.

@apiSuccess {String} Message Skill saved successfully
 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "Skill Saved Successfully"
    }

@apiError {String}  message Duplicate skill or id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Duplicate skill or id."
     }
"""

"""
@api {POST} /update_skill/:skill_id Update Skill
@apiName update_skill
@apiGroup Skills

@apiParam {String} skill_id Skill unique ID.

@apiBody {String} skill_name Skill Name.
@apiBody {String} skill_status Skill Status.
 
@apiSuccess {String} message Skill saved successfully 

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "Skill Saved Successfully"
    }

@apiError {String}  message Duplicate skill or id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Duplicate skill or id."
     }
"""
"""
@api {get} /delete_skill/:skill_id Soft Delete Skill 
@apiName delete_skill
@apiGroup Skills

@apiParam {String} skill_id Skill unique ID.

@apiSuccess {Object} skill Updated Skill Object (skill_status changed to retired).

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "skill": {
            "course": [
                {
                "course_id": "COR001",
                "skill_id": 1
                }
            ],
            "jobrole": [
                {
                "jobrole_id": 2,
                "skill_id": 1
                }
            ],
            "skill_id": 1,
            "skill_name": "Data Analytics",
            "skill_status": "Retired"
        }
    }

@apiError {String}  message Error with deletion.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Error with Deletion of skill(Soft delete not HARD)"
     }

"""

"""
@api {get} /get_courses_for_skills/:skill_id_list_in_str Get courses for given skills
@apiName get_courses_for_skills
@apiGroup Skills

@apiParam {String} skill_id_list_in_str Skills ID (can be multiple).

@apiSuccess {Object[]} courses Array of course objects.


@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
     "courses": [
            {
                "course_desc": "This foundation module aims to introduce students to the fundamental concepts and underlying principles of systems thinking,",
                "course_id": "COR001",
                "course_name": "Systems Thinking and Design",
                "course_status": "Active"
            }
        ] 
    }

@apiError {String}  message No courses found.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "There are no Courses found."
     }

"""

"""
@api {get} /job_roles_all Get all jobroles
@apiName get_all_jobroles
@apiGroup Jobrole


@apiSuccess {Object[]} jobroles Array of jobrole objects

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "jobrole": [
            {
                "jobrole_id": 1,
                "jobrole_name": "Cloud Specialist ",
                "jobrole_status": "Active",
                "skills": "DevOps"
            },
            {
                "jobrole_id": 2,
                "jobrole_name": "Data Analyst",
                "jobrole_status": "Active",
                "skills": "Data Analytics"
            },
        ]
    }

@apiError {String}  message No Job Roles found.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "There are no Job Roles."
     }

"""
"""
@api {get} /job_roles_filtered/:staff_id Get remaining jobroles for given staff id
@apiName get_remaining_jobroles
@apiGroup Jobrole

@apiParam {String} staff_id Staff unique ID.

@apiSuccess {Object[]} jobroles Array of jobrole objects


@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "jobrole": [
            {
                "jobrole_id": 5,
                "jobrole_name": "Data Architect",
                "jobrole_status": "Active",
                "skills": "-"
            },
            {
                "jobrole_id": 6,
                "jobrole_name": "Software Engineer",
                "jobrole_status": "Active",
                "skills": "-"
            }
        ]
    }

@apiError {String}  message No Job Roles found.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "There are no Job Roles."
     }

"""

"""
@api {get} /job_role_by_id/:jobrole_id Get Jobrole for given jobrole id
@apiName get_specific_jobrole_by_id
@apiGroup Jobrole

@apiParam {String} jobrole_id Jobrole unique ID.

@apiSuccess {Object} jobrole Jobrole object

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
      "jobrole": {
        "jobrole_id": 1,
        "jobrole_name": "Cloud Specialist ",
        "jobrole_status": "Active"
       }
    }

@apiError {String}  message No Jobrole for given jobrole id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Job role ID not found / not valid."
     }
"""
"""
@api {get} /job_role_by_id/:jobrole_name Get Jobrole for given jobrole name
@apiName get_specific_jobrole_by_name
@apiGroup Jobrole

@apiParam {String} jobrole_name Jobrole name.

@apiSuccess {Object} jobrole Jobrole object

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
      "jobrole": {
        "jobrole_id": 1,
        "jobrole_name": "Cloud Specialist ",
        "jobrole_status": "Active"
       }
    }

@apiError {String}  message No Jobrole for given jobrole name.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Job role name not found / not valid."
     }
"""

"""
@api {POST} /create_jobrole Create new jobrole
@apiName create_jobrole
@apiGroup Jobrole
 
@apiBody {String} jobrole_name Jobrole name.
@apiBody {String} jobrole_status Jobrole status.

@apiSuccess {String} message Jobrole saved successfully. 
 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "Jobrole Saved Successfully"
    }

@apiError {String}  message Duplicate jobrole or id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Duplicate jobrole or id."
     }
"""
"""
@api {POST} /update_jobrole/:jobrole_id Update Jobrole
@apiName update_jobrole
@apiGroup Jobrole

@apiParam {String} jobrole_id Jobrole unique ID.

@apiBody {String} jobrole_name Jobrole name.
@apiBody {String} jobrole_status Jobrole status.

@apiSuccess {String} message Jobrole edits saved successfully. 
 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "Jobrole edits Saved Successfully"
    }

@apiError {String}  message Job role name not found 
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Duplicate name or id."
     }
"""

"""
@api {get} /delete_jobrole/:jobrole_id Soft Delete Job Role 
@apiName delete_jobrole
@apiGroup Jobrole

@apiParam {String} jobrole_id Jobrole unique ID.

@apiSuccess {Object} jobrole Updated jobrole Object 

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "jobrole": {
            "jobrole_id": 1,
            "jobrole_name": "Cloud Specialist ",
            "jobrole_status": "Active"
       }
    }

@apiError {String}  message Error with deletion.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Job role name not found / not valid."
     }

"""

"""
@api {get} /skills_for_jobroles_list/:jobroles_list_in_str Get skills for jobrole(s)
@apiName get_skills_for_jobrole
@apiGroup Skills

@apiParam {String} jobroles_list_in_str String containing selected jobrole id(s)

@apiSuccess {Object[]} skill Array of skill objects (& it's association with courses & jobrole).


@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
      "skill": [
        {
            "course": [
                {
                    "course_id": "COR004",
                    "skill_id": 2
                }
            ],
            "jobrole": [
                {
                    "jobrole_id": 3,
                    "skill_id": 2
                }
            ],
            "skill_id": 2,
            "skill_name": "Customer Service",
            "skill_status": "Active"
        },
        {
            "course": [
                {
                    "course_id": "MGT002",
                    "skill_id": 3
                }
            ],
            "jobrole": [
                {
                    "jobrole_id": 3,
                    "skill_id": 3
                },
                {
                    "jobrole_id": 4,
                    "skill_id": 3
                }
            ],
            "skill_id": 3,
            "skill_name": "Conflict Management",
            "skill_status": "Active"
        }
      ]
    }

@apiError {String}  message No job roles.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "There are no Job Roles."
     }

"""
"""
@api {get} /get_all_lj_courses/:staff_id_in_str Get courses in LJ for given staff_id
@apiName get_staff_courses_in_lj
@apiGroup Learning Journey

@apiParam {String} staff_id_in_str Staff Unique ID.

@apiSuccess {Object[]} courses Array of Course Objects.

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "courses": [
        {
            "course_completion": null,
            "course_id": "COR001",
            "lj_id": 1
        },
        {
            "course_completion": null,
            "course_id": "COR004",
            "lj_id": 1
        }
    }

@apiError {String}  message No courses.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "There are no courses."
     }

"""

"""
@api {POST} /add_lj_courses Add courses to learning journey
@apiName add_lj_courses
@apiGroup Learning Journey
 
@apiBody {String} lj_id learning journey id.
@apiBody {String} course_id course id.
@apiBody {String} course_completion course completion status.

 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "course Saved Successfully"
    }

@apiError {String}  message Duplicate skill or id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Duplicate course."
     }
"""
"""
@api {POST} /add_role_to_LJ Add role to learning journey
@apiName add_role_to_LJ
@apiGroup Learning Journey
 
@apiBody {String} staff_id staff id.
@apiBody {String} jobrole_id jobrole id.
@apiBody {String} jobrole_name jobrole name

 
@apiSuccessExample Success-Response:
    HTTP/1.1 201 OK
    {
        "message": "job role Saved Successfully"
    }

@apiError {String}  message Duplicate jobrole or id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Duplicate jobrole or id."
     }
"""

"""
@api {get} /learning_journey/:staff_id Get learning journeys for given staff id
@apiName get_specific_learning_journey
@apiGroup Learning Journey

@apiParam {String} staff_id staff unique ID.

@apiSuccess {Object[]} jobrole array containing LJ objects

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
     "jobrole": [
        {
            "jobrole_id": 2,
            "jobrole_name": "Data Analyst",
            "lj_id": 1,
            "staff_id": "000001"
        },
        {
            "jobrole_id": 3,
            "jobrole_name": "Human Resource",
            "lj_id": 2,
            "staff_id": "000001"
        },
      ]
    }

@apiError {String} message No roles added by staff or staff_id invalid, which means no LJ created.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "No roles for specfic Staff found / staff_id not valid."
     }

"""
"""
@api {get} /skills_of_lj/:jobrole_id Get skills needed for given jobrole id
@apiName get_skills_of_lj
@apiGroup Learning Journey

@apiParam {String} jobrole_id Jobrole unique ID.

@apiSuccess {Object[]} skill Array of skill objects.

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
    "skill": [
        {
            "jobrole_id": 3,
            "skill_id": 2
        },
        {
            "jobrole_id": 3,
            "skill_id": 3
        }
    ]
    }

@apiError {String}  message No skills for jobrole.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "No skills for jobrole."
     }

"""
"""
@api {get} /courses_of_lj/:lj_id Get courses in progress and completed for given lj id
@apiName get_courses_lj_id
@apiGroup Learning Journey

@apiParam {String} lj_id LJ unique ID.

@apiSuccess {Object[]} course list of course objects.


@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
    "course": [
        {
            "course_completion": null,
            "course_id": "COR001",
            "lj_id": 3
        },
        {
            "course_completion": null,
            "course_id": "tch018",
            "lj_id": 3
        }
      ]
    }

@apiError {String}  message No courses for given LJ.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "No courses for specific learning journey."
     }
"""
"""
@api {get} /course_status/:lj_id/:course_id Get status of course for a given LJ id & course id
@apiName get_course_status
@apiGroup Learning Journey

@apiParam {String} lj_id LJ unique ID.
@apiParam {String} course_id course unique ID.


@apiSuccess {Object[]} status return course object containing course completion status (note: null means in progress)

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
    "status": [
        {
            "course_completion": null,
            "course_id": "COR001",
            "lj_id": 3
        }
      ]
    }

@apiError {String}  message Error in finding course.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "Error in finding course"
     }

"""
"""
@api {get} /learning_journey/:staff_id/:jobrole_id Get Learning Journey for given staff_id & jobrole_id
@apiName get_specific_learning_journey_role
@apiGroup Learning Journey

@apiParam {String} staff_id staff unique ID.
@apiParam {String} jobrole_id jobrole unique ID.

@apiSuccess {Object[]} jobrole array containing LJ objects

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
    "jobrole": [
        {
            "jobrole_id": 3,
            "jobrole_name": "Human Resource",
            "lj_id": 2,
            "staff_id": "000001"
        }
    ]
    }

@apiError {String}  message Error in finding Learning Journey for given staff_id / jobrole_id.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "No LJ for specific Staff found / staff_id not valid."
     }
"""

"""
@api {get} /completed_lj/:staff_id Get number of completed LJ & data 
@apiName get_completed_lj
@apiGroup Learning Journey

@apiParam {String} staff_id staff unique ID.

@apiSuccess {Object} data Object containing number of learning journeys completed and raw data of LJs under the same staff.


@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "data": {
            "lj_completed_num": 1,
            "data_raw": [
                {
                    "jobrole_id": 1,
                    "jobrole_name": "Cloud Specialist ",
                    "jobrole_status": "Active",
                    "skills": "DevOps"
                },
            ]
        }
    }

@apiError {String}  message Error in finding completed learning journey.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "There are no completed learning journeys for the staff specified"
     }
"""

"""
@api {delete} /delete_lj/:lj_id Delete learning journey
@apiName delete_learning_journey
@apiGroup Learning Journey

@apiParam {String} lj_id Learning Journey Unique ID.

@apiSuccess {String} Message Learning Journey deleted or Association deleted

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "Message": "| Learning journey deleted || Association deleted |"
    }

@apiError {String}  message No learning journey or Association found
@apiErrorExample Error-Response: 
     HTTP/1.1 404 Not Found
     {
       "message": "No learning journey or Association found!"
     }

"""



"""
@api {post} /create_mapping_jobrole_skill Create mapping between jobrole & skill
@apiName map_jobrole_skill
@apiGroup Mapping

@apiBody {String} skill_id Skill id.
@apiBody {String} jobrole_id Jobrole id.

 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "mapping Saved Successfully"
    }

@apiError {String}  message Duplicate skill or id.
@apiErrorExample Error-Response: 
    HTTP/1.1 401 Not Found
     {
       "message": "Error with Linking Jobrole to Skill #1/#2"
     }
    HTTP/1.1 500 Not Found
     {
       "message": "Error saving jobrole-skill mapping to database:"
     }

"""

"""
@api {post} /create_mapping_skill_courses Create mapping between skill & course
@apiName map_skill_courses
@apiGroup Mapping

@apiBody {String} course_id course id.
@apiBody {String} skill_id Skill id.
 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "mapping Saved Successfully"
    }

@apiError {String}  message Duplicate skill or id.
@apiErrorExample Error-Response: 
    HTTP/1.1 401 Not Found
     {
       "message": "Error with Linking Courses to Skill #1/#2"
     }
    HTTP/1.1 500 Not Found
     {
       "message": "Error saving course-skill mapping to database:"
     }

"""

"""
@api {post} /create_mapping_skill_courses Create mapping between skill & course
@apiName map_skill_courses
@apiGroup Mapping

@apiBody {String} course_id course id.
@apiBody {String} skill_id Skill id.
 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "mapping Saved Successfully"
    }

@apiError {String}  message Duplicate skill or id.
@apiErrorExample Error-Response: 
    HTTP/1.1 401 Not Found
     {
       "message": "Error with Linking Courses to Skill #1/#2"
     }
    HTTP/1.1 500 Not Found
     {
       "message": "Error saving course-skill mapping to database:"
     }

"""

"""
@api {get} /get_mapping/:skill_id/:course_id Get course skill mapping
@apiName get_specific_skill_course_mapping
@apiGroup Mapping

@apiParam {String} skill_id Skill unique ID.
@apiParam {String} course_id Course unique ID.

@apiSuccess {Object} mapping Mapping object between skill & course

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "mapping": mapping_object
    }

@apiError {String}  message Mapping not found / valid.
@apiErrorExample Error-Response: 
     HTTP/1.1 401 Not Found
     {
       "message": "mapping not found / not valid."
     }

"""

"""
@api {delete} /delete_mapping/:skill_id/:course_id Delete mapping between skill & course
@apiName mapping_delete
@apiGroup Mapping

@apiParam {String} skill_id skill unique ID.
@apiParam {String} course_id course unique ID.

@apiSuccess {String} Message Mapping deleted
 
@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "message": "Mapping deleted"
    }

@apiError {String}  message Mapping could not be deleted
@apiErrorExample Error-Response: 
     HTTP/1.1 500 Not Found
     {
       "message": "Mapping could not be deleted"
     }

"""


"""
@api {delete} /delete_lj_course/:lj_id/:course_id Delete mapping between LJ & course
@apiName delete_map_lj_course
@apiGroup Learning Journey

@apiParam {String} lj_id skill unique ID.
@apiParam {String} course_id course unique ID.
 
@apiSuccess {String} Message Course removed from LJ

@apiSuccessExample Success-Response:
    HTTP/1.1 201 OK
    {
        "message": "Course removed from LJ"
    }

"""

"""
@api {get} //login/:staff_id Login with staff ID
@apiName login_status
@apiGroup Login

@apiParam {String} staff_id staff unique ID.
 
@apiSuccess {String} Message Login success to jobrole

@apiSuccessExample Success-Response:
    HTTP/1.1 201 OK
    {
        "code": "201"
        "jobrole": "Login Success to Job Role 1!"
        "staff_id": "130002"
    }
@apiError {String}  message Staff record not found / valid.
@apiErrorExample Error-Response: 
     HTTP/1.1 404 Not Found
     {
       "message": "Error in finding staff record"
     }
"""