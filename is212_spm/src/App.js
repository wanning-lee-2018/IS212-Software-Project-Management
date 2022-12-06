import React, { Component, Suspense } from "react";
// import { HashRouter, Route, Routes } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import "./scss/style.scss";


import MapSkillCourse from "./views/pages/_HR_pages/viewSkillCourse";
import EditSkillCourse from "./views/pages/_HR_pages/editSkillCourse";
import AddCourses from "./views/pages/_Staff_pages/addCourses";
import ViewRoles from "./views/pages/_Staff_pages/viewRoles";
import LearningJourney from "./views/pages/_Staff_pages/learningJourney";
import ViewSkills from "./views/pages/_HR_pages/viewSkills";
import CreateSkills from "./views/pages/_HR_pages/createSkills";
import CreateJobs from "./views/pages/_HR_pages/createJobs";
import ViewRolesHR from "./views/pages/_HR_pages/viewRolesHR";
import Mapping from "./views/pages/_HR_pages/mapping";
import EditJobs from "./views/pages/_HR_pages/editJobs";
import EditSkills from './views/pages/_HR_pages/editSkills';


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
// const Register = React.lazy(() => import('./views/pages/register/Register'))

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/add_courses" element={<AddCourses />} />
          <Route path="/view_skills" element={<ViewSkills />} />
          <Route path="/create_skills" element={<CreateSkills />} />
          <Route path="/create_jobs" element={<CreateJobs />} />
          <Route path="/map_skill_course" element={<MapSkillCourse />} />
          <Route
            path="/edit_skill_course"
            element={<EditSkillCourse />}
          />
          <Route path="/edit_job/:id" element={<EditJobs />} />
          <Route path="/learning_journey" element={<LearningJourney />} />
          <Route path="/job_roles" element={<ViewRoles />} />
          <Route path="/job_rolesHR" element={<ViewRolesHR />} />
          <Route path="/mapping" element={<Mapping />} />
          <Route path="/edit_skills/:id" element={<EditSkills/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
