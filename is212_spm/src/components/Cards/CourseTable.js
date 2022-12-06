import React, { useState, useEffect } from "react";

import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from "@coreui/react";
import { useNavigate, Link } from "react-router-dom";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from "@coreui/react";
import PropTypes from "prop-types";

export default function CourseTable(props) {
  const navigate = useNavigate();
  CourseTable.propTypes = {
    listOfCourses: PropTypes.arrayOf(PropTypes.object),
    listofSelectedRoles: PropTypes.array,
    isLoading: PropTypes.bool,
    staff_id: PropTypes.string,
  };

  const [visiblePopUp, setVisiblePopUp] = useState(false);
  const [visiblePopUp2, setVisiblePopUp2] = useState(false);
  const [CourseJobRolesSelected, setCourseJobRolesSelected] = useState({
    course_id: 0,
    course_name: "",
    jobrole_id: [],
  });

  const [addedCoursesIDs, setAddedCoursesIDs] = useState([]);
  function refreshPage() {
    window.location.reload(false);
  }
  // Get Staff's ALL added courses from ALL his/her LJs.
  // Runs everytime addedCourses changes
  useEffect(() => {
    // declare the async data fetching function
    // BEST useEffect ASYNC AWAIT EXAMPLE that actually works!
    const fetchLjCourses = async () => {
      // get the data from the api
      const response = await fetch("/get_all_lj_courses/" + props.staff_id)
        .catch((error) => {
          console.log("CourseTable: error caught");
        })
        .then((response) => {
          if (response.ok) {
            return response;
          }
        })
        .catch((error) => {
          console.log("In StepperLJ: error caught");
        });
      // convert the data to json
      const x = await response.json();
      if (x.data.courses) {
        let temp_ids = [];
        for (let each_course of x.data.courses) {
          temp_ids.push(each_course["course_id"]);
        }
        setAddedCoursesIDs(temp_ids);
      }
    };

    fetchLjCourses().catch(console.error);

    // call the function
  }, [props.listOfCourses]);

  function handlePopup(course_id, course_name, lst_selected_jobroles) {
    setVisiblePopUp(true);
    setCourseJobRolesSelected({
      course_id: course_id,
      course_name: course_name,
      jobrole_id: lst_selected_jobroles,
    });
  }

  // Called when User clicks "Yes, Confirm"
  async function handleAdd() {
    const courselj_obj = {
      course_id: CourseJobRolesSelected.course_id,
      jobrole_id: CourseJobRolesSelected.jobrole_id,
    };

    // Handle createJob
    await fetch("/add_lj_courses/" + props.staff_id, {
      method: "POST",
      body: JSON.stringify(courselj_obj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          setVisiblePopUp(false);
          alert("Course successfully added!");
          refreshPage();
        }
      })
      .catch((error) => {
        console.error;
      });

    // setVisiblePopUp2(true)
  }
  if (props.isLoading) {
    return (
      <>
        <CTable responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Course Code</CTableHeaderCell>
              <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">
                Course Description
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
        </CTable>
        <div className="d-flex justify-content-center pb-4">
          <CSpinner color="secondary" />
        </div>
      </>
    );
  }
  return (
    <>
      <CModal visible={visiblePopUp} onClose={() => setVisiblePopUp(false)}>
        <CModalHeader onClose={() => setVisiblePopUp(false)}>
          <CModalTitle>
            Confirm adding course to learning journey(s)?
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you would like to add{" "}
          <b>
            {CourseJobRolesSelected.course_id}:{" "}
            {CourseJobRolesSelected.course_name}{" "}
          </b>
          to your learning journey?{" "}
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
          You will now be redirected to your learning journeys. If not, click
          <Link to="/learning_journey"> here</Link>.
        </CModalBody>
        <CModalFooter></CModalFooter>
      </CModal>
      <CTable responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Course Code</CTableHeaderCell>
            <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Course Description</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {props.listOfCourses?.map((course, index) => (
            <CTableRow className="course_table_row" key={index}>
              <CTableHeaderCell scope="row" className="course_id">
                {course.course_id}
              </CTableHeaderCell>
              <CTableDataCell className="course_name">
                {course.course_name}
              </CTableDataCell>
              <CTableDataCell>{course.course_desc}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  disabled={addedCoursesIDs.includes(course.course_id)}
                  color={
                    addedCoursesIDs.includes(course.course_id)
                      ? "light"
                      : "warning"
                  }
                  // variant={addedCoursesIDs.includes(course.course_id) ? "ghost" : ""}
                  onClick={() =>
                    handlePopup(
                      course.course_id,
                      course.course_name,
                      props.listofSelectedRoles
                    )
                  }
                >
                  {addedCoursesIDs.includes(course.course_id)
                    ? "Already Added"
                    : "Add Course"}
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  );
}
