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
    name: 'HR',
  },
  {
    component: CNavItem,
    name: 'Job Role Management',
    to: '/job_rolesHR',
    icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Skill Management',
    to: '/view_skills',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  
  {
    component: CNavItem,
    name: 'Course-Skill Mapping',
    to: '/map_skill_course',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
