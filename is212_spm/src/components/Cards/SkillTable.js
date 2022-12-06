import React, { useState, useEffect } from "react";
import useTable from "../hooks/useTable";
import TableFooter from "../Table/TableFooter";
import {
  useParams,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

import { CButton } from "@coreui/react";
import PropTypes from "prop-types";
import styles from "../Table/Table.module.css";

const SkillTable = (props) => {
  const [tempListofSkills, setTempListofSkills] = useState([]);

  useEffect(() => {
    if (props.listofSkills) {
      setTempListofSkills(props.listofSkills);
    }
  }, [props]);

  SkillTable.propTypes = {
    listofSkills: PropTypes.arrayOf(PropTypes.object),
    rowsPerpage: PropTypes.number,
  };
  const [pageNum, setPageNum] = useState(1);

  const [selected, setSelected] = useState({ skill_id: "" });
  const navigate = useNavigate();

  // Called when User clicks "Yes, Confirm"
  async function handleDelete(skill_id) {
    const response = await fetch("/delete_skill/" + skill_id);
    if (!response.ok) {
      // Error has occured
      console.log(`An error has occured: ${response.status}`);
    } else {
      const x = await response.json();

      //  Refreshing Skills fetches
      fetch("/skills")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setTempListofSkills(data.data.skill);
          alert("Skill sucessfully retired!");
        })
        .catch((error) => {
          console.error;
        });
    }
  }

  function editSkills(skill_id) {
    navigate("/edit_skills/" + skill_id);
  }

  const { slice, range } = useTable(
    tempListofSkills,
    pageNum,
    props.rowsPerpage
  );

  return (
    <div>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>Skill ID</th>
            <th className={styles.tableHeader}>Skill Name</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((skill, i) => (
            <tr className={styles.tableRowItems} key={skill.skill_id}>
              <td className={styles.tableCell}>{skill.skill_id}</td>
              <td className={styles.tableCell}>{skill.skill_name}</td>
              <td className={styles.tableCell}>
                {skill.skill_status.charAt(0).toUpperCase() +
                  skill.skill_status.slice(1)}
              </td>
              <td className={styles.tableCell}>
                <div>
                  {/* <CButton color="dark" variant="ghost">
              View Details
            </CButton>
            <span>|</span> */}
                  <CButton
                    color="info"
                    variant="ghost"
                    onClick={() => editSkills(skill.skill_id)}
                  >
                    Edit Details
                  </CButton>
                  <span>|</span>
                  <CButton
                    color="danger"
                    variant="ghost"
                    onClick={() => handleDelete(skill.skill_id)}
                  >
                    Retire Skill
                  </CButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter
        range={range}
        slice={slice}
        setPage={setPageNum}
        page={pageNum}
      />
    </div>
  );
};

export default SkillTable;
