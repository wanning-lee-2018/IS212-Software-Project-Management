import React, { useState, useEffect } from "react";
import {
  CCard,
  CCol,
  CRow,
  CCallout,
  CCardBody,
  CCardTitle,
  CCardText,
  CProgress,
  CProgressBar,
  CFormSelect,
  CSpinner,
} from "@coreui/react";
import StepperLJ from "../Stepper/StepperLJ";

export default function LearningJourneyCard() {
  let roles = [];
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [progress, setProgress] = useState(0);
  const [numRoles, setNumRoles] = useState(0);
  const [ljId, setLjId] = useState("");
  const [numLjs, setNumLjs] = useState(0);
  // const [ljId, setLjId] = useState("");
  const [loading, setLoading] = useState(false);
  const [ljCompleted, setljCompleted] = useState(0);
  const [ljStatus, setLjStatus] = useState("");
  const [visible, setVisible] = useState(true);

  const [Token, setToken] = useState();
  const [currentStaffId, setcurrentStaffId] = useState("");
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_id"]);
    }
  }, []);

  async function ProgressBar() {
    var isCourseAdded = false;
    if (skills) {
      var total_skills = skills.length;
      var count = 0;
      for (var skill of skills) {
        if (skill.skill_completion === "Completed") {
          count++;
        }
        if (skill.courses.length > 0) {
          for (var course of skill.courses) {
            if (course.course_id != "No course") {
              isCourseAdded = true;
            }
          }
        }
      }
      var now = ((count / total_skills) * 100).toFixed(2);
      if (now !== "NaN") {
        setProgress(parseInt(now));
      }
    }
    if (now === 100) {
      setLjStatus("Completed");
      setVisible(false);
    } else if (now > 0) {
      setLjStatus("In Progress");
      setVisible(false);
    } else if (isCourseAdded) {
      setLjStatus("In Progress");
      setVisible(false);
    } else {
      if (selectedJobRole !== "") {
        setLjStatus(
          "Please add courses to selected role to create learning journey!"
        );
        setVisible(true);
      }
    }
  }

  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_id"]);
    }

    // GET all user's jobroles for staff_id = "000001"
    fetch("/learning_journey/" + Token["Staff_id"])
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setNumRoles(data.data.jobrole.length);
        for (let each of data.data.jobrole) {
          roles.push(each);
        }
        setJobRoles(roles);
      })
      .catch((error) => {
        console.error;
      });

    fetch("/completed_lj/" + Token["Staff_id"])
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setljCompleted(data.data.lj_completed_num);
        var numLj = 0;
        let jobRoles = data.data.data_raw.jobrole_id;
        for (const key in jobRoles) {
          if (!jobRoles[key].skill_id[null]) {
            numLj++;
          }
          setNumLjs(numLj);
        }
      })
      .catch((error) => {
        console.log("In StepperLJ: error caught");
      });
  }, []);

  // Updates progressbar when list of skills change
  useEffect(() => {
    ProgressBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  const handleRoleChange = (event) => {
    setLoading(true);
    setSelectedJobRole("");
    setLjId(jobRoles[event.target.selectedIndex - 1].lj_id);
    setSelectedJobRole(event.target.value);
    // Simply a Checker to see if User has added any courses for this particular course
    // IF have setVisible("visible");
  };

  return (
    <>
      <CRow>
        <CCol xs={4}>
          <CCard>
            <CCardBody className="text-center">
              <CCardTitle component={"span"}>
                <h2> {numLjs}</h2>
              </CCardTitle>
              <CCardText>
                Total No. Learning Journeys
                <br></br>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={4}>
          <CCard>
            <CCardBody className="text-center">
              <CCardTitle component={"span"}>
                <h2>{ljCompleted}</h2>
              </CCardTitle>
              <CCardText>
                Learning Journeys Completed
                <br></br>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={4}>
          <CCard>
            <CCardBody className="text-center">
              <CCardTitle component={"span"}>
                <h2>{numLjs - ljCompleted}</h2>
              </CCardTitle>
              <CCardText>
                Learning Journeys in progress
                <br></br>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCallout color="primary">
            <CRow className="pt-2 px-2">
              <h3>
                <b>MY LEARNING JOURNEY</b>
              </h3>
            </CRow>
            <div
              hidden={!loading}
              className="d-flex justify-content-center pb-3"
            >
              <CSpinner hidden={!loading} color="secondary" />
            </div>
            <div hidden={loading}>
              <CRow className="d-flex px-3 pt-3">
                <div className="d-flex">
                  <span>Role Selected:</span>
                  <CCol className="px-3 ml-4">
                    <CFormSelect
                      value={selectedJobRole}
                      selected={selectedJobRole}
                      onChange={handleRoleChange}
                      className="primary"
                      aria-label="Select a role to view LJ"
                    >
                      <option disabled value="">
                        Select a role to view LJ
                      </option>
                      {jobRoles.map((job, index) => (
                        <option
                          label={job.jobrole_name}
                          key={job.lj_id}
                          value={job.jobrole_id}
                        >
                          {job.jobrole_name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </div>
                <p
                  className={
                    selectedJobRole !== ""
                      ? "visible py-2 my-1 pb-3"
                      : "invisible py-2 my-1 pb-3"
                  }
                >
                  <u>Learning Journey Status:</u> {ljStatus}
                </p>
                <hr className="p-0 m-0"></hr>
                <p
                  className={
                    visible && selectedJobRole !== "" ? "visible" : "invisible"
                  }
                  style={{ color: "red", margin: "0px" }}
                >
                  Note: No courses added! Please add courses to start your
                  learning journey.
                </p>
              </CRow>
              <CRow className="d-flex p-2">
                <div className={visible ? "invisible" : "visible"}>
                  <StepperLJ
                    staff_id={currentStaffId}
                    role={selectedJobRole}
                    lj={ljId.toString()}
                    updateParent={setSkills}
                    setLoading={setLoading}
                  ></StepperLJ>

                  <CProgress className="m-3 px-0">
                    <CProgressBar value={progress}>{progress}%</CProgressBar>
                  </CProgress>
                  {/* <CRow className="px-4 pb-1"> */}
                  <CCard className="p-0 mx-3" style={{ width: "16 rem" }}>
                    <CCardBody className="p-2 px-3">
                      {/* <CCardTitle>
                      <u>Legend</u>
                    </CCardTitle> */}
                      <CCardText className="small m-0">
                        <u>Key:</u>
                      </CCardText>
                      <CCardText className=" small text-warning m-0">
                        Yellow: In Progress
                      </CCardText>
                      <CCardText className="small text-success m-0">
                        Green: Completed
                      </CCardText>
                      <CCardText className="small text-secondary m-0">
                        Grey: No Course Added
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </div>
              </CRow>
            </div>
          </CCallout>
        </CCol>
      </CRow>
    </>
  );
}
