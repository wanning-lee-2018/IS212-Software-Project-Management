import React, { useState, useEffect } from "react";
import {
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CButton,
} from "@coreui/react";
import PropTypes from "prop-types";

export default function SkillCheckbox(props) {
  SkillCheckbox.propTypes = {
    listOfSkills: PropTypes.arrayOf(PropTypes.object),
    updateParent: PropTypes.func,
    updateLoading: PropTypes.func,
  };

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [applyButtonOn, setApplyButtonOn] = useState(false);
  useEffect(() => {
    // // when new list of skill appears (which also means user selects new JobROle). Reset SelectedSkills list
    setSelectedSkills([]);
  }, [props.listOfSkills]);

  useEffect(() => {
    // Toggle apply filter button ON when user checks at least ONE skill
    if (selectedSkills.length > 0) {
      setApplyButtonOn(true);
    } else {
      setApplyButtonOn(false);
    }
  }, [selectedSkills]);

  const handleChange = (e) => {
    // Case 1 : The user checks the box
    if (e.target.checked && !selectedSkills.includes(e.target.value)) {
      setSelectedSkills([...selectedSkills, e.target.value]);
    }
    // Case 2  : The user unchecks the box
    else {
      setSelectedSkills(selectedSkills.filter((x) => x !== e.target.value));
    }
  };

  // USE THIS FUNCTION FOR FILTERING INSTEAD: Takes into account selectedSkills when showing courses
  const handleGetCoursesforSelectedSkills = () => {
    props.updateLoading(true);

    // Retrieve all courses related to specific skills[stored in list] in selectecSkills state
    var temp_str = selectedSkills.sort().join();
    if (temp_str !== "") {
      fetch("/get_courses_for_skills/" + JSON.stringify(temp_str))
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          props.updateParent(data.data.courses);
          props.updateLoading(false);
        })
        .catch((error) => {
          console.log("In SkillCheckbox: error caught");
        });
    } else {
      props.updateParent([]);
      props.updateLoading(false);
    }
    setApplyButtonOn(false);
  };

  return (
    <>
      <CDropdown autoClose="outside" id="skill_filter_dropdown">
        <CDropdownToggle id="skill_filter_button" color="white">
          Select Skill(s)
        </CDropdownToggle>
        <CDropdownMenu className="pb-0 mx-auto">
          {props.listOfSkills
            ?.sort((x, y) =>
              x.skill_name.toLowerCase() > y.skill_name.toLowerCase() ? 1 : -1
            )
            .map((skill) => (
              <CDropdownItem className="skills_to_filter" key={skill.skill_id}>
                {selectedSkills.includes(skill.skill_id)}
                <CFormCheck
                  className={
                    skill.completion_status ? "text-secondary" : "text-primary"
                  }
                  key={skill.skill_id}
                  id={"skillcheckbox" + skill.skill_id}
                  label={
                    skill.completion_status
                      ? skill.skill_name + " - completed"
                      : skill.skill_name
                  }
                  value={skill.skill_id}
                  defaultChecked={
                    selectedSkills.includes(skill.skill_id.toString())
                      ? true
                      : false
                  }
                  onChange={handleChange}
                />
              </CDropdownItem>
            ))}
          <CButton
            className="w-100 mt-2 mx-auto"
            type="submit"
            style={{
              "--cui-btn-color": "white",
              "--cui-btn-bg": "#245389",
              "--cui-btn-hover-bg": "#183a61",
              "--cui-btn-focus-box-shadow": "#245389",
              "--cui-btn-border-color": "#245389",
              "--cui-btn-hover-border-color": "#183a61",
            }}
            disabled={!applyButtonOn}
            color={!applyButtonOn ? "light" : "warning"}
            onClick={handleGetCoursesforSelectedSkills}
          >
            <b>Apply Filters</b>
          </CButton>
        </CDropdownMenu>
      </CDropdown>
    </>
  );
}
