import React from 'react'
import { BigSidebar, AdminNavbar } from 'src/components'
import { Box } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';



const AdminLayout = ({ children }) => {
  const smallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ bgcolor: 'background', minHeight: '100vh', color: 'primary.textMain' }}>
      <AdminNavbar />
      <Box sx={{ width: '100%', display: 'flex', height: `calc(100vh - 70px)`, }}>
        {smallScreen ? <SmallScreens children={children} /> : <LargeScreens children={children} />}
      </Box>
    </ Box>
  )
}


const SmallScreens = ({children}) => {
  return (
    <>
      <BigSidebar />
      <Box sx={{ width: '100%', p: '10px', marginTop: '70px' }}>
        {children}
      </Box>
    </>
  )
}


const LargeScreens = ({ children }) => {
  const { isSidebarOpen } = useSelector((store) => store.user)
  console.log(isSidebarOpen)
  return (
    <>
      <BigSidebar />
      <Box sx={{ width: '100%', p: '10px', marginTop: '70px', marginLeft: isSidebarOpen ? '250px' : null }}>
        {children}
      </Box>
    </>
  )
}

export default AdminLayout