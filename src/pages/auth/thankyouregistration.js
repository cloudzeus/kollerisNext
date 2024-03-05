'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { BasicContainer } from '@/components/styles'

const ThanksRegister = () => {
        
    return (
        <Container>
            <MessageBoard >
                <div>
                <i className="pi pi-check" ></i>

                </div>
                <div>
                    <h1>Ευχαριστούμε για την εγγραφή σας!</h1>
                    <p>Μόλις εγγριθεί ο λογαριασμός σας θα σας αποσταλεί email</p>
                </div>

            </MessageBoard >
        </Container>
    )
}

export default ThanksRegister



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
        font-size: 18px;
        margin-bottom: 5px;
        margin-right: 20px;
    }
    p {
        font-size: 14px;
    }

`

// const emailBody = (user) => `
// <p>O χρήστης <strong>${user?.firstName} ${user?.lastName}</strong> έχει ζητήσει εγγραφή στον ιστότοπο σας</p> 
// <p>Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την εγγραφή του</p>
// <a href="http://localhost:3000/api/user/change-user-role?id=${user?._id}" target="_blank">Επιβεβαίωση εγγραφής</a>
// `