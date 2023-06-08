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
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import GoToTop from './Buttons/GoToTop';
import NotificationsIcon from '@mui/icons-material/Notifications';


const toggleFullscreen = () => {
   console.log('toggleFullscreen')
   const doc = window.document;
   const docEl = doc.documentElement;
   console.log(doc)
   const requestFullscreen =
     docEl.requestFullscreen ||
     docEl.mozRequestFullScreen ||
     docEl.webkitRequestFullScreen ||
     docEl.msRequestFullscreen;
   
   const exitFullscreen =
     doc.exitFullscreen ||
     doc.mozCancelFullScreen ||
     doc.webkitExitFullscreen ||
     doc.msExitFullscreen;
 
   if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
     requestFullscreen.call(docEl);
   } else {
     exitFullscreen.call(doc);
   }
 }




const AdminNavbar = () => {
	const { isSidebarOpen } = useSelector(store => store.user)
	const dispatch = useDispatch();


	const toggle = () => {
		dispatch(toggleSidebar())
	}


	return (
		<Container>
			<div className="burger-div">
				<Burger onClick={toggle} />
				<Image
					src={'/static/imgs/logoDG.png'}
					alt="Picture of the author"
					width={80}
					height={24}
				/>
			</div>
			<div className="right-div">
				<Notifications num="10">
               <NotificationsIcon />
            </Notifications>
				<IconContainer >
					<SettingsIcon />
				</IconContainer>
				<IconContainer onClick={toggleFullscreen} >
					<FullscreenIcon />
				</IconContainer>
				<AvatarSettings />
			</div>

		</Container>

	)
}

export const IconContainer = styled(IconBtn)`
   /* background-color: ${props => props.theme.palette.primary.light60}; */
   background-color: #f9f9f9;
   border-radius: 50%;
   margin-right: 0;
   width:38px;
   height: 38px;
   border: 2px solid#f4f4f4;
   box-shadow: none;
   display: inline-flex;
   svg {
      font-size: 20px;
      color: ${props => props.theme.palette.accent};
   }
`

const Container = styled.div`
   display: flex;
   width: 100%;
   padding: 10px;
   z-index: 99;
   height: 70px;
   position: fixed;
   flex-direction: row;
   /* box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.04);= */
   background-color: white;
   border-bottom: 2px solid ${props => props.theme.palette.background};
   .burger-div {
      display: flex;
      align-items: center;
	  padding: 10px;
      @media (min-width: 1024px) {
         width: 260px;
      }
   }
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
		<IconButton sx={{ width: 40, height: 40, borderRadius: 1, }} onClick={onClick}>
			<MenuIcon color='primary' />
		</IconButton>
	)
}




export default AdminNavbar