import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CCol, CContainer, CRow, CSpinner } from "@coreui/react";
import { AppSidebar, AppHeader } from "../../../components";
import RolesTable from "src/components/Cards/RolesTable";

export default function ViewRoles() {
  //retrieve the staff id used for logging in, which is stored in local storage
  const [Token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStaffId, setcurrentStaffId] = useState("");
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
    }
  }, []);

  // use state -> local storage for page
  const [roles, setRoles] = useState([]);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_id"]);
    }
    var staff_id = Token["Staff_id"];
    if (flag !== false) {
      // Loading
      setIsLoading(true);
      fetch("http://localhost:5000/job_roles_filtered/" + Token["Staff_id"])
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setFlag(false);
            throw Error("no more roles remaining");
          }
        })
        .then((data) => {
          setRoles(data.data.jobrole);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Fetch job roles: error caught");
          setIsLoading(false);
        });
    }
  }, [flag]);

  if (isLoading) {
    return (
      <div>
        <div>
          <AppSidebar />
          <div className="wrapper d-flex flex-column">
            <AppHeader />
            <div className="body flex-grow-1 p-1">
              {/* Actual Content Starts here */}
              <h1 className="pb-3">
                <b>View Job Roles</b>
              </h1>
              <CContainer>
                <CRow>
                  <div className="d-flex justify-content-center pb-4">
                    <CSpinner color="secondary" />
                  </div>
                </CRow>
              </CContainer>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <AppSidebar />
          <div className="wrapper d-flex flex-column">
            <AppHeader />
            <div className="body flex-grow-1 p-1">
              {/* Actual Content Starts here */}
              <h1 className="pb-3">
                <b>View Job Roles</b>
              </h1>
              {flag && (
                <>
                  <CContainer hidden={isLoading}>
                    <CRow>
                      <CCol>
                        <RolesTable
                          staff_id={currentStaffId}
                          listofRoles={roles}
                          rowsPerPage={5}
                        />
                      </CCol>
                      {/* </div> */}
                    </CRow>
                  </CContainer>
                  <CContainer hidden={!isLoading}>
                    <CRow>
                      <div className="d-flex justify-content-center pb-4">
                        <CSpinner color="secondary" />
                      </div>
                    </CRow>
                  </CContainer>
                </>
              )}
              {!flag && (
                <h5 style={{ color: "#fa2a31" }}>
                  There are no more roles available to add to your Learning
                  Journey!
                </h5>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
