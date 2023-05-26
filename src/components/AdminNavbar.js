'use client'
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import { logoutUser } from 'src/features/user/userSlice';
import { logoutUser, toggleSidebar } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
// import logo from '../../assets/imgs/logo.png'
import Stack from '@mui/material/Stack';
import AvatarSettings from './Buttons/AvatarSettings';
import Image from 'next/image'
import Notifications from './Buttons/Notifications';
import styled from 'styled-components';
import { IconBtn } from './Buttons/Button';
import SettingsIcon from '@mui/icons-material/Settings';


const AdminNavbar = () => {
   const {isSidebarOpen} = useSelector(store => store.user)
   const dispatch = useDispatch();


   const toggle = () => {
      dispatch(toggleSidebar())
   }

   return (
      <Container>
          
         <Stack direction="row" alignItems={"center"}>
            <Burger onClick={toggle} />
            <Image
               src={'/static/imgs/logoDG.png'}
               alt="Picture of the author"
               width={ 80}
               height={24}
            />

         </Stack>
            <div className="right-div">
               <Notifications />
               <IconContainer >
                  <SettingsIcon />
               </IconContainer>
               <AvatarSettings />
            </div>
         
      </Container>
    
   )
}

const IconContainer = styled(IconBtn)`
   /* background-color: ${props => props.theme.palette.primary.light60}; */
   background-color: #f9f9f9;
   border-radius: 50%;
   margin-right: 0;
   width:38px;
   height: 38px;
   border: 2px solid#f4f4f4;
   box-shadow: none;
   svg {
      font-size: 20px;
      color: ${props => props.theme.palette.accent};
   }
`

const Container = styled.div`
   display: flex;
   width: 100%;
   padding: 10px;
   z-index: 99999;
   height: 70px;
   position: fixed;
   flex-direction: row;
   .right-div {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: flex-end;
   }
   .right-div button {
      margin-left: 10px;
   }

`





const Burger = ({ onClick }) => {
   return (
      <IconButton  sx={{ marginRight: '10px', width: 40, height: 40, borderRadius: 1, }} onClick={onClick}>
         <MenuIcon color='primary' />
      </IconButton>
   )
}




export default AdminNavbar