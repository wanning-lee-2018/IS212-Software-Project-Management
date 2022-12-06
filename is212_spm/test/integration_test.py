import unittest
import flask_testing
import json



from src.flask.db_class_creation import db, Course, LJcourseAssociationTable, skill_course_association_table, skill_jobrole_association_table, Skill, LearningJourney, JobRole, Role, Staff
from src.flask.app import app

class TestApp(flask_testing.TestCase):
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {}
    app.config['TESTING'] = True

    def create_app(self):
        return app

    def setUp(self):
        print("setUp START")
        db.create_all()

        #Test fixture-Data
        self.s1 = Skill(skill_id=1, skill_name='Test_skill_1',
                   skill_status='Active')
        self.s2 = Skill(skill_id=2, skill_name='Test_skill_2',
                   skill_status='Active')
        self.c1 = Course(course_id='TEST123', course_name='Testing',
                    course_desc='Testing my patience', course_status='Active')
        self.LJCourseTable1 = LJcourseAssociationTable(
            course_id='TEST123', course_completion='Completed', lj_id=1)
        self.skill_course_association_table1 = skill_course_association_table(
            skill_id=1, course_id='TEST123')
        self.skill_jobrole_association_table1 = skill_jobrole_association_table(
            skill_id=1, jobrole_id='Jobless')
        self.sr1 = LearningJourney(lj_id=1, staff_id='000000',
                              jobrole_id=2, jobrole_name='Data Analyst')
        self.jr1 = JobRole(jobrole_id=2, jobrole_name='Data Analyst',
                      jobrole_status='Retired')
        self.r1 = Role(role_id=1, role_name='Admin')
        self.staff1 = Staff(staff_id="000000", role_id=1)
        db.session.add(self.s1)
        db.session.add(self.s2)
        db.session.add(self.c1)
       
        db.session.add(self.skill_course_association_table1)
        db.session.add(self.skill_jobrole_association_table1)
        db.session.add(self.jr1)
        db.session.add(self.r1)
        db.session.add(self.staff1)
        db.session.add(self.LJCourseTable1)
        db.session.add(self.sr1)
     
        db.session.commit()


    def tearDown(self):
        print("tearDown START")
        db.session.remove()
        db.drop_all()

# TEST get all courses
class TestGetCourses(TestApp):
    def test_get_all_course(self):
        db.session.query(Course).all()
        response = self.client.get("/courses")
        self.assertEqual(response.json, {
            "code": 200,
            'data': {'courses': 
                        [{'course_desc': 'Testing my patience',
                          'course_id': 'TEST123',
                          'course_name': 'Testing',
                          'course_status': 'Active'}]}
        })
 # TEST get courses for a specified list of skills(skill_ids)
class TestGetCoursesforSpecificSkills(TestApp):
    def test_get_courses_for_skills(self):
        test_list_of_skills = [1]
        test_url = "/get_courses_for_skills/" + json.dumps(test_list_of_skills, separators=(',', ':'))
        response = self.client.get(test_url)
        self.assertTrue(response.status_code==200 or response.status_code==201 or response.status_code==404)

