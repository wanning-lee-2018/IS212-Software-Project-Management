import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CContainer,CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import { logoNegative } from 'src/assets/brand/logo-negative'
// import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      // unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
           <CContainer fluid>
          {/*<CNavbarBrand href="#"> */}
            <CImage
              src="../../printing-machine.png"
              alt=""
              width="80"
              height="80"
              align="center"
              className='mt-3 mb-2'
            />{' '}
            <p className="text-warning fs-4 fw-semibold row justify-content-md-center"> All-In-One Printing</p>
            
          {/* </CNavbarBrand> */}
        </CContainer> 
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
