'use client'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { BasicContainer } from '@/components/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const thanksRegister = () => {
    const { user } = useSelector((state) => state.user);


        const handleApi = async () => {
        const res = fetch('/api/user/userVerificationViaEmail', {
            method: 'POST',
            body: JSON.stringify(emailBody(user)),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }


    useEffect(() => {
        if(user !== null) {
            handleApi(emailBody);
        }
    }, [user])

    return (
        <Container>
            <MessageBoard >
                <div>
                    <CheckCircleIcon color="success" />
                </div>
                <div>
                    <h1>Ευχαριστούμε για την εγγραφή σας!</h1>
                    <p>Ελέγξε το email σας </p>
                </div>

            </MessageBoard >
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
  


  
`


const MessageBoard = styled(BasicContainer)`
    padding: 20px;
    display: grid;
    grid-template-columns: 25px 1fr;
    grid-gap: 10px;

    
    h1 {
        font-size: 20px;
        margin-bottom: 10px;
    }
    p {
        font-size: 14px;
    }

`

const emailBody = (user) => `
<p>O χρήστης <strong>${user?.firstName} ${user?.lastName}</strong> έχει ζητήσει εγγραφή στον ιστότοπο σας</p> 
<p>Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την εγγραφή του</p>
<a href="http://localhost:3000/api/user/change-user-role?id=${user?._id}" target="_blank">Επιβεβαίωση εγγραφής</a>
`