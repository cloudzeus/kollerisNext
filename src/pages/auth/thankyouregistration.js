import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Button from '@/components/Buttons/Button'
import { useRouter } from 'next/router'

const thanksRegister = () => {
    const route = useRouter();
    const {user} = useSelector((state) => state.user);
    
  return (
    <Container>
        <div className="messageBoard">
            <h1>Ευχαριστούμε για την εγγραφή σας!</h1>
            <p>Περιμένετε να εγγριθεί η εγγραφή σας από τον διαχειριστή</p>
            <Button>Σύνδεση</Button>
        </div>
    </Container>
  )
}

export default thanksRegister



const Container = styled.div`
    height: 100vh;
    background-color: ${({ theme }) => theme.palette.background};
    display: flex;
    align-items: center;
    justify-content: center;

    .messageBoard {
        background-color: white;

    }
`