class TestGetUserLJ(TestApp):
    def test_get_user_LJ_and_courses_in_the_LJ(self):
        # # CREATE TEST JOB ROLE
        jobrole1 = JobRole(jobrole_name="Test Role", jobrole_status="Active")
        db.session.add(jobrole1)

        # MANUALLY ADD IN COURSES x2
        c2 = Course(course_id='TESTCOR001', course_name='TestCourse1',
                    course_desc="Testing Kavan's patience", course_status='Active')
        c3 = Course(course_id='TESTCOR2222', course_name='TestCourse2',
                    course_desc="Mind as well test Curling's patience too", course_status='Active')
        db.session.add(c2)
        db.session.add(c3)
        db.session.commit()
        # MAP test JOBROLE to test SKILL(S)
        test_skill_array = [
            {"skill_name": self.s1.skill_name, "skill_status":self.s1.skill_status},
            {"skill_name":self.s2.skill_name, "skill_status":self.s2.skill_status}
        ]
        test_new_mapping_obj = {
          "jobrole_id": 1,
          "skill_array": test_skill_array,
        }
        response_map_jobrole = self.client.post("/create_mapping_jobrole_skill",
                                    data=json.dumps(test_new_mapping_obj),
                                    content_type="application/json; charset=UTF-8")
        # MAP test COURSES to test SKILL(S) x2
        # Do this TWICE cos we have 2 test skills s1 AND s2
        # MAP Course c2 to s1
        course_skill_obj_1 = {
            "skill_id": 1,
            "course_array": [
                {
                "course_id": c2.course_id, 
                "course_name": c2.course_name,
                "course_desc": c2.course_desc, 
                "course_status": c2.course_status
                }
            ],
        }
        response_map_s1 = self.client.post("/create_mapping_skill_courses",
                                    data=json.dumps(course_skill_obj_1),
                                    content_type="application/json; charset=UTF-8")
        # MAP Course c3 to s2
        course_skill_obj_2 = {
            "skill_id": 2,
            "course_array": [
                {
                "course_id": c3.course_id, 
                "course_name": c3.course_name,
                "course_desc": c3.course_desc, 
                "course_status": c3.course_status
                }
            ],
        }
        response_map_s2 = self.client.post("/create_mapping_skill_courses",
                                    data=json.dumps(course_skill_obj_2),
                                    content_type="application/json; charset=UTF-8")
        
        # CREATE A TEST USER # can't create user so we hardcode our own test user manually into db=
        # role_id = 2 to set him/her to regular staff only
        test_user = Staff(staff_id="000001", role_id=2)
        db.session.add(test_user)
        db.session.commit()
        # ADD test JOBROLE into test USER's LJ
        lj1 = LearningJourney(
            staff_id=test_user.staff_id, jobrole_id=jobrole1.jobrole_id, jobrole_name=jobrole1.jobrole_name
            )
        db.session.add(lj1)
        db.session.commit()
        # ADD test COURSE to TEST USER's LJ x2
        # First add c1
        test_courselj_obj_1 = {
        "course_id": c2.course_id,
        "jobrole_id": [jobrole1.jobrole_id],
        };
        response_map_lj_c1 = self.client.post("/add_lj_courses/000001",
                                    data=json.dumps(test_courselj_obj_1),
                                    content_type="application/json; charset=UTF-8")
        # First add c2
        test_courselj_obj_2 = {
        "course_id": c3.course_id,
        "jobrole_id": [jobrole1.jobrole_id],
        };
        response_map_lj_c2 = self.client.post("/add_lj_courses/000001",
                                    data=json.dumps(test_courselj_obj_2),
                                    content_type="application/json; charset=UTF-8")
        
        # OKAY FINALLY CAN TEST GET user's courses from ALL HIS/HER LJs
        response_get_user_LJ_courses = self.client.get("/get_all_lj_courses/000001",
                                    content_type="application/json; charset=UTF-8")
        
        self.assertEqual(response_get_user_LJ_courses.json, {
            "code": 200,
            "data": {
                "courses": [
                            {
                                "course_completion": None, 
                                "course_id": "TESTCOR001", 
                                "lj_id": 2
                            }, 
                            {
                                "course_completion": None, 
                                "course_id": "TESTCOR2222", 
                                "lj_id": 2
                            }, 
                            ]
                }
        })

# TEST Creating a new skill into DB
class TestCreateSkill(TestApp):
    def test_create_skill(self):
        s3 = Skill(skill_name='Createskill',
                   skill_status='Active')
        db.session.add(s3)
        db.session.commit()

        request_body = {
            'skill_name': s3.skill_name,
            'skill_status': s3.skill_name,
        }

        response = self.client.post("/create_skill",
                                    data=json.dumps(request_body),
                                    content_type='application/json')
        self.assertEqual(response.json, {
            "code": 201,
            "message": "Skill Saved Successfully"
        })

