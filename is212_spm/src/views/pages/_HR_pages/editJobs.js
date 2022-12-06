import React, { useState, useEffect } from "react";
import EditJobTable from "src/components/Cards/EditJobTable";
import { HRSidebar, AppHeader } from "../../../components";
function EditJobs() {
    //retrieve the staff id used for logging in, which is stored in local storage
    const [Token, setToken] = useState();
    useEffect(() => {
    const Token = JSON.parse(localStorage.getItem('Token'));
    if (Token) {
     setToken(Token);
    }
  }, []);
  
  const [skills, setSkills] = useState([]);
  // Initalise all the necessary checkboxes from DB. ALL Job ROles
  useEffect(() => {
    fetch("/skills")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setSkills(data.data.skill);
      })
      .catch((error) => {
        console.error;
      });
  }, []);

  return (
    <div>
      <div>
        <HRSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 ">
          <AppHeader />
          <div>
            <EditJobTable
              className="body flex-grow-1 px-3"
              listOfSkills={skills}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditJobs;
