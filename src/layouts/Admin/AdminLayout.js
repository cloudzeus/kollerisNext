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

	const dispatch = useDispatch()

	const handleToggleSidebar = () => {
		dispatch(toggleSidebar())
	}


	return (
			<MultiColumnLayout>
				<MainContent>
					{children}
				</MainContent>
			</MultiColumnLayout>
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









const MainContent = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.background};
  overflow: auto;
  height: 90vh;
  width: 100%;

  @media (max-width: 768px) {
	width: 100vw;
  }
`;





export default AdminLayout