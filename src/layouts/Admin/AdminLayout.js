'use client'
import React, { useEffect, useState } from 'react'
import { BigSidebar, AdminNavbar } from 'src/components'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from "next-auth/react"



// const AuthWrapper = ({ children }) => {
//     const { data: session, status } = useSession()
//     useEffect(() => {
//         console.log(session)
//     }, [])

//     if (status !== "authenticated") {
//          return (
//             <>
//                 <p>You cannot access this page!</p>
//             </>
//          )
//       }

//       return <>{children}</>
// }




const AdminLayout = ({children}) => {
    const { isSidebarOpen } = useSelector((store) => store.user)
    return (
            <Container>
                <AdminNavbar />
                <div className="main-box">
                    <BigSidebar />
                    <SidebarContainer isSidebarOpen={isSidebarOpen}>
                        {children}
                    </SidebarContainer>
                </div>
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