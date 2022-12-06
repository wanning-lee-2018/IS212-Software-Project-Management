import React, { useState, useEffect } from "react";

import useTable from "../hooks/useTable";
import styles from "../Table/Table.module.css";
import TableFooter from "../Table/TableFooter";
import PropTypes from "prop-types";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from "@coreui/react";
// import EditJobs from "src/views/pages/_HR_pages/editJobs";
import { useNavigate } from "react-router-dom";

// { data, rowsPerPage }
const RolesTable = (props) => {
  RolesTable.propTypes = {
    listofRoles: PropTypes.arrayOf(PropTypes.object),
    rowsPerPage: PropTypes.number,
  };

  const [tempListofJobRole, setTempListofJobRole] = useState([]);
  const [selected, setSelected] = useState({
    jobrole_id: "",
    jobrole_name: "",
  });
  const [page, setPage] = useState(1);
  const [visiblePopUp, setVisiblePopUp] = useState(false);
  useEffect(() => {
    if (props.listofRoles) {
      setTempListofJobRole(props.listofRoles);
    }
  }, [props]);

  // Handle Edit of chosen job role
  const navigate = useNavigate();
  const handleEdit = (event) => {
    // Reroute to edit_job with props: specific jobrole_id of role to edit
    navigate("/edit_job/" + event.target.value);
  };

  function setSelect(jobrole_id, jobrole_name) {
    setSelected({
      jobrole_id: jobrole_id,
      jobrole_name: jobrole_name,
    });
  }
  function confirmation(jobrole_id, jobrole_name) {
    setSelect(jobrole_id, jobrole_name);
    setVisiblePopUp(true);
  }
  //delete job role
  async function handleDelete(jobrole_id) {
    const response = await fetch("/delete_jobrole/" + jobrole_id);
    if (!response.ok) {
      // Error has occured
      console.log(`An error has occured: ${response.status}`);
    } else {
      const x = await response.json();

      //  Refreshing Skills fetches
      fetch("/job_roles_all")
        .then((response) => {
          if (response.ok) {
            setVisiblePopUp(false);
            return response.json();
          } else {
            console.log(`An error has occured: ${response.status}`);
          }
        })
        .then((data) => {
          setTempListofJobRole(data.data.jobrole);
          alert("Job Role sucessfully retired!");
        })
        .catch((error) => {
          console.error;
        });
    }
  }

  const { slice, range } = useTable(tempListofJobRole, page, props.rowsPerPage);

  return (
    <>
      {/*  */}
      <CModal visible={visiblePopUp} onClose={() => setVisiblePopUp(false)}>
        <CModalHeader onClose={() => setVisiblePopUp(false)}>
          <CModalTitle>Confirm Deletion of Learning Journey?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Would you like to confirm retire of </p>
          <p>
            Job Role:
            <b> {selected.jobrole_name} ?</b>
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisiblePopUp(false)}>
            No, Cancel
          </CButton>
          <CButton
            id="confirm_btn"
            color="primary"
            onClick={() => handleDelete(selected.jobrole_id)}
          >
            Yes, Confirm
          </CButton>
        </CModalFooter>
      </CModal>
      {/*  */}
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>Role ID</th>
            <th className={styles.tableHeader}>Role Name</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el, index) => (
            <tr className={styles.tableRowItems} key={el.jobrole_id}>
              <td className={styles.tableCell}>{el.jobrole_id}</td>
              <td className={styles.tableCell}>{el.jobrole_name}</td>
              <td className={styles.tableCell}>
                {el.jobrole_status.charAt(0).toUpperCase() +
                  el.jobrole_status.slice(1)}
              </td>
              <td className={styles.tableCell} key={"tablerow" + index}>
                <CButton
                  key={"editbtn" + index}
                  onClick={handleEdit}
                  value={el.jobrole_id}
                  color="info"
                  variant="ghost"
                >
                  Edit Details
                </CButton>
                <span>|</span>
                <CButton
                  color="danger"
                  variant="ghost"
                  onClick={() => confirmation(el.jobrole_id, el.jobrole_name)}
                >
                  Retire Job Role
                </CButton>
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
