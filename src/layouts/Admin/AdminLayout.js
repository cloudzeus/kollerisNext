'use client'
import React, { useEffect, useState } from 'react'
import { BigSidebar, AdminNavbar } from 'src/components'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

const AuthWrapper = ({ children }) => {
    const { user } = useSelector(state => state.user)
    const [hydrated, setHydrated] = useState(false)
    const router = useRouter();

    useEffect(() => {
        setHydrated(true)
    }, [])

    if (!hydrated) {
        return null
    }



    return (
        <div>
            {!user ? (
                <div>
                    <SpinnerDiv>
                        <CircularProgress />
                    </SpinnerDiv>
                </div>

            ) : (
                <div>
                    {children}
                </div>
            )}
        </div>
    )
}




const AdminLayout = ({ children }) => {
    const { isSidebarOpen } = useSelector((store) => store.user)

    return (
        <>
            <Container>
            <AdminNavbar />
                <div className="main-box">
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
                </div>
               
            </Container>
        </>
    
    )
}



const Container = styled.div`
   
    .main-box {
        width: 100%;
    }

`

const SidebarOpenContainer = styled.div`
    position: absolute;
    top: 70px;
    left: 260px;
    width: calc(100% - 260px);;
    padding: 40px;
    overflow-y:scroll;
    background-color: ${({ theme }) => theme.palette.background};
    height: calc(100vh - 70px);
`



const SidebarClosedContainer = styled.div`
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    padding: 10px;
    overflow-y:scroll;
    min-height:100vh;
    background-color: ${({ theme }) => theme.palette.background};
    padding: 40px;
    height: calc(100vh - 70px);
`

const SpinnerDiv = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content:center;

`


export default AdminLayout