import React, { useEffect } from "react";
import PropTypes from 'prop-types';

import styles from "./TableFooter.module.css";

const TableFooter = ({ range, setPage, page, slice }) => {
  TableFooter.propTypes = {
    range: PropTypes.any,
    setPage: PropTypes.any,
    page: PropTypes.any,
    slice: PropTypes.any,
  }
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div className={styles.tableFooter}>
      {range.map((el, index) => (
        <button
          key={index}
          className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}
          onClick={() => setPage(el)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

export default TableFooter;