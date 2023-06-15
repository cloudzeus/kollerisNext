import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
export default function Home() {
    const session = useSession();
    const router = useRouter();
        useEffect(() => {
            console.log('session in index.js:' + JSON.stringify(session))
            if (session.status === "unauthenticated") {
                router.push('/auth/signin');
            }
            if (session.status === "authenticated") {
                router.push('/dashboard');
            }
        }, [session, router])
    return (
        <>
            
            <Container>
                <CircularProgress color="primary"/>
            </Container>

        </>
    )
}



const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
`