import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import styled from 'styled-components';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Home() {
    const session = useSession();
    const router = useRouter();
        useEffect(() => {
            if (session.status === "unauthenticated") {
                router.push('/auth/signin');
            }
            if (session.status === "authenticated") {
                router.push('/dashboard/product');
            }
        }, [session, router])
    return (
        <>
            
            <Container>
                <ProgressSpinner  fill="blue"/>
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