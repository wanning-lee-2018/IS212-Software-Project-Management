import React, { useState, useEffect } from "react";
import { AppSidebar, AppHeader } from "../../../components";
import LearningJourneyCard from "../../../components/Cards/LearningJourneyCard";
import LearningJourneyBlank from "../../../components/Cards/LearningJourneyBlank";

export default function LearningJourney() {
  //retrieve the staff id used for logging in, which is stored in local storage
  const [Token, setToken] = useState();
  const [currentStaffId, setcurrentStaffId] = useState("");
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_id"]);
    }
  }, []);
  const [LjVisible, setLJVisible] = useState(false);
  const [LjGetstarted, setLJStartVisible] = useState(false);

  // Fetch data of learning journey to see if there are staff roles.
  useEffect(() => {
    const Token = JSON.parse(localStorage.getItem("Token"));
    if (Token) {
      setToken(Token);
      setcurrentStaffId(Token["Staff_id"]);
    }
    fetch("http://localhost:5000/learning_journey/" + Token["Staff_id"])
      .then((response) => {
        if (response.status === 200) {
          setLJVisible(true);
        } else if (response.status === 404) {
          setLJStartVisible(true);
        }
      })
      .catch((error) => {
        console.error;
      });
  }, []);

  // If empty Learning Journey return empty page

  return (
    <div>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            {/* Actual Content Starts here */}
            {LjVisible && <LearningJourneyCard></LearningJourneyCard>}
            {LjGetstarted && <LearningJourneyBlank></LearningJourneyBlank>}
          </div>
        </div>
      </div>
    </div>
  );
}
