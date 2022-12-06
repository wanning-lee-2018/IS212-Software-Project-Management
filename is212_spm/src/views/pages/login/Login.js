import React, { useState, useEffect } from "react";
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
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CFormSelect,
} from "@coreui/react";

const Login = () => {
  const [Token, setToken] = useState();
  const navigate = useNavigate();
  const [StaffInput, setStaffInput] = useState("");
  async function handleAdd(StaffInput) {
    const login_url = "http://localhost:5000/login/" + StaffInput;
    await fetch(login_url)
      .then((response) => {
        if (response.ok) {
          document.getElementById("Stafferror").innerText = "";
          return response.text();
        } else {
          if (document.getElementById("Stafferror")) {
            document.getElementById("Stafferror").innerText =
              "Please enter a valid Staff ID!";
            setRoleDropdownOptions("");
          }
        }
      })
      .then((data) => {
        if (data == "2") {
          setRoleDropdownOptions([{ value: "User", rolename: "Staff" }]);
        } else if (data == "1") {
          setRoleDropdownOptions([
            { value: "User", rolename: "Staff" },
            { value: "Admin", rolename: "Human Resource" },
          ]);
        }
      })
      .catch((error) => {
        console.error;
      });
  }

  useEffect(() => {
    if (StaffInput != "") {
      handleAdd(StaffInput);
    }
  }, [StaffInput]);

  const handleChange = (event) => {
    setStaffInput(event.target.value);
  };

  const [RoleInput, setRoleInput] = useState("");
  const handleChange2 = (event) => {
    setRoleInput(event.target.value);
  };

  const [RoleDropdownOptions, setRoleDropdownOptions] = useState("");

  function Redirect(role_name) {
    if (role_name === "User") {
      setTimeout(() => {
        navigate("/learning_journey");
      }, 200);
    } else if (role_name === "Admin") {
      setTimeout(() => {
        navigate("/view_skills");
      }, 200);
    }
  }

  let RoleDropdownOptionsList =
    RoleDropdownOptions.length > 0 &&
    RoleDropdownOptions.map((item, i) => {
      return (
        <option key={i} value={item.value}>
          {item.rolename}
        </option>
      );
    });

  const handleSubmit = (event) => {
    event.preventDefault(); //  prevent page refresh
    if (StaffInput != "" && RoleInput != "") {
      document.getElementById("Stafferror").innerText = "";
      document.getElementById("Roleerror").innerText = "";
      localStorage.setItem("Token", JSON.stringify({ Staff_id: StaffInput }));
      Redirect(RoleInput);
      //  clear all input values in the form
      setStaffInput("");
      setRoleInput("");
    }
    if (StaffInput == "") {
      document.getElementById("Roleerror").innerText = "";
      if (document.getElementById("Stafferror")) {
        document.getElementById("Stafferror").innerText =
          "Please enter a valid Staff ID!";
      }
    }
    if (StaffInput != "" && RoleInput == "") {
      document.getElementById("Stafferror").innerText = "";
      if (document.getElementById("Roleerror")) {
        document.getElementById("Roleerror").innerText =
          "Please select a role !";
      }
    }
  };

  return (
    <div className="d-flex p-5 align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit} noValidate>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CRow xs={{ gutter: 2 }}>
                      <CCol md>
                        <CFormInput
                          id="staffID"
                          floatingLabel="Enter Staff ID"
                          onChange={handleChange}
                          value={StaffInput}
                        />
                        <div id="Stafferror" style={{ color: "#fa2a31" }}></div>
                      </CCol>
                      <CCol md>
                        <CFormSelect
                          id="role"
                          onChange={handleChange2}
                          value={RoleInput}
                          style={{ height: "60px" }}
                        >
                          <option>Select Role</option>
                          {RoleDropdownOptionsList}
                        </CFormSelect>
                        <div id="Roleerror" style={{ color: "#fa2a31" }}></div>
                      </CCol>
                      <CCol md>
                        <CButton
                          id="login_btn"
                          color="primary"
                          type="submit"
                          style={{ height: "60px" }}
                          size="lg"
                        >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow></CRow>
                    {/* <CRow>
                      <CCol>
                        <a href="/learning_journey">
                          <CButton color="primary" className="px-4 m-4">
                            Login as Staff
                          </CButton>
                        </a>
                        <a href="/view_skills">
                          <CButton color="warning" className="px-4">
                            Login as HR
                          </CButton>
                        </a>
                      </CCol>
                    </CRow> */}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
