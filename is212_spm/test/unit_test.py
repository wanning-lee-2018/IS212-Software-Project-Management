import unittest
from src.flask.db_class_creation import Course, LJcourseAssociationTable, skill_course_association_table, skill_jobrole_association_table, Skill, LearningJourney, JobRole, Role, Staff, Registration

# test
class TestLJcourseAssociationTable(unittest.TestCase):
    def test_json(self):
        LJCourseTable1 = LJcourseAssociationTable(
            course_id='TEST123', course_completion='Completed', lj_id=1)
        self.assertEqual(LJCourseTable1.json(), {
            'course_id': 'TEST123',
            'course_completion': 'Completed',
            'lj_id': 1}
        )


class Testskill_course_association_table(unittest.TestCase):
    def test_json(self):
        skill_course_association_table1 = skill_course_association_table(
            skill_id=1, course_id='TEST123')
        self.assertEqual(skill_course_association_table1.json(), {
            'skill_id': 1,
            'course_id': 'TEST123'}
        )


class Testskill_jobrole_association_table(unittest.TestCase):
    def test_json(self):
        skill_jobrole_association_table1 = skill_jobrole_association_table(
            skill_id=1, jobrole_id='Jobless')
        self.assertEqual(skill_jobrole_association_table1.json(), {
            'skill_id': 1,
            'jobrole_id': 'Jobless'}
        )


class TestSkill(unittest.TestCase):
    def test_json(self):
        s1 = Skill(skill_id=1, skill_name='Test_skill', skill_status='active', course=[], jobrole=[])
        self.assertEqual(s1.json(), {
            'skill_id': 1,
            'skill_name': 'Test_skill',
            'skill_status': 'active',
            'course': [], 
            'jobrole': []}
        )
    
    def test_to_dict(self):
        s1 = Skill(skill_id=1, skill_name='Test_skill',
                   skill_status='active')
        self.assertEqual(s1.to_dict(), {
            'skill_id': 1,
            'skill_name': 'Test_skill',
            'skill_status': 'active'}
        )



class TestCourse(unittest.TestCase):
    def test_to_dict(self):
        c1 = Course(course_id='TEST123', course_name='Testing',
                    course_desc='Testing my patience', course_status='active')
        self.assertEqual(c1.to_dict(), {
            'course_id': 'TEST123',
            'course_name': 'Testing',
            'course_desc': 'Testing my patience',
            'course_status': 'active'}
        )


class TestLearningJourney(unittest.TestCase):
    def test_json(self):
        sr1 = LearningJourney(lj_id=1, staff_id='000001',
                        jobrole_id=2, jobrole_name='Data Analyst')
        self.assertEqual(sr1.json(), {
            'lj_id': 1,
            'staff_id': '000001',
            'jobrole_id': 2,
            'jobrole_name': 'Data Analyst'}
        )


class TestJobRole(unittest.TestCase):
    def test_to_dict(self):
        jr1 = JobRole(jobrole_id=2, jobrole_name='Data Analyst',
                      jobrole_status='Retired')
        self.assertEqual(jr1.to_dict(), {
            'jobrole_id': 2,
            'jobrole_name': 'Data Analyst',
            'jobrole_status': 'Retired', }
        )


class TestRole(unittest.TestCase):
    def test_to_dict(self):
        r1 = Role(role_id=1, role_name='Admin')
        self.assertEqual(r1.to_dict(), {
            'role_id': 1,
            'role_name': 'Admin'}
        )


class TestStaff(unittest.TestCase):
    def test_to_dict(self):
        s1 = Staff(staff_id="000001", role_id=1)
        self.assertEqual(s1.to_dict(), {
            'staff_id': "000001",
            'role_id': 1}
        )


class TestRegistration(unittest.TestCase):
    def test_to_dict(self):
        s1 = Registration(reg_id=1, course_id="COR002",
                          staff_id="130001", reg_status="Registered", completion_status="Completed")
        self.assertEqual(s1.to_dict(), {
            'reg_id': 1,
            'course_id': "COR002",
            'staff_id': "130001",
            'reg_status': "Registered",
            'completion_status': "Completed", }
        )


if __name__ == "__main__":
    unittest.main()
