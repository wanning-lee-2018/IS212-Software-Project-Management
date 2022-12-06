import React, { useState } from "react";

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
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Routes,
  useNavigate,
  Outlet,
  Link,
} from "react-router-dom";

export default function CreateSkillTable() {
  const [inputs, setInputs] = useState({ status: "Active" });
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var status = inputs.status;
    var skill = inputs.skillname;
    var skillobj = {
      skill_name: skill,
      skill_status: status,
    };

    fetch("/create_skill", {
      method: "POST",
      body: JSON.stringify(skillobj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          if (document.getElementById("error")) {
            document.getElementById("error").innerText = "";
          }
          document.getElementById("Input1").value = "";
          alert(
            "Skill sucessfully created! You will be redirected to skills management page"
          );
          setTimeout(() => {
            navigate("/view_skills");
          }, 1000);
          return response.json();
        } else {
          if (document.getElementById("error")) {
            document.getElementById("error").innerText =
              "No Repeated or Blank name!";
          }
        }
      })
      .catch((error) => {
        console.error;
      });
  };

  function discard() {
    // Redirect back to View JobROles page without saving...
    setTimeout(() => {
      navigate("/view_skills");
    }, 500);
  }

  return (
    <div>
      <div className="px-4">
        <h1 style={{ color: "#47789e" }}>Create New Skills</h1>
        <div>
          <CContainer className="overflow-hidden">
            <CForm onSubmit={handleSubmit}>
              <CRow xs={{ gutterY: 5, gutterX: 5 }} className="mt-1">
                <CCol lg={{ span: 8 }}>
                  <CFormInput
                    type="text"
                    id="Input1"
                    label="Skill Name"
                    name="skillname"
                    placeholder="Example Skill"
                    value={inputs.skillname || ""}
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
                      { label: "Retired", value: "retired" },
                    ]}
                  />
                </CCol>
              </CRow>
              <CRow className="justify-content-end mt-auto" xs={{ gutterY: 5 }}>
                <CCol sm="auto">
                  <CButton
                    id="confirm_btn"
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
                    id="discard_btn"
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
