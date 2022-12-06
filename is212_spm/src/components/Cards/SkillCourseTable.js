import React, { useState } from "react";
import useTable from "../hooks/useTable";
import TableFooter from "../Table/TableFooter";

import { CButton } from "@coreui/react";
import PropTypes from "prop-types";
import styles from "../Table/Table.module.css";
import { Link } from "react-router-dom";

const SkillCourseTable = (props) => {
  SkillCourseTable.propTypes = {
    listofSkills: PropTypes.arrayOf(PropTypes.object),
    rowsPerpage: PropTypes.number,
  };
  const [pageNum, setPageNum] = useState(1);
  const { slice, range } = useTable(
    props.listofSkills,
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
            <th className={styles.tableHeader}>Mapping</th>
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
                  <Link
                    to={"/edit_skill_course"}
                    state={{ test: skill }}
                    style={{
                      pointerEvents:
                        skill.skill_status == "Retired" ? "none" : "",
                    }}
                  >
                    <CButton
                      disabled={skill.skill_status == "Retired" ? true : false}
                      color="link"
                    >
                      Edit Relevant Courses
                    </CButton>
                  </Link>
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

export default SkillCourseTable;
