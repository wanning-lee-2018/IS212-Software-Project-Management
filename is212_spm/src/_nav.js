import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDiamond,
  cilEducation,
  cilPencil,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: "Staff",
  },
  {
    component: CNavItem,
    name: "Learning Journey",
    to: "/learning_journey",
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: "View Roles",
    to: "/job_roles",
    icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Add Courses",
    to: "/add_courses",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  }
];

export default _nav
