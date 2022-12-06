import React, { useState, useEffect } from "react";
import {
  CCol,
  CContainer,
  CRow,
  CButton,
  CFormInput,
  CSpinner,
} from "@coreui/react";

import SkillTable from "src/components/Cards/SkillTable";
import HRSidebar from "../../../components/HRSidebar";
import AppHeader from "src/components/AppHeader";

function ViewSkills() {
  //retrieve the staff id used for logging in, which is stored in local storage
  const [Token, setToken] = useState();
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
    }
  }, []);
  const [skills, setSkills] = useState([]);
  const [DisplaySkills, setDisplaySkills] = useState([]);
  const [Input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/skills")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setSkills(data.data.skill);
        setDisplaySkills(data.data.skill);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Fetch skills: error caught");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (Input == "") {
      setDisplaySkills(skills);
    } else {
      let newskill = [];
      skills.forEach((skill) => {
        if (skill.skill_name.toLowerCase().includes(Input.toLowerCase())) {
          newskill.push(skill);
        }
      });
      setDisplaySkills(newskill);
    }
  }, [Input]);

  //  if (isLoading) {
  //   return ()}
  return (
    <div>
      <div>
        <HRSidebar />
        <div className="wrapper d-flex flex-column">
          <AppHeader />
          <div className="body flex-grow-1 p-1">
            {/* Actual Content Starts here */}

            <h1 className="pb-3">
              <b>Skills Management</b>
            </h1>
            {/* TOP content */}
            <CContainer className="w-100 m-0">
              <CRow>
                <CCol>
                  <div className="mt-auto p-2 docs-highlight">
                    <CFormInput
                      disabled={isLoading}
                      type="text"
                      id="Input1"
                      label="Skill Name:"
                      name="skill_name"
                      placeholder="e.g. Python"
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol lg="2" className="mt-auto p-2 docs-highlight">
                  <a href="/create_skills">
                    <CButton
                      disabled={isLoading}
                      id="createNewSkill_btn"
                      color="success"
                      shape="square"
                    >
                      Create Skills
                    </CButton>
                  </a>
                </CCol>
              </CRow>
              <CRow>
                {isLoading ? (
                  <div className="d-flex justify-content-center pb-4">
                    <CSpinner color="secondary" />
                  </div>
                ) : (
                  <CCol sx="12" sm="12" md="12" lg="12">
                    <SkillTable listofSkills={DisplaySkills} rowsPerpage={5} />
                  </CCol>
                )}
              </CRow>
            </CContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSkills;
