import React, { useEffect, useState } from "react";
import {
  useParams,
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

export default function EditJobTable(props) {
  EditJobTable.propTypes = {
    listOfSkills: PropTypes.arrayOf(PropTypes.object),
  };

  const [haveChanges, setHaveChanges] = useState(false);
  const [initialDetails, setInitialDetails] = useState({});
  // For keeping track of which skills have been SELECTED
  const [selectedSkills, setSelectedSkills] = useState([]);

  // GET CHOSEN Job Role id from params
  const params = useParams();
  // INITIALISE DATA OF CHOSEN Job Role
  useEffect(() => {
    // get jobrole_id from Params
    fetch("/job_role_by_id/" + params.id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setInitialDetails(data.data.jobrole);
      })
      .catch((error) => {
        console.error;
      });

    // Get all skills related to specific jobrole...
    var temp_str = [];
    temp_str += params.id;
    fetch("/skills_for_jobroles_list/" + JSON.stringify(temp_str))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setSelectedSkills(data.data.skill);
      })
      .catch((error) => {
        console.error;
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [inputs, setInputs] = useState({ jobrole_name: "", status: "Active" });
  // For handling change in input fields
  const handleChange = (event) => {
    setHaveChanges(true);
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // For input for search bar when searching for specific skill
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const handleSkillSearchTermChange = (event) => {
    setSkillSearchTerm(event.target.value);
  };

  const onClickSkillHandler = (event) => {
    // check if already selected inserted into selectedSkills array
    setHaveChanges(true);
    // Avoid repeats
    if (
      !selectedSkills.find(
        (skill) => skill.skill_id === parseInt(event.target.value)
      )
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
    setHaveChanges(true);
    var newArr = [...selectedSkills];
    newArr = newArr.filter((object) => {
      return object.skill_id.toString() !== event.target.value;
    });
    setSelectedSkills(newArr);
  };

  // Handle Submit of Form
  const handleSubmit = async (event) => {
    event.preventDefault();

    var finalJobRoleName = initialDetails.jobrole_name;

    // IF user input jobrole name is undefined/empty AND not same as initial input
    if (
      inputs.jobrole_name.length > 0 &&
      inputs.jobrole_name !== initialDetails.jobrole_name
    ) {
      finalJobRoleName = inputs.jobrole_name;
    } else if (
      inputs.jobrole_name.length === 0 &&
      document.getElementById("Input1").value !== initialDetails.jobrole_name
    ) {
      if (document.getElementById("error")) {
        document.getElementById("error").innerText =
          "Please fill in the name of Job role!";
      }

      return;
    }
    const jobrole_obj = {
      jobrole_name: finalJobRoleName,
      jobrole_status: inputs.status,
      // Skills for specific Job Role [array]
      associated_skills: selectedSkills,
    };

    // Handle EDIT JOB ROLE
    // CHeck if any changes were made to name,
    // If still the same name
    // Just update the status.
    const response = await fetch("/update_jobrole/" + params.id.toString(), {
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
      alert("Job Role successfully edited!!");
      if (document.getElementById("error")) {
        document.getElementById("error").innerText = "";
      }
      await response.json();

      // Handle createJobSKill relationship hmmmm not sure how tbh
      // Step#1 get newly created JobRole id
      const response2 = await fetch(
        "/job_role/" + jobrole_obj.jobrole_name
      ).catch((error) => {
        console.log("Fetch job role: error caught");
      });
      if (!response2.ok) {
        // Error has occured
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      } else {
        // alert("Job Role successfully FOUND!! We needed this id thanks!");
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
        <h1 style={{ color: "#47789e" }}>Edit Job Role</h1>
        <div>
          <CContainer className="overflow-hidden">
            <CForm>
              <CRow xs={{ gutterY: 5, gutterX: 5 }} className="mt-1">
                <CCol lg={{ span: 4 }}>
                  <p>
                    <b>Role ID:</b>
                  </p>
                  <p>{initialDetails.jobrole_id || "-"}</p>
                </CCol>
              </CRow>
              <CRow xs={{ gutterY: 5, gutterX: 5 }} className="mt-1">
                <CCol lg={{ span: 8 }}>
                  <CFormInput
                    type="text"
                    id="Input1"
                    label="Job Role*"
                    name="jobrole_name"
                    placeholder="e.g. Analyst"
                    defaultValue={initialDetails.jobrole_name || ""}
                    onChange={handleChange}
                  />
                  <div id="error" style={{ color: "#fa2a31" }}></div>
                </CCol>
                <CCol lg={{ span: 4 }}>
                  <CFormSelect
                    id="Input2"
                    label="Status"
                    name="status"
                    defaultValue={initialDetails.jobrole_status}
                    onChange={handleChange}
                    options={
                      initialDetails.jobrole_status === "Active"
                        ? [
                            { label: "Active", value: "Active" },
                            { label: "Retired", value: "Retired" },
                          ]
                        : [
                            { label: "Retired", value: "Retired" },
                            { label: "Active", value: "Active" },
                          ]
                    }
                  />
                </CCol>
              </CRow>
              <CRow className="mt-5">
                <p></p>
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
                    type="submit"
                    color="success"
                    shape="rounded-0"
                    style={{ color: "white" }}
                    disabled={!haveChanges}
                    onClick={handleSubmit}
                  >
                    Confirm Changes
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton
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
