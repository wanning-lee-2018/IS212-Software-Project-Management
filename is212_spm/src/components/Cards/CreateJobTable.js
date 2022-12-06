import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CContainer,
} from "@coreui/react";
import PropTypes from "prop-types";

import { cilXCircle } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function CreateJobTable(props) {
  CreateJobTable.propTypes = {
    listOfSkills: PropTypes.arrayOf(PropTypes.object),
  };

  const [inputs, setInputs] = useState({ status: "active" });
  // For handling change in input fields
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // For input for search bar when searching for specific skill
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const handleSkillSearchTermChange = (event) => {
    setSkillSearchTerm(event.target.value);
  };

  // For keeping track of which skills have been SELECTED
  const [selectedSkills, setSelectedSkills] = useState([]);
  const onClickSkillHandler = (event) => {
    // check if already selected inserted into selectedSkills array
    // Avoid repeats
    if (
      !selectedSkills.find((skill) => skill.skill_id === event.target.value)
    ) {
      const tempObj = {
        skill_id: event.target.value,
        skill_name: event.target.label,
        // can only see and select "active" skills anyway
        skill_status: "Active",
      };
      setSelectedSkills([...selectedSkills, tempObj]);
    }
  };

  const navigate = useNavigate();
  const handleCancel = () => {
    // Redirect back to View JobROles page without saving...
    setTimeout(() => {
      navigate("/job_rolesHR");
    }, 500);
  };

  // Handle deletion of selectedSkill onClick
  const onClickRemoveSelectedSkill = (event) => {
    const newArr = selectedSkills.filter((object) => {
      return object.skill_id.toString() !== event.target.value;
    });
    setSelectedSkills(newArr);
  };

  // Handle Submit of EDIT
  const handleSubmit = async (event) => {
    event.preventDefault();
    const jobrole_obj = {
      // Job Role name [string]
      jobrole_name: inputs.jobrole_name,
      // Job Role status [string]
      jobrole_status: inputs.status,
      // Skills for specific Job Role [array]
      associated_skills: selectedSkills,
    };

    // Handle Job creation
    const response = await fetch("/create_jobrole", {
      method: "POST",
      body: JSON.stringify(jobrole_obj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      // Error has occured
      console.log(`An error has occured: ${response.status}`);
      if (document.getElementById("error")) {
        document.getElementById("error").innerText =
          "No Repeated or Blank name!";
      }
    } else {
      alert("Job Role successfully created!!");
      if (document.getElementById("error")) {
        document.getElementById("error").innerText = "";
      }
      await response.json();

      // Handle createJobSKill relationship hmmmm not sure how tbh
      // Step#1 get newly created JobRole id
      const response2 = await fetch(
        "http://localhost:5000/job_role/" + jobrole_obj.jobrole_name
      );
      if (!response2.ok) {
        // Error has occured
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      } else {
        const data = await response2.json();
        var new_mapping_obj = {
          jobrole_id: data.data.jobrole.jobrole_id,
          skill_array: jobrole_obj.associated_skills,
        };
        // Step#2 insert new JobRole id + skil id pair for every skill
        const response3 = await fetch("/create_mapping_jobrole_skill", {
          method: "POST",
          body: JSON.stringify(new_mapping_obj),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        if (!response3.ok) {
          // Error has occured
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        } else {
          alert("Skills successfully Linked to Job Role");
          setTimeout(() => {
            navigate("/job_rolesHR");
          }, 500);
          return response3.json();
        }
      }
    }
  };

  return (
    <div>
      <div className="px-4">
        <h1 style={{ color: "#47789e" }}>Create New Job Role</h1>
        <div>
          <CContainer className="overflow-hidden">
            <CForm>
              <CRow xs={{ gutterY: 5, gutterX: 5 }} className="mt-1">
                <CCol lg={{ span: 8 }}>
                  <CFormInput
                    type="text"
                    id="Input1"
                    label="Job Role*"
                    name="jobrole_name"
                    placeholder="e.g. Analyst"
                    value={inputs.jobrole_name || ""}
                    onChange={handleChange}
                  />
                  <div id="error" style={{ color: "#fa2a31" }}></div>
                </CCol>
                <CCol lg={{ span: 4 }}>
                  <CFormSelect
                    id="Input2"
                    label="Status"
                    name="status"
                    value={inputs.status || ""}
                    onChange={handleChange}
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Retired", value: "Retired" },
                    ]}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-5">
                <CCol>
                  <CFormInput
                    className=""
                    type="text"
                    id="skill_search"
                    label="Skill*"
                    name="skill_search"
                    placeholder="Search for a skill"
                    value={skillSearchTerm}
                    onChange={handleSkillSearchTermChange}
                  />
                  <div id="error" style={{ color: "#fa2a31" }}></div>
                  <CFormSelect
                    id="skills_dropdown"
                    size="sm"
                    className="mb-1"
                    aria-label="skilllist"
                    multiple
                    htmlSize={3}
                    hidden={!skillSearchTerm.length > 0}
                  >
                    {props.listOfSkills?.map((skill, index) => {
                      // Only show active skills
                      return skill.skill_status === "Active" &&
                        skill.skill_name
                          .toLowerCase()
                          .includes(skillSearchTerm) ? (
                        <option
                          key={index}
                          id={skill.skill_id}
                          value={skill.skill_id}
                          onClick={onClickSkillHandler}
                          name={skill.skill_name}
                          label={skill.skill_name}
                        >
                          {skill.skill_name}
                        </option>
                      ) : null;
                    })}
                  </CFormSelect>
                  <>
                    {/* onhover show "x" icon for deletion of selectedSkill*/}
                    {/* onClick performs deletion of selectedSkill  */}
                    {selectedSkills?.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        value={skill.skill_id}
                        className="btn btn-light  rounded-pill mx-1 mt-3"
                        onClick={onClickRemoveSelectedSkill}
                      >
                        {skill.skill_name}
                        <CIcon className="ms-1" icon={cilXCircle} size="sm" />
                      </button>
                    ))}
                  </>
                </CCol>
              </CRow>
              <i className="cil-energy icon icon-xxl"></i>
              <CRow className="justify-content-end mt-auto" xs={{ gutterY: 5 }}>
                <CCol sm="auto">
                  <CButton
                    id="confirm_btn"
                    type="submit"
                    color="success"
                    shape="rounded-0"
                    style={{ color: "white" }}
                    onClick={handleSubmit}
                  >
                    Confirm Changes
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton
                    id="cancel_btn"
                    color="danger"
                    shape="rounded-0"
                    style={{ color: "white" }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CContainer>
        </div>
      </div>
    </div>
  );
}
