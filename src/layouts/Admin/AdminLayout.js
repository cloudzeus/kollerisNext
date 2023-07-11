'use client'
import { useEffect } from 'react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { BsFileBarGraph } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';
import { SlGraph } from 'react-icons/sl';
import AdminNavbar from '@/components/AdminNavbar';
import BigSidebar from '@/components/Sidebar/BigSidebar';
import { toggleSidebar } from '@/features/userSlice';
import SidebarMenu from './PanelMenu';
import { Button } from 'primereact/button';
import Image from 'next/image';
import ProfileButton from '@/components/NavProfileButton';
import BreadCrumbs from './BreadCrumbs';
// const AdminLayout = ({children}) => {
//     const { isSidebarOpen } = useSelector((store) => store.user)

//     return (
//             <Container>
//                 <AdminNavbar />
//                 <div className="main-box">
//                     <BigSidebar />
//                     <SidebarContainer isSidebarOpen={isSidebarOpen}>
//                         {children}
//                     </SidebarContainer>
//                 </div>

//             </Container>
//     )
// }



const AdminLayout = ({ children }) => {
	const { isSidebarOpen } = useSelector((store) => store.user)
	console.log(isSidebarOpen)
	const [isScrolled, setScrolled] = useState(false);

	const dispatch = useDispatch()

	const handleToggleSidebar = () => {
		dispatch(toggleSidebar())
	}


	return (
		<Container>
			<SidebarContainer isSidebarOpen={isSidebarOpen} style={{}}>
				<div className="top-div">
					{isSidebarOpen ? (
						<Image
							src={'/static/imgs/logoDG.png'}
							alt="Picture of the author"
							width={80}
							height={24}
						/>
					) : (
						<Image
							src={'/static/imgs/dg-small.png'}
							alt="Picture of the author"
							width={50}
							height={50}
						/>
					)}
				</div>
				<div className="main-div">
					<SidebarMenu />
					{/* {isSidebarOpen ? <SidebarContent /> : <IconSidebar />} */}
				</div>
			</SidebarContainer>

			<Content isSidebarOpen={isSidebarOpen} >
				<Navbar isScrolled={isScrolled} isSidebarOpen={isSidebarOpen}>
					<Button 
						icon="pi pi-bars" 
						text aria-label="navburger" 
						style={{width: '35px', height: '35px', fontSize: '12px',  backgroundColor: 'var(--surface-50)', border:'none', color: 'var(--primary-400)'}}
						onClick={handleToggleSidebar} 
						// style={{width: '35px', height: '35px', fontSize: '12px'}} 
					/>
					<div className='navbar-rightdiv'>
						<FullScreen>
							{children}
						</FullScreen>
						<ProfileButton />
					</div>
				</Navbar>
				<MainContent>
					<BreadCrumbs />
					{children}

				</MainContent>
			</Content>
		</Container>
	);

}

import { Sidebar } from 'primereact/sidebar';

function FullScreen({ children }) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="card flex justify-content-center">
			<Sidebar visible={visible} onHide={() => setVisible(false)} fullScreen>
				{children}
			</Sidebar>
			<Button 
				style={{width: '35px', height: '35px', fontSize: '12px',  backgroundColor: 'var(--primary-400)', border:'none'}} 
				icon="pi pi-bookmark" 
				aria-label="Bookmark" 
				onClick={() => setVisible(true)}
				/>
		</div>
	)
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  transition: width 0.3s ease-in-out;
`;



const SidebarContainer = styled.div`
  height: 100vh;
  width: ${({ isSidebarOpen }) => isSidebarOpen ? '250px' : '60px'};
  background-color: white;
  transition: width 0.3s ease-in-out;
  overflow-y: auto;
  /* border-right: 2px solid ${({ theme }) => theme.palette.background}; */
  .top-div {
    height: 67px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.background};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main-div {
    height: calc(100% - 67px);
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.palette.background};
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  height: 70px;
  background-color: #fff;
  color: #fff;
  padding: 10px;
  z-index: 10;
  border-bottom: 4px solid ${({ theme }) => theme.palette.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${({ isSidebarOpen }) => isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)'};
  transition: width 0.3s ease-in-out;
  .navbar-rightdiv {
	display: flex;
	align-items: center;
	div {
		margin-left: 5px;
	}
  }
`;

const MainContent = styled.div`
  padding: 20px;
  margin-top: 60px;
  background-color: ${({ theme }) => theme.palette.background};
`;





export default AdminLayout