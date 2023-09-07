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
import MultiColumnLayout from './Sidebar';

const AdminLayout = ({ children }) => {
	const { isSidebarOpen } = useSelector((store) => store.user)
	const [isScrolled, setScrolled] = useState(false);

	const dispatch = useDispatch()

	const handleToggleSidebar = () => {
		dispatch(toggleSidebar())
	}


	return (
		<Container>
			
			<MultiColumnLayout>
			<Content isSidebarOpen={isSidebarOpen} >
				<MainContent>
					{children}
				</MainContent>
			</Content>	
			</MultiColumnLayout>
			{/* <Content isSidebarOpen={isSidebarOpen} >
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
			</Content> */}
		</Container>
	);

}

import { Sidebar } from 'primereact/sidebar';

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

  transition: width 0.3s ease-in-out;
`;



const SidebarContainer = styled.div`
  height: 100vh;
  min-width: ${({ isSidebarOpen }) => isSidebarOpen ? '250px' : '60px'};
  background-color: white;
  overflow-y: auto;
  /* transition: all 0.3s ease-in; */


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
  /* flex-grow: 1; */
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
  overflow-y: auto;
  /* background-color: ${({ theme }) => theme.palette.background}; */
`;



const MainContent = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.background};
`;





export default AdminLayout