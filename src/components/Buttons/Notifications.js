import React from 'react'
import styled from 'styled-components'
import { IconBtn } from './Button';


 const Notifications = ({children, onClick, num, ml}) => {
  return (
    <NotificationContainer onClick={onClick}  data-count={num}>
         {children}
    </NotificationContainer>
  )
}






export const NotificationContainer = styled(IconBtn)`
   /* background-color: ${props => props.theme.palette.primary.light60}; */
   margin-left: ${props => props.ml ? props.ml : '0px'} ;
   background-color: #f9f9f9;
   border-radius: 50%;
   margin-right: 0;
   width:38px;
   height: 38px;
   border: 2px solid#f4f4f4;
   box-shadow: none;
   position: relative;
   display: inline-flex;
   svg {
      font-size: 20px;
      color: ${props => props.theme.palette.accent};
   }

   &:after {
        content: attr(data-count);
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