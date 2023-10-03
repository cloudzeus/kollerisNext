'use client';
import React from 'react';
import Image from 'next/image';
import styles from "../../styles/sidebar.module.css";
import SidebarItems from './SidebarItems';
import { useSelector } from 'react-redux';

const SidebarMain = () => {
    const { isSidebarOpen } = useSelector(state => state.user)

    return (
       <>
        {isSidebarOpen ? ( <div className={styles.container}>
            <div className={styles.top}>
            <Image src="/uploads/DGSOFTWhiteIcon.svg" width={30} height={30} alt="dgsoft-logo" />
            </div>
            <SidebarItems />
        </div>) : null}
       </>
    )
}

export default  SidebarMain;

