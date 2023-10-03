import React, { useState } from 'react'
import BreadCrumbs from './BreadCrumbs';
import SidebarMain from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import styles from "../../styles/sidebar.module.css"

const AdminLayout = ({ children }) => {
	return (
		<div className={styles.fullPageWrapper}>
			 <SidebarMain  />
			 <div className={styles.content}>
				<Navbar />
				{/* <BreadCrumbs /> */}
				<div className={styles.mainContent}>
					{children}
				</div>
			 </div> 
		</div>
	);

}

export default AdminLayout