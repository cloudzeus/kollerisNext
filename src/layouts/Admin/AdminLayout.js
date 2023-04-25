import React from 'react'
import { BigSidebar, AdminNavbar } from 'src/components'
import { Box } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import styled from 'styled-components';


const AdminLayout = ({ children }) => {
  const smallScreen = useMediaQuery('(max-width:600px)');
  const { isSidebarOpen } = useSelector((store) => store.user)

  return (
    <Box sx={{ bgcolor: 'background', minHeight: '100vh', color: 'primary.textMain',  }}>
      <AdminNavbar />
      <Box sx={{ width: '100%',  display: 'flex',  minHeight: '100vh' }}>
        <>
        <BigSidebar />
        {isSidebarOpen ? (
          <SidebarOpenContainer>
              {children}
          </SidebarOpenContainer>
        ) : (
          <SidebarClosedContainer>
            {children}
          </SidebarClosedContainer>
        )}
        </>
      </Box>
     
    </ Box>
  )
}



const SidebarOpenContainer = styled.div`
  position: absolute;
    top: 70px;
    left: 260px;
    width: calc(100% - 260px);;
    padding: 20px;
    overflow-y:scroll;
    min-height:100vh;

   
`
const SidebarClosedContainer = styled.div`
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    padding: 10px;
    overflow-y:scroll;
    min-height:100vh;

`



export default AdminLayout