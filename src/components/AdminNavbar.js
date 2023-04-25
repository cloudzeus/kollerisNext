import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import { logoutUser } from 'src/features/user/userSlice';
import { logoutUser, toggleSidebar } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
// import logo from '../../assets/imgs/logo.png'
// import logo from '@public/assets/imgs/logo.png'
import Image from 'next/image'
import Stack from '@mui/material/Stack';
import LogoutButton from './Buttons/LogoutButton';




const userName = "John Smith"




const AdminNavbar = () => {
   const dispatch = useDispatch();
   const toggle = () => {
      dispatch(toggleSidebar())
   }
   return (
      <Stack sx={{ bgcolor: 'white', width: '100%', p: '10px', height: 70, borderBottom: 1, borderColor: 'seperator', position: 'fixed', zIndex: 10 }} direction="row"   >
         <Stack direction="row" alignItems={"center"}>
            <Burger onClick={toggle} />
         </Stack>
         <Stack direction="row" justifyContent="flex-end" alignItems="center" width="100%">
            <LogoutButton userName={userName} />
         </Stack>
      </Stack >
   )
}



const Burger = ({ onClick }) => {
   return (
      <IconButton sx={{ marginRight: '10px', border: 1, width: 40, height: 40, borderColor: 'seperator', borderRadius: 1, }} onClick={onClick}>
         <MenuIcon />
      </IconButton>
   )
}




export default AdminNavbar