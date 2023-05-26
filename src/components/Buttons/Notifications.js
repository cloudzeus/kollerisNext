import React from 'react'
import styled from 'styled-components'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconBtn } from './Button';

const Notifications = () => {
  return (
    <Container>
        <NotificationsIcon />
    </Container>
  )
}




const Container = styled(IconBtn)`
   /* background-color: ${props => props.theme.palette.primary.light60}; */
   background-color: #f9f9f9;
   border-radius: 50%;
   margin-right: 0;
   width:38px;
   height: 38px;
   border: 2px solid#f4f4f4;
   box-shadow: none;
   position: relative;
   svg {
      font-size: 20px;
      color: ${props => props.theme.palette.accent};
   }
   &:after {
        content: '10';
        position: absolute;
        top: -6px;
        right: -6px;
        background-color: ${({ theme }) => theme.palette.primary.main};
        border-radius: 50%;
        z-index: 4;
        width: 18px;
        height: 18px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
    }
   

`

export default Notifications