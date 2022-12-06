import React, { useState, useEffect } from 'react'
import CreateSkillTable from 'src/components/Cards/CreateSkillTable'
import { CButton } from '@coreui/react'
import { HRSidebar, AppHeader } from "../../../components";
function CreateSkills() {
    //retrieve the staff id used for logging in, which is stored in local storage
    const [Token, setToken] = useState();
    useEffect(() => {
    const Token = JSON.parse(localStorage.getItem('Token'));
    if (Token) {
     setToken(Token);
    }
  }, []);


  return (
    <div>
      <div>
        <HRSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 ">
          <AppHeader />
          <div>
            <CreateSkillTable className="body flex-grow-1 px-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSkills
