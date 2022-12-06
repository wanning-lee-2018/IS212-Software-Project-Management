import React, { useState, useEffect } from "react";
import {
  CCol,
  CContainer,
  CRow,
  CButton,
  CFormInput,
  CSpinner,
} from "@coreui/react";

// import SkillTable from "src/components/Cards/SkillTable";
import HRSidebar from "../../../components/HRSidebar";
import AppHeader from "src/components/AppHeader";
import RolesTableHR from "src/components/Cards/RolesTableHR";

function ViewRolesHR() {
  //retrieve the staff id used for logging in, which is stored in local storage
  const [Token, setToken] = useState();
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
    }
  }, []);

  const [Role, setJobrole] = useState([]);
  const [DisplayRole, setDisplayRole] = useState([]);
  const [Input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/job_roles_all")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setJobrole(data.data.jobrole);
        setDisplayRole(data.data.jobrole);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Fetch ALL job roles: error caught");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (Input == "") {
      setDisplayRole(Role);
    } else {
      let newRole = [];
      Role.forEach((jobrole) => {
        if (jobrole.jobrole_name.toLowerCase().includes(Input.toLowerCase())) {
          newRole.push(jobrole);
        }
      });
      setDisplayRole(newRole);
    }
  }, [Input]);

  return (
    <div>
      <div>
        <HRSidebar />
        <div className="wrapper d-flex flex-column">
          <AppHeader />
          <div className="body flex-grow-1 p-1">
            {/* Actual Content Starts here */}
            <h1 className="pb-3">
              <b>Job Roles Management</b>
            </h1>
            <CContainer>
              <CRow>
                <CCol>
                  <div className="mt-auto p-2 docs-highlight">
                    <CFormInput
                      disabled={isLoading}
                      type="text"
                      id="Input1"
                      label="Search by Job Role name:"
                      name="jobrole_name"
                      placeholder="e.g. Analyst"
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol lg="2" className="mt-auto p-2 docs-highlight">
                  <a href="/create_jobs">
                    <CButton
                      disabled={isLoading}
                      id="createNewJobRole_btn"
                      color="success"
                      shape="square"
                    >
                      Create Job Role
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
                  <CCol>
                    <RolesTableHR listofRoles={DisplayRole} rowsPerPage={5} />
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

export default ViewRolesHR;
