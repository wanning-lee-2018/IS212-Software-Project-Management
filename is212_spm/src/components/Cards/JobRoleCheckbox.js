import React, { useState } from "react";

import { CFormCheck } from "@coreui/react";
import PropTypes from "prop-types";

export default function JobRoleCheckbox(props) {
  const [tempRoles, setTempRoles] = useState([]);

  JobRoleCheckbox.propTypes = {
    listOfJobRoles: PropTypes.arrayOf(PropTypes.object),
    updateParent: PropTypes.func,
  };

  const handleChange = (e) => {
    // Case 1 : The user checks the box
    if (e.target.checked) {
      setTempRoles([...tempRoles, e.target.value]);
      props.updateParent([...tempRoles, e.target.value]);
    }

    // Case 2  : The user unchecks the box
    else {
      if (tempRoles.length > 1) {
        setTempRoles(tempRoles.filter((x) => x !== e.target.value));
        props.updateParent(tempRoles.filter((x) => x !== e.target.value));
      } else {
        setTempRoles([]);
        props.updateParent([]);
      }
    }
  };

  return (
    <div className="card-body">
      {props.listOfJobRoles?.map((jobrole, index) => (
        <CFormCheck
          className="selectJobRoles"
          key={index}
          id={"flexCheckDefault" + index}
          label={jobrole.jobrole_name}
          value={jobrole.jobrole_id}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}
