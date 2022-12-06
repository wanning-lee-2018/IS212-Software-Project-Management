import React, { useState, useEffect } from 'react'
import EditSkillsComponent from 'src/components/Cards/EditSkillsComponent'
import { CButton } from '@coreui/react'
import { HRSidebar, AppHeader } from "../../../components";
import {useParams, BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom'

function EditSkills() {
    //retrieve the staff id used for logging in, which is stored in local storage
    const [Token, setToken] = useState();
    useEffect(() => {
    const Token = JSON.parse(localStorage.getItem('Token'));
    if (Token) {
     setToken(Token);
    }
  }, []);

  const params = useParams();

  return (
    <div>
      <div>
        <HRSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 ">
          <AppHeader />
          <div>
            <EditSkillsComponent skill_id={Number(params.id)}>{params.id}</EditSkillsComponent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSkills
