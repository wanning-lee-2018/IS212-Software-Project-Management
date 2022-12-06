import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import {
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CContainer,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import { array } from "prop-types";
import { cilXCircle } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function EditSkillCourseTable() {
  let location = useLocation();

  const [skill, setSkill] = useState([]);
  const [course_list, setCourse] = useState([]);
  const [viewCourses, setViewCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [haveChanges, setHaveChanges] = useState(false);

  const handleCourseSearchTermChange = (event) => {
    setCourseSearchTerm(event.target.value);
  };

  const onClickCourseHandler = (event) => {
    // check if already selected inserted into selectedSkills array
    setHaveChanges(true);
    // Avoid repeats
    if (
      !selectedCourses.find((course) => course.course_id === event.target.value)
    ) {
      const tempObj = {
        course_id: event.target.value,
        course_name: event.target.label,
        // can only see and select "active" skills anyway
        course_status: "Active",
      };
      setSelectedCourses([...selectedCourses, tempObj]);
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    let course_array = selectedCourses.map((course) => {
      return {
        course_id: course.course_id,
      };
    });
    const course_skill_obj = {
      skill_id: skill.skill_id,
      course_array: course_array,
    };
    const response = await fetch("/create_mapping_skill_courses", {
      method: "POST",
      body: JSON.stringify(course_skill_obj),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          if (response.status == 401) {
            alert("Cannot add same course");
          } else {
            alert(message);
          }
          throw new Error(message);
        } else {
          alert("Courses successfully Linked to Skill");
          window.location.reload();
          return response.json();
        }
      })
      .catch((error) => {
        console.log("create_mapping_skill_courses: error caught");
        setIsLoading(false);
      });
  };

  const removeMapping = async (event) => {
    event.preventDefault();
    const skill_id = skill.skill_id;
    const course_id = event.target.value;
    const response = await fetch(
      "/delete_mapping/" + skill_id + "/" + course_id,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    } else {
      alert("Mapping Deleted!");
      window.location.reload();
      return response.json();
    }
  };

  const onClickRemoveSelectedCourse = (event) => {
    setHaveChanges(true);
    var newArr = [...selectedCourses];
    newArr = newArr.filter((object) => {
      return object.course_id.toString() !== event.target.value;
    });
    setSelectedCourses(newArr);
  };

  useEffect(() => {
    if (location.state.test) {
      setSkill(location.state.test);
    }
  }, [location]);

  useEffect(() => {
    var url = "/skills/" + location.state.test.skill_id;
    let course_id_array = [];
    var courses = [];

    async function GetCourseID() {
      await fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (data) => {
          course_id_array = data.data.skill.course;
          await GetCourses(course_id_array);
          setCourse(courses);
        })
        .catch((error) => {
          console.error;
        });

      courses = courses;
    }

    async function GetCourses(course_id_array) {
      for (var i = 0; i < course_id_array.length; i++) {
        var course_url = "/courses/" + course_id_array[i].course_id;
        await fetch(course_url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            courses.push(data.data.course);
          })
          .catch((error) => {
            console.error;
          });
      }
      return courses;
    }

    GetCourseID();
  }, []);

  useEffect(() => {
    fetch("/courses")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setViewCourses(data.data.courses);
      })
      .catch((error) => {
        console.error;
      });
  }, []);

  return (
    <div>
      <div className="px-4">
        <h1 style={{ color: "#47789e" }}>Edit Course-Skill Mapping</h1>
        <div>
          <CContainer className="Fluid mt-5">
            <CRow className="mt-5">
              <CCol>
                <b>Skill ID: </b>
                {skill?.skill_id}
              </CCol>
            </CRow>
            <CRow className="mt-5">
              <CCol>
                <b>Skill Name: </b> {skill?.skill_name}
              </CCol>
              <CCol>
                <b>Status: </b>
                {" " + skill?.skill_status}
              </CCol>
            </CRow>
            <CForm>
              <CRow className="mt-5">
                <CCol>
                  <b>Course:</b>
                </CCol>
                <CCol></CCol>
              </CRow>

              <CRow className="mt">
                <CCol>
                  <CFormInput
                    className="mt-2"
                    type="text"
                    id="course_search"
                    name="course_search"
                    placeholder="Search for a course"
                    value={courseSearchTerm}
                    onChange={handleCourseSearchTermChange}
                  />
                  <div id="error" style={{ color: "#fa2a31" }}></div>

                  <CFormSelect
                    id="courses_dropdown"
                    size="sm"
                    className="mb-1"
                    aria-label="skilllist"
                    multiple
                    htmlSize={3}
                    hidden={!courseSearchTerm.length > 0}
                  >
                    {viewCourses?.map((course, index) => {
                      // Only show active Courses
                      return course.course_status === "Active" &&
                        course.course_name
                          .toLowerCase()
                          .includes(courseSearchTerm.toLowerCase()) ? (
                        <option
                          key={index}
                          id={course.course_id}
                          value={course.course_id}
                          onClick={onClickCourseHandler}
                          name={course.course_name}
                          label={course.course_name}
                        >
                          {course.course_name}
                        </option>
                      ) : null;
                    })}
                  </CFormSelect>
                  <CButton
                    className="mt-3"
                    id="add_btn"
                    color="primary"
                    shape="rounded-0"
                    onClick={handleAdd}
                  >
                    Add
                  </CButton>
                  <>
                    {/* onClick performs deletion of selectedSkill  */}
                    {selectedCourses?.map((course, index) => (
                      <button
                        key={index}
                        type="button"
                        value={course.course_id}
                        className="btn btn-light  rounded-pill mx-1 mt-3"
                        onClick={onClickRemoveSelectedCourse}
                      >
                        {course.course_name}
                        <CIcon className="ms-1" icon={cilXCircle} size="sm" />
                      </button>
                    ))}
                  </>
                </CCol>
                <CRow className="mt-5">
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">
                          Course ID
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Course Name
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Course Status
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Course Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {course_list?.map((course, index) => (
                        <CTableRow key={course.course_id}>
                          <CTableDataCell>{course.course_id}</CTableDataCell>
                          <CTableDataCell>{course.course_name}</CTableDataCell>
                          <CTableDataCell>
                            {course.course_status.charAt(0).toUpperCase() +
                              course.course_status.slice(1)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              shape="rounded-circle"
                              style={{ color: "white" }}
                              value={course.course_id}
                              onClick={removeMapping}
                            >
                              X
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CRow>
              </CRow>
            </CForm>
          </CContainer>
        </div>
      </div>
    </div>
  );
}
