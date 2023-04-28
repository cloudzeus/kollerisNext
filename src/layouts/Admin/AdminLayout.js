import React, {useEffect} from 'react'
import { BigSidebar, AdminNavbar } from 'src/components'
import { Box } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';
import CircularProgress from '@mui/material/CircularProgress';

const AuthWrapper = ({ children }) => {
    const { user } = useSelector(state => state.user)
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }

    }, [])

    return (
        <>
            {!user ? (
                <SpinnerDiv>
                    <CircularProgress />
                </SpinnerDiv>
            ) : (
                <>
                    {children}
                </>
            )}
        </>
    )
}




const AdminLayout = ({ children }) => {
    const smallScreen = useMediaQuery('(max-width:600px)');
    const { isSidebarOpen } = useSelector((store) => store.user)

    return (
        <AuthWrapper>
            <Box sx={{ bgcolor: 'background', minHeight: '100vh', color: 'primary.textMain', }}>
                <AdminNavbar />
                <Box sx={{ width: '100%', display: 'flex', minHeight: '100vh' }}>
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
        </AuthWrapper>
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

const SpinnerDiv = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content:center;
   

`


export default AdminLayout