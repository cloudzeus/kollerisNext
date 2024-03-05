'use client'
import React from 'react'
import { Button } from 'primereact/button'
import styles from "../styles/sidebar.module.css"
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '@/features/userSlice'
const Navbar = () => {
    const dispatch = useDispatch()
    const { isSidebarOpen } = useSelector(state => state.user)

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar())
    }
    return (
        <nav className={`${styles.navbar} ${!isSidebarOpen ? styles.navOpen : styles.navClosed}`}>
            <Button
                icon="pi pi-bars"
                text aria-label="navburger"
                style={{ width: '35px', height: '35px', fontSize: '12px', backgroundColor: 'var(--surface-50)', border: 'none', color: 'var(--primary-400)' }}
                onClick={handleToggleSidebar}
            />
        </nav>
    )
}

export default Navbar