import React, {useEffect} from 'react'
import styled from 'styled-components'
import { BasicContainer } from '@/components/styles'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useRouter } from 'next/router'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@/components/Buttons/Button'
import {fetchUser} from '@/features/userSlice'

const AdminEmailConfirmation = () => {

    const router = useRouter()
   
    return (
        <Container>
            <MessageBoard >
                <div>
                    <CheckCircleIcon color="success" />
                    <h1>Oλοκληρώθηκε η Εγγραφή</h1>
                </div>
                <Button 
                 onClick= {() => router.push('/auth/signin')}
                 size='140px' >Σύνδεση </Button>
            </MessageBoard >
        </Container>
    )
}

const Container = styled.div`
    height: 100vh;
    background-color: ${({ theme }) => theme.palette.background};
    display: flex;
    align-items: center;
    justify-content: center;
  
`

const MessageBoard = styled(BasicContainer)`
    padding: 20px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    div:first-child {
        display: flex;
        align-items: center;

    }
    div:first-child h1 {
        margin-left: 10px;
    }
    
    h1 {
        font-size: 18px;
        margin-right: 20px;
    }
    p {
        font-size: 14px;
    }

    button {
    }

`


export default AdminEmailConfirmation