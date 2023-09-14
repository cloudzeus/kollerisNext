'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toggleSidebar } from '@/features/userSlice';
import SidebarMenu from './PanelMenu';
import { Button } from 'primereact/button';
import Image from 'next/image';
import ProfileButton from '@/components/NavProfileButton';
import BreadCrumbs from './BreadCrumbs';
import { Sidebar } from 'primereact/sidebar';
import NewSidebar from './NewSidebar';

const AdminLayout = ({ children }) => {
	const { isSidebarOpen } = useSelector((store) => store.user)
	const [isScrolled, setScrolled] = useState(false);

	const dispatch = useDispatch()

	const handleToggleSidebar = () => {
		dispatch(toggleSidebar())
	}


	return (
		<Container>
			{/* <SidebarContainer isSidebarOpen={isSidebarOpen}>
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
				<div className='main-div'>
				<SidebarMenu />
				</div>
			</SidebarContainer> */}
			{isSidebarOpen ? <NewSidebar /> : null}
			
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
					{children}
				</MainContent>
			</Content>
		</Container>
	);

}



function FullScreen({ children }) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="card flex justify-content-center" >
			<Sidebar visible={visible} onHide={() => setVisible(false)} fullScreen >
				{children}
			</Sidebar>
			<Button
				style={{width: '35px', height: '35px', fontSize: '12px',  backgroundColor: 'var(--primary-400)', border:'none'}}
				icon="pi pi-window-maximize				"
				aria-label="Maximize"
				onClick={() => setVisible(true)}
				/>
		</div>
	)
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  transition: width 0.3s ease-in-out;
  width: 100%;
`;




const Content = styled.div`
	flex: 1;
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
  width: ${({ isSidebarOpen }) => isSidebarOpen ? 'calc(100% - 270px)' : '100%'};
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
  width: ${({ isSidebarOpen }) => isSidebarOpen ? 'calc(100% - 270px)' : '100%'};
  transition: width 0.3s ease-in-out;
`;





export default AdminLayout