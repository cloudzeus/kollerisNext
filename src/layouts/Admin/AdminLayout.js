'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import AdminNavbar from '@/components/AdminNavbar';
import BigSidebar from '@/components/Sidebar/BigSidebar';
import { useEffect } from 'react';
'use client'
import GoToTop from '@/components/Buttons/GoToTop';

const AdminLayout = ({children}) => {
    const { isSidebarOpen } = useSelector((store) => store.user)
    const [offset, setOffset] = useState(0);
    const [offset2, setOffset2] = useState(0);
    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js
   
  
     
    return (
            <Container>
                <AdminNavbar />
                <div className="main-box">
                    <BigSidebar />
                    <SidebarContainer isSidebarOpen={isSidebarOpen}>
                        {children}
                    </SidebarContainer>
                </div>
                < GoToTop  />
            </Container>
    )
}


const Container = styled.div`
    .main-box {
        width: 100%;

    }
  
`


const SidebarContainer = styled.div`
    position: absolute;
    top: 70px;
    left: ${({ isSidebarOpen }) => isSidebarOpen ? '260px' : '0'};
    width: ${({ isSidebarOpen }) => isSidebarOpen ? 'calc(100% - 260px)' : '100%'};
    padding: 40px;
    overflow-y:scroll;
    background-color: ${({ theme }) => theme.palette.background};
    height: calc(100vh - 70px);
    @media (max-width: 768px) {
        width: 100%;
        left: 0;
    }
`


export default AdminLayout