
'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, closeSidebar } from '@/features/userSlice';
import { Button } from 'primereact/button';
import ProfileButton from '@/components/NavProfileButton';
import { Sidebar } from 'primereact/sidebar';
import NewSidebar from './NewSidebar';
import BreadCrumbs from './BreadCrumbs';
import styles from '../../styles/layout.module.css'
// EXPORT ADMIN LAYOUT:
const AdminLayout = ({ children }) => {
	const { isSidebarOpen } = useSelector((store) => store.user)
	const dispatch = useDispatch()
	const handleToggleSidebar = () => {
		dispatch(toggleSidebar())
	}

	useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1200) {
                dispatch(closeSidebar());
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]);
	
	return (
		<section className={styles.container}>
			{isSidebarOpen ? <NewSidebar  /> : null}
			<div className={styles.content}>
				<header className={`${styles.nav} ${isSidebarOpen ? styles.nav_open : styles.nav_closed} ` }>
					<div className={styles.top}>
					<Button
						icon="pi pi-bars"
						text aria-label="navburger"
						style={{width: '35px', height: '35px', fontSize: '12px',  backgroundColor: 'var(--surface-50)', border:'none', color: 'var(--primary-400)'}}
						onClick={handleToggleSidebar}
				/>
					<div className={styles.nav_buttons}>
						<FullScreen>
							{children}
						</FullScreen>
						<ProfileButton />
					</div>
					</div>
					<div className={styles.bottom}>
					<BreadCrumbs />
					</div>
					
				</header>
				<section className={`${styles.main_content}`}>
					{children}
				</section>
			</div>
		</section>
	);

}



function FullScreen({ children }) {
	const [visible, setVisible] = useState(false);
	return (
		<div  >
			<Sidebar visible={visible} onHide={() => setVisible(false)} fullScreen >
				{children}
			</Sidebar>
			<button
				className={styles.button}
				
				aria-label="Maximize"
				onClick={() => setVisible(true)}
			>
				<i className="pi pi-window-maximize"></i>
			</button>
		</div>
	)
}

export default AdminLayout