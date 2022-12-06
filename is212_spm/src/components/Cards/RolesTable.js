import React, { useState, useEffect } from "react";

import useTable from "../hooks/useTable";
import styles from "../Table/Table.module.css";
import TableFooter from "../Table/TableFooter";
import PropTypes from "prop-types";
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from "@coreui/react";

const RolesTable = (props) => {
  const navigate = useNavigate();

  RolesTable.propTypes = {
    listofRoles: PropTypes.arrayOf(PropTypes.object),
    rowsPerPage: PropTypes.number,
    staff_id: PropTypes.string,
  };

  const [selected, setSelected] = useState({ jobrole_id: 0, jobrole_name: "" });

  // Called when User clicks "Add Role"
  // setSelected keeps track of specific Role(jobrole_id, jobrole_name) user would like to Add
  function handlePopup(jobrole_id, jobrole_name) {
    setVisiblePopUp(true);
    setSelected({ jobrole_id: jobrole_id, jobrole_name: jobrole_name });
  }


  function finalRedirect() {
    setTimeout(() => {
      navigate("/add_courses");
    }, 4000);
  }

  // Called when User clicks "Yes, Confirm"
  async function handleAdd() {
    const jobrole_obj = {
      staff_id: props.staff_id,
      jobrole_id: selected.jobrole_id,
      // Job Role name [string]
      jobrole_name: selected.jobrole_name,
      // Job Role status [string]
    };

    // Handle createJob
    const response = await fetch("http://localhost:5000/add_role_to_LJ", {
      method: "POST",
      body: JSON.stringify(jobrole_obj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).catch((error) => {
      setIsLoading(false);
    });
    setVisiblePopUp(false);
    finalRedirect();
    setVisiblePopUp2(true);
  }

  const [visiblePopUp, setVisiblePopUp] = useState(false);

  const [page, setPage] = useState(1);
  const { slice, range } = useTable(props.listofRoles, page, props.rowsPerPage);

  const [visiblePopUp2, setVisiblePopUp2] = useState(false);

  return (
    <>
      <CModal visible={visiblePopUp} onClose={() => setVisiblePopUp(false)}>
        <CModalHeader onClose={() => setVisiblePopUp(false)}>
          <CModalTitle>Confirm Job Role?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Would you like to confirm {selected.jobrole_name} as your goal role?{" "}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisiblePopUp(false)}>
            No, Cancel
          </CButton>
          <CButton color="primary" onClick={() => handleAdd()}>
            Yes, Confirm
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visiblePopUp2} onClose={() => setVisiblePopUp2(false)}>
        <CModalHeader onClose={() => setVisiblePopUp2(false)}>
          <CModalTitle>Redirection Notice</CModalTitle>
        </CModalHeader>
        <CModalBody>
          You will now be redirected to select your courses. If not, click
          <Link to="/add_courses"> here</Link>.
        </CModalBody>
        <CModalFooter></CModalFooter>
      </CModal>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>Role ID</th>
            <th className={styles.tableHeader}>Role Name</th>
            <th className={styles.tableHeader}>Skills</th>
            <th className={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el, index) => (
            <tr
              className={(styles.tableRowItems, "jobrole_table")}
              key={el.jobrole_id}
            >
              <td className={(styles.tableCell, "jobrole_id")}>
                {el.jobrole_id}
              </td>
              <td className={(styles.tableCell, "jobrole_name")}>
                {el.jobrole_name}
              </td>
              <td className={styles.tableCell}>{el.skills}</td>
              <td className={styles.tableCell}>
                <div className="d-grid gap-2">
                  <CButton
                    key={index}
                    onClick={() => handlePopup(el.jobrole_id, el.jobrole_name)}
                    color="primary"
                  >
                    Add Role
                  </CButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default RolesTable;
