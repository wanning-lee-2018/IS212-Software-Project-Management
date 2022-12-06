import React, { useState, useEffect } from "react";

import { CCard, CCol, CContainer, CRow, CCardText } from "@coreui/react";

import { AppSidebar, AppHeader } from "../../../components";
import CourseTable from "src/components/Cards/CourseTable";
import JobRoleCheckbox from "src/components/Cards/JobRoleCheckbox";
import SkillCheckbox from "src/components/Cards/SkillCheckbox";

export default function AddCourses() {
  //retrieve the staff id used for logging in, which is stored in local storage
  const [Token, setToken] = useState();
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_ID"]);
    }
  }, []);

  const [currentStaffId, setcurrentStaffId] = useState("");
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loadingstate, setLoadingstate] = useState(true);

  // Initalise all COURSES from User's LJ
  // FUNCTION to check each course(based on selected skills), their completion status
  async function checkCompletion(skill_obj_array) {
    // Get all of User's current LJs
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_ID"]);
    }

    var skill_obj_w_completion_status = [];
    var completed_course_ids = [];
    await fetch("/get_all_lj_courses/" + Token["Staff_id"])
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((data) => {
        if (data) {
          var list_of_lj_objs = data.data.courses;

          for (var c of list_of_lj_objs) {
            if (c.course_completion === "Completed") {
              completed_course_ids.push(c.course_id);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    for (var skill_obj of skill_obj_array) {
      // ASSSUMING THERE ARE NO SKILLS THAT REQUIRE MORE THAN 1 course to achieve. (eg. Python dunnid that WAD1 AND WAD2 to get, just need take at least one)

      // Check if user has completed ANY courses related to a single specific skill
      // If have at least ONE completed, tag that specific skill as Completed as well.
      var skill_completion_status = false;
      for (const course_obj of skill_obj.course) {
        if (completed_course_ids.includes(course_obj.course_id)) {
          skill_completion_status = true;
        }
      }
      // Adding that completion tag into new LIST of SKILL OBJs
      skill_obj["completion_status"] = skill_completion_status;
      skill_obj_w_completion_status.push(skill_obj);
    }

    return skill_obj_w_completion_status;
  }

  // Get Staff's added roles from his/her LJ.
  // Runs everytime currentStaffId changes
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (currentStaffId !== undefined) {
      fetch("/learning_journey/" + Token["Staff_id"])
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setJobRoles(data.data.jobrole);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStaffId]);

  // Get Staff's SKILLS for SELECTED roles from select Roles checkboxes.
  // Runs everytime list of selectedRoles changes
  useEffect(() => {
    setLoadingstate(true);
    // callback function to force an ASYNC AWAIT within useEffect
    async function fetchSkills() {
      if (selectedRoles.length > 0) {
        var temp_str = selectedRoles.sort().join();
        try {
          const response = await fetch(
            "/skills_for_jobroles_list/" + JSON.stringify(temp_str)
          );
          if (!response.ok) {
            // ERROR OCCURED
            console.log(`An error has occured: ${response.status}`);
          } else {
            const res = await response.json();
            var temp_skills = await checkCompletion(res.data.skill);
            setSkills(temp_skills);
          }
        } catch (error) {
          console.error;
        }
      } else if (selectedRoles.length === 0) {
        setSkills([]);
      }
      setLoadingstate(false);
    }

    fetchSkills();
    handleGetAllCourses();
    resetCheckbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoles]);

  // Function to uncheck all skill checkboxes when user changes selection of JobRoles
  const resetCheckbox = () => {
    for (var skill of skills) {
      const tempName = "skillcheckbox" + skill.skill_id;
      document.getElementById(tempName).checked = false;
    }
  };

  // USE THIS FUNCTION FOR FILTERING INSTEAD: Takes into account selectedSkills when showing courses
  const handleGetAllCourses = () => {
    // Retrieve all courses related to ALL selected ROLES !!!TAKENOTE ROLES NOT SKILLS !!!

    // Need go through Skills first to get to Courses: JobRoles -> Skills -> Courses
    // Get skills for jobrole (list of role ids)
    if (selectedRoles.length > 0 || !selectedRoles) {
      fetch("/skills_for_jobroles_list/" + JSON.stringify(selectedRoles))
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log(`An error has occured: ${response.status}`);
            setCourses([]);
          }
        })
        .then((data) => {
          const list_of_skill_objs = data.data.skill;
          const temp_skill_ids = [];
          for (var s of list_of_skill_objs) {
            temp_skill_ids.push(s.skill_id);
          }
          // Get courses for skills (list of skill ids)
          fetch("/get_courses_for_skills/" + JSON.stringify(temp_skill_ids))
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
            })
            .then((data) => {
              setCourses(data.data.courses);
            })
            .catch((error) => {
              console.error;
            });
        })
        .catch((error) => {
          console.log("Fetch courses: error caught");
        });
    } else {
      setCourses([]);
    }
  };

  if (selectedRoles.length === 0) {
    return (
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column">
          <AppHeader />
          <div className="body flex-grow-1 p-1">
            {/* Actual Content Starts here */}
            <h1>
              <b>Course List</b>
            </h1>
            {/* TOP content */}
            <CCard className="w-100 border-light">
              <CContainer className="w-100 m-0">
                <CRow>
                  <CCol lg="4" className="p-0">
                    <div
                      className="card border-light d-flex align-items-start"
                      style={{ backgroundColor: "#F2FAFF", margin: "5%" }}
                    >
                      <CCardText component={"span"} className="px-3 pt-3 m-0">
                        <u>
                          <b>Find Courses for: </b>
                        </u>
                      </CCardText>
                      {/* </div> */}
                      <CCardText component={"span"} className="p-0 m-0">
                        <JobRoleCheckbox
                          listOfJobRoles={jobRoles}
                          updateParent={setSelectedRoles}
                        />
                      </CCardText>
                    </div>
                  </CCol>

                  <CCol lg="4" className="p-0">
                    <div
                      className="card border-light d-flex align-items-start"
                      style={{
                        margin: "5%",
                      }}
                    >
                      <CCardText component={"span"} className="px-3 pt-3 m-0">
                        <u>
                          <b>Filter by Skills: </b>
                        </u>
                      </CCardText>
                      <CCardText component={"span"} className="p-0 m-0">
                        <SkillCheckbox
                          listOfSkills={skills}
                          updateParent={setCourses}
                          updateLoading={setLoadingstate}
                        />
                      </CCardText>
                    </div>
                  </CCol>
                </CRow>
              </CContainer>
            </CCard>
            {/* TOP content END */}
            <div className="d-flex justify-content-center py-3">
              <h4>Please select a desired Job Role</h4>
            </div>
            {/* BOTTOM content END*/}
          </div>
        </div>
        {/* Actual Content Ends here */}
      </div>
    );
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column">
        <AppHeader />
        <div className="body flex-grow-1 p-1">
          {/* Actual Content Starts here */}
          <h1>
            <b>Course List</b>
          </h1>
          {/* TOP content */}
          <CCard className="w-100 border-light">
            <CContainer className="w-100 m-0">
              <CRow>
                <CCol lg="4" className="p-0">
                  <div
                    className="card border-light d-flex align-items-start"
                    style={{ backgroundColor: "#F2FAFF", margin: "5%" }}
                  >
                    <CCardText component={"span"} className="px-3 pt-3 m-0">
                      <u>
                        <b>Find Courses for: </b>
                      </u>
                    </CCardText>
                    {/* </div> */}
                    <CCardText component={"span"} className="p-0 m-0">
                      <JobRoleCheckbox
                        listOfJobRoles={jobRoles}
                        updateParent={setSelectedRoles}
                      />
                    </CCardText>
                  </div>
                </CCol>

                <CCol lg="4" className="p-0">
                  <div
                    className="card border-light d-flex align-items-start"
                    style={{
                      margin: "5%",
                    }}
                  >
                    <CCardText component={"span"} className="px-3 pt-3 m-0">
                      <u>
                        <b>Filter by Skills: </b>
                      </u>
                    </CCardText>
                    <CCardText component={"span"} className="p-0 m-0">
                      <SkillCheckbox
                        listOfSkills={skills}
                        updateParent={setCourses}
                        updateLoading={setLoadingstate}
                      />
                    </CCardText>
                  </div>
                </CCol>
              </CRow>
            </CContainer>
          </CCard>
          {/* TOP content END */}

          {/* BOTTOM content */}
          <CCard className="border-light d-flex w-100 align-items-start">
            <CContainer>
              <CRow>
                <CCol sx="12" sm="12" md="12" lg="12">
                  <CourseTable
                    staff_id={Token["Staff_id"]}
                    listOfCourses={courses}
                    listofSelectedRoles={selectedRoles}
                    isLoading={loadingstate}
                  />
                </CCol>
              </CRow>
            </CContainer>
          </CCard>
          {/* BOTTOM content END*/}
        </div>
      </div>
      {/* Actual Content Ends here */}
    </div>
  );
}