# TEST get all skills
class TestGetAllSkill(TestApp):
    def test_get_all_skill(self):
        

        db.session.query(Skill).all()

        response = self.client.get("/skills")
        self.assertEqual(response.json, {
            "code": 200,
            "data": {'skill': [{'course': [{'course_id': 'TEST123', 'skill_id': 1}],
                                'jobrole': [{'jobrole_id': 'Jobless', 'skill_id': 1}],
                                'skill_id': 1,
                                'skill_name': 'Test_skill_1',
                                'skill_status': 'Active'},
                               {'course': [],
                                'jobrole': [],
                                'skill_id': 2,
                                'skill_name': 'Test_skill_2',
                                'skill_status': 'Active'}]}
        })

# TEST get specific skill
class TestGetSpecificSkill(TestApp):
    def test_get_specific_skill(self):

        skill_id="1"
        db.session.query(Skill).filter_by(
            skill_id=skill_id).first()

        response = self.client.get("/skills/"+skill_id)
        self.assertEqual(response.json, {
            "code": 200,
            "data": {'skill': {'course': [{'course_id': 'TEST123', 'skill_id': 1}],
                               'jobrole': [{'jobrole_id': 'Jobless', 'skill_id': 1}],
                               'skill_id': 1,
                               'skill_name': 'Test_skill_1',
                               'skill_status': 'Active'}}
        })




# TEST Creating a new jobrole into DB
class TestCreateJobrole(TestApp):
    def test_create_jobrole(self):
        testJobrole = JobRole(jobrole_name="Test Role", jobrole_status="Active")
        db.session.add(testJobrole)
        db.session.commit()

        request_body = {
            'jobrole_name': testJobrole.jobrole_name,
            'jobrole_status': testJobrole.jobrole_status,
        }

        response = self.client.post("/create_jobrole",
                                    data=json.dumps(request_body),
                                    content_type='application/json')
        self.assertEqual(response.json, {
            "code": 201,
            "message": "Jobrole Saved Successfully"
        })

    def test_create_jobrole_empty_jobrole_name(self):
        testJobrole = JobRole(jobrole_name="", jobrole_status="Active")
        db.session.add(testJobrole)
        db.session.commit()
        request_body = {
            'jobrole_name': testJobrole.jobrole_name,
            'jobrole_status': testJobrole.jobrole_status,
        }
        response = self.client.post("/create_jobrole",
                                    data=json.dumps(request_body),
                                    content_type='application/json')
        self.assertEqual(response.json, {
                    "code": 402,
                    "message": "jobrole name missing!"
                })

# TEST delete Skill-Course Mapping
class TestDeleteMappingSkillCourse(TestApp):
    def test_delete_skill_course_mapping(self):

        #Create s4-c4 mappping
        s4 = Skill(skill_id=4,
                   skill_name='MappingSkill',
                   skill_status='Active')
        db.session.add(s4)

        c4 = Course(course_id='TESTCOR004', course_name='TestCourse4',
                    course_desc="Testing Mapping", course_status='Active')
        db.session.add(c4)

        db.session.commit()

        test_new_mapping_obj = {
            "skill_id": s4.skill_id,
            "course_array": [
                {"course_id": c4.course_id},
                ],
        }

        map_s4 = self.client.post("/create_mapping_skill_courses",
                                           data=json.dumps(test_new_mapping_obj),
                                           content_type="application/json; charset=UTF-8")

        #Check that s4-c4 mappping is mapped 
        response_map_s4 = self.client.get("/get_mapping/"+str(s4.skill_id)+"/"+c4.course_id,
                                                       content_type="application/json; charset=UTF-8")
        self.assertEqual(response_map_s4.json, {
            "code": 200,
            "data": {'mapping': {'course_id': 'TESTCOR004', 'skill_id': 4}}
        })

        #Delete s4-c4 mappping
        mapping = db.session.query(skill_course_association_table).filter_by(
            skill_id=s4.skill_id, course_id=c4.course_id).first()
        local_mapping = db.session.merge(mapping)
        # db.session.delete(local_mapping)
        db.session.commit()

        delete_map_c4 = self.client.delete("/delete_mapping/"+str(s4.skill_id) + "/" + c4.course_id,
                                           data=json.dumps(
                                           test_new_mapping_obj),
                                           content_type="application/json; charset=UTF-8")
        self.assertEqual(delete_map_c4.json, {
            "code": 201,
            'message': 'Mapping deleted'
        })

        #Check that s4-c4 mappping is deleted
        response_map_s4 = self.client.get("/get_mapping/"+str(s4.skill_id)+"/"+c4.course_id,
                                          content_type="application/json; charset=UTF-8")
        self.assertEqual(response_map_s4.json, {
            'code': 404, 
            'message': 'mapping not found / not valid.'
        })
    

