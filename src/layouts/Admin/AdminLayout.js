'use client'
import { useEffect } from 'react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { BsFileBarGraph } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';
import { SlGraph } from 'react-icons/sl';
import AdminNavbar from '@/components/AdminNavbar';
import BigSidebar from '@/components/Sidebar/BigSidebar';
import { toggleSidebar } from '@/features/userSlice';
import SidebarMenu from './PanelMenu';
// const AdminLayout = ({children}) => {
//     const { isSidebarOpen } = useSelector((store) => store.user)
   
//     return (
//             <Container>
//                 <AdminNavbar />
//                 <div className="main-box">
//                     <BigSidebar />
//                     <SidebarContainer isSidebarOpen={isSidebarOpen}>
//                         {children}
//                     </SidebarContainer>
//                 </div>
              
//             </Container>
//     )
// }


    
const AdminLayout = ({children}) => {
    const { isSidebarOpen } = useSelector((store) => store.user)
    console.log(isSidebarOpen)
    const [isScrolled, setScrolled] = useState(false);

    const dispatch = useDispatch()

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar())
    }

    
    return (
        <Container>
        <Sidebar isSidebarOpen={isSidebarOpen} style={{  }}>
            <div className="top-div">
                <p>logo</p>
            </div>
            <div className="main-div">
                <SidebarMenu />
            {/* {isSidebarOpen ? <SidebarContent /> : <IconSidebar />} */}
            </div>
        </Sidebar>

        <Content>
          <Navbar isScrolled={isScrolled}>
            <BurgerButton onClick={handleToggleSidebar}>
              button
            </BurgerButton>
          </Navbar>
          <MainContent>
            {children}
          </MainContent>
        </Content>
      </Container>
    );
    
}

const IconSidebar = () => {
    return (
        <>
            <AiOutlineOrderedList />
            <BsFileBarGraph />
            <MdDashboard />
            <SlGraph />
        </>
    )
}

const SidebarContent = () => {
    return (
        <>
            <p>content</p>
        </>
    )
}

const IconSidebarContainer = styled.div`

`
const SidebarContentContainer = styled.div`

`

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const IconNavbar = styled.div`
    width: 40px;
    background-color: white;
`

const Sidebar = styled.div`
  height: 100%;
  width: ${({ isSidebarOpen }) => isSidebarOpen ? '250px' : '60px'};
  background-color: white;
  transition: width 0.3s ease-in-out;
  overflow-y: auto;
  border-right: 2px solid ${({ theme }) => theme.palette.background};
  .top-div {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main-div {
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  color: #fff;
  padding: 10px;
  z-index: 99999;
    border-bottom: 4px solid ${({ theme }) => theme.palette.background};
`;

const MainContent = styled.div`
  padding: 20px;
  margin-top: 60px;
  background-color: ${({ theme }) => theme.palette.background};
`;

const BurgerButton = styled.button`
 
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
`;




export default AdminLayout