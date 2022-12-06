import * as React from "react";
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardText,
  CContainer,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function StepperLJ(props) {
  StepperLJ.propTypes = {
    role: PropTypes.string,
    lj: PropTypes.string,
    updateParent: PropTypes.func,
    setLoading: PropTypes.func,
    staff_id: PropTypes.string,
  };

  const [Token, setToken] = useState();
  const [currentStaffId, setcurrentStaffId] = useState("");
  const [steps, setSteps] = useState([]);
  const [jobrole, setJobRole] = useState("");
  const [ljId, setLjId] = useState("");
  const [visiblePopUp, setVisiblePopUp] = useState(false);

  const removeCourse = async (event) => {
    event.preventDefault();
    var lj_id = props.lj;
    const course_id = event.target.value;
    const response = await fetch(
      "/delete_lj_course/" + lj_id + "/" + course_id,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    } else {
      alert("Course Deleted!");
      window.location.reload();
    }
  };

  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_id"]);
    }
    var jobrole_id = props.role;
    var staff_id = Token["Staff_id"];
    var lj_id = props.lj;
    let skill_data = [];

    async function getRoleName() {
      await fetch("/job_role_by_id/" + jobrole_id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (data) => {
          setJobRole(data.data.jobrole.jobrole_name);
        })
        .catch((error) => {
          console.error;
        });
    }

    async function getLJId() {
      await fetch("/learning_journey/" + Token["Staff_id"] + "/" + jobrole_id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (data) => {
          setLjId(data.data.jobrole.lj_id);
        })
        .catch((error) => {
          console.error;
        });
    }

    async function getRoleName() {
      await fetch("/job_role_by_id/" + jobrole_id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (data) => {
          setJobRole(data.data.jobrole.jobrole_name);
        })
        .catch((error) => {
          console.log("In StepperLJ: error caught");
        });
    }

    async function getLJId() {
      await fetch("/learning_journey/" + props.staff_id + "/" + jobrole_id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (data) => {
          setLjId(data.data.jobrole.lj_id);
        })
        .catch((error) => {
          console.log("In StepperLJ: error caught");
        });
    }

    async function GetSkills() {
      await fetch("/completed_lj/" + props.staff_id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (data) => {
          // Get skills of job role
          var jobrole_data = data.data.data_raw.jobrole_id[jobrole_id];
          if (jobrole_data != undefined) {
            var skills = jobrole_data.skill_id;
          }

          // Ensure that there is skill mapped to role
          for (var skill in skills) {
            if (skill != "null") {
              // Get courses added into specific learning journey
              let coursesAddedToLJ = [];
              try {
                await fetch("/courses_of_lj/" + lj_id)
                  .then((response) => {
                    if (response.ok) {
                      return response.json();
                    }
                  })
                  .then(async (data) => {
                    for (var course of data.data.course) {
                      coursesAddedToLJ.push(course.course_id);
                    }
                  })
                  .catch((error) => {
                    console.error;
                  });
              } catch (error) {
                console.log("No course added to lj");
              }

              let courses = [];
              let skill_name;
              let skill_completion;
              // Get Skill name
              await fetch("/skills/" + skill)
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }
                })
                .then(async (data) => {
                  skill_name = data.data.skill.skill_name;
                  // Skill is either active or retired
                  var skill_status = data.data.skill.skill_status;
                  var course_data = skills[skill];

                  // If u havent add courses
                  if (course_data.course_id.length == 0) {
                    courses.push({
                      course_completion: "Please add Course",
                      course_id: "No course",
                    });
                  } else {
                    for (var course in course_data.course_id) {
                      var course_id = course;
                      var course_completion =
                        course_data.course_id[course].course_completion;
                      // course completion can be Completed or null

                      // Because course here is from /completedlj, the courses refers to courses mapped to skill, we need to ensure that we added these courses to our LJ
                      if (coursesAddedToLJ.includes(course_id)) {
                        courses.push({
                          course_id,
                          course_completion,
                        });
                        // If the course is not from this lj but from another lj that you complete
                      } else if (course_completion == "Completed") {
                        courses.push({
                          course_id,
                          course_completion,
                        });
                      }
                    }
                    // if skill is retired dun show
                    if (skill_status == "Retired") {
                      skill_completion = "Retired";
                    }
                    // if skill is completed or not it status is ongoing
                    else if (course_data.skill_completion) {
                      skill_completion = course_data.skill_completion;
                    } else {
                      skill_completion = "OnGoing";
                    }
                  }
                })
                .catch((error) => {
                  console.error;
                });
              // if there is course for skill/jobrole but no course for lj
              if (courses.length == 0) {
                skill_completion = "";
                courses.push({
                  course_completion: "Please add Course",
                  course_id: "No course",
                });
              }
              if (skill_completion != "Retired") {
                skill_data.push({
                  skill_name,
                  skill_completion,
                  courses,
                });
              }
            }
          }
        })
        .catch((error) => {
          console.log("In StepperLJ: error caught");
        });
      setSteps(skill_data);
      props.setLoading(false);
    }

    GetSkills();
    getRoleName();
    getLJId();
  }, [props.role]);

  useEffect(() => {
    props.updateParent([...steps]);
  }, [steps]);

  function handlePopup() {
    setVisiblePopUp(true);
  }

  async function handleDelete() {
    await fetch("/delete_lj/" + "/" + ljId, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Learning Jouney ID: " + ljId + " is deleted.");
          window.location.reload();
          return response.json();
        }
      })
      .catch((error) => {
        console.log("In StepperLJ: error caught");
      });
  }

  function statusColor(status) {
    switch (status) {
      case `Completed`:
        return `success`;
      case `OnGoing`:
        return `warning`;
      default:
        return `secondary`;
    }
  }

  return (
    <CContainer>
      <CModal visible={visiblePopUp} onClose={() => setVisiblePopUp(false)}>
        <CModalHeader onClose={() => setVisiblePopUp(false)}>
          <CModalTitle>Confirm Deletion of Learning Journey?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Would you like to confirm deletion of </p>
          <p>
            Learning Journey{" "}
            <b>
              {" "}
              {ljId}: {jobrole} ?
            </b>{" "}
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisiblePopUp(false)}>
            No, Cancel
          </CButton>
          <CButton color="primary" onClick={() => handleDelete()}>
            Yes, Confirm
          </CButton>
        </CModalFooter>
      </CModal>
      {/* <CSpinner color="secondary" /> */}
      <CRow className="gx-5">
        <div>
          <h4>Your Learning Journey Progress for: {jobrole} </h4>
          <CButton
            className="pt-2"
            color="danger"
            variant="outline"
            onClick={() => handlePopup()}
          >
            Delete Learning Journey
          </CButton>
        </div>
        <div className="pb-1">
          <u>Skill Progress</u>
          <p>Total Number of Skills Required: {steps.length}</p>
        </div>
        <hr className="mt-3 mb-5"></hr>
        {steps.map((skill, index) => (
          <CCol key={index}>
            <CCard
              color={statusColor(skill.skill_completion)}
              textColor="white"
              className="align-items-center"
            >
              <CCardBody className="align-middle">
                <CCardText component={"span"} className="justify-center">
                  <h5>{skill.skill_name} </h5>
                </CCardText>
              </CCardBody>
            </CCard>
            <CRow className="my-3">
              <div className="text-center">
                {skill.courses.map((course, index) => (
                  <CCol
                    className="skill_card_with_course_under"
                    key={index}
                    value={course.course_id}
                  >
                    <label>
                      {course.course_id}
                      {course.course_completion == null
                        ? ": Ongoing "
                        : ": " + course.course_completion}
                    </label>
                    <CButton
                      className="ms-3 pt-0 pb-0 px-1"
                      color="danger"
                      style={{ color: "white" }}
                      shape="rounded-circle"
                      size="sm"
                      value={course.course_id}
                      id={course.course_id}
                      onClick={removeCourse}
                      hidden={
                        course.course_completion == "Please add Course" ||
                        course.course_completion == "Completed"
                      }
                    >
                      X
                    </CButton>
                  </CCol>
                ))}
              </div>
            </CRow>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  );
}