# TEST delete/remove Course from LJ
class TestDeleteCourseFromLJ(TestApp):
    def test_delete_course_from_lj(self):
        s4 = Skill(skill_id=4,
                   skill_name='MappingSkill',
                   skill_status='Active')
        db.session.add(s4)
        #Create LJ
        test_LJ = LearningJourney(lj_id=2, staff_id='000000',
                              jobrole_id=3, jobrole_name='Deletion Test')
        c4 = Course(course_id='DEL123', course_name='Test_Delete',
                    course_desc='Testing Course Deletion', course_status='Active')
        db.session.add(test_LJ)
        db.session.add(c4)

        courselj_obj = {
        "course_id": c4.course_id,
        "jobrole_id": [test_LJ.jobrole_id],
        };

        db.session.commit()
        #Add Course(s)
        response = self.client.post("/add_lj_courses/" + str(test_LJ.staff_id), data=json.dumps(courselj_obj),
                                           content_type="application/json; charset=UTF-8")
        self.assertEqual(response.json, {
            "code": 201,
            "message": "course Saved Successfully"
        })

        #Delete Course(s)
        response2 = self.client.delete("/delete_lj_course/" + str(test_LJ.lj_id) + "/" + str(c4.course_id))
        #Check final results
        self.assertEqual(response2.json, {
          "code": 201,
            "message": "Course remove from LJ"
        })
        # FINAL CHECK TO SEE IF ANY COURSES LEFT IN LJ, EXPECTED NO
        response3 = self.client.get("/courses_of_lj/" + str(test_LJ.lj_id))
        #Check final results
        self.assertEqual(response3.json, {
            "code": 404,
            "message": "No courses for specific learning journey."
        })


# TEST hard-delete LJ
class TestDeleteLJ(TestApp):
    def test_delete_lj(self):
        #Create LJ
        test_LJ = LearningJourney(lj_id=2, staff_id='000000',
                              jobrole_id=3, jobrole_name='Deletion Test')
        c4 = Course(course_id='DEL123', course_name='Test_Delete',
                    course_desc='Testing Course Deletion', course_status='Active')
        db.session.add(test_LJ)
        db.session.commit()
        courselj_obj = {
            "course_id": c4.course_id,
            "jobrole_id": [test_LJ.jobrole_id],
            };
        #Add Course(s)
        response = self.client.post("/add_lj_courses/" + str(self.staff1.staff_id), data=json.dumps(courselj_obj),
                                           content_type="application/json; charset=UTF-8")
        self.assertEqual(response.json, {
            "code": 201,
            "message": "course Saved Successfully"
        })

        #Delete LJ
        response2 = self.client.delete("/delete_lj/" + str(self.sr1.lj_id))
        #Check final results
        self.assertEqual(response2.json, 
          [{'message': '| Learning journey deleted || Association deleted |'}, 200]
        )

        # FINAL CHECK to see if any LJs still around
        response3 = self.client.get("/get_all_lj_courses/" + str(self.sr1.lj_id))
        self.assertEqual(response3.json, {
            "code": 404,
            "message": "There are no courses."
        })
if __name__ == '__main__':
    unittest.main()