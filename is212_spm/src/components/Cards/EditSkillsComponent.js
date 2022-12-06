import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CContainer,
} from "@coreui/react";
import {
  useParams,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

export default function EditSkillsComponent(my_prop) {
  EditSkillsComponent.propTypes = {
    skill_id: PropTypes.number,
  };
  const [tempInput, setTempInput] = useState("");

  useEffect(() => {
    fetch("/skills/" + my_prop.skill_id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("error");
        }
      })
      .then((data) => {
        setTempInput(data.data.skill.skill_name);
        document.getElementById("Input1").value = data.data.skill.skill_name;
        document.getElementById("Input2").value = data.data.skill.skill_status;

        setInputs({
          skill_name: data.data.skill.skill_name,
          skill_status: data.data.skill.skill_status,
        });
      })
      .catch((error) => {
        console.error;
      });
  }, []);

  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const params = useParams();
  const handleSubmit = (event) => {
    event.preventDefault();
    var skillobj = {
      skill_id: params.id,
      skill_name: inputs.skill_name,
      skill_status: inputs.skill_status,
    };
    fetch("/update_skill/" + params.id, {
      method: "POST",
      body: JSON.stringify(skillobj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          // document.getElementById("error").innerText = "";
          // document.getElementById("Input1").value = "";
          alert(
            "Skill sucessfully edited! You will be redirected to skills management page"
          );
          setTimeout(() => {
            navigate("/view_skills");
          }, 500);
          return response.json();
        } else {
          if (document.getElementById("error")) {
            document.getElementById("error").innerText = "Error saving to db!";
          }
        }
      })
      .catch((error) => {
        console.error;
      });
  };

  function discard() {
    document.getElementById("Input1").value = "";
    document.getElementById("Input2").value = "";
  }

  return (
    <div>
      <div className="px-4">
        <h1 style={{ color: "#47789e" }}>Edit Skills</h1>
        <div>
          <CContainer className="overflow-hidden">
            <CForm onSubmit={handleSubmit}>
              <CRow xs={{ gutterY: 5, gutterX: 5 }} className="mt-1">
                <CCol lg={{ span: 8 }}>
                  <CFormInput
                    type="text"
                    id="Input1"
                    label="Skill Name"
                    name="skill_name"
                    placeholder=""
                    defaultValue={tempInput || ""}
                    onChange={handleChange}
                  />
                  <div id="error" style={{ color: "#fa2a31" }}></div>
                </CCol>
                <CCol lg={{ span: 4 }}>
                  <CFormSelect
                    id="Input2"
                    label="Status"
                    name="skill_status"
                    defaultValue={inputs.status || ""}
                    onChange={handleChange}
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Retired", value: "Retired" },
                    ]}
                  />
                </CCol>
              </CRow>
              <CRow className="justify-content-end mt-auto" xs={{ gutterY: 5 }}>
                <CCol sm="auto">
                  <CButton
                    type="submit"
                    color="success"
                    shape="rounded-0"
                    style={{ color: "white" }}
                  >
                    Confirm Changes
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton
                    color="danger"
                    shape="rounded-0"
                    onClick={discard}
                    style={{ color: "white" }}
                  >
                    Discard Changes
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
