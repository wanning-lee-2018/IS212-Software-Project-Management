import React, { useState, useEffect } from "react";
import {
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";

import HRSidebar from "../../../components/HRSidebar";
import { AppHeader } from "src/components";
import { CButton } from "@coreui/react";

function Mapping() {
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
        <div className="wrapper d-flex flex-column">
          <AppHeader />
          <div className="body flex-grow-1 p-1">
            {/* Actual Content Starts here */}

            <h1 className="pb-3">
              <b>Mapping</b>
            </h1>
            {/* TOP content */}
            <CContainer className="w-100 m-0">
              <CRow>
                <CCol>
                  
                </CCol>
              </CRow>
            </CContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mapping;