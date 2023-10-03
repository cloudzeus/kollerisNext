import React from 'react';
import Image from 'next/image';
import styles from "../../styles/sidebar.module.css";
import SidebarItems from './SidebarItems';


const SidebarMain = () => {
    return (
        <div className={styles.container}>
            <div className={styles.top}>
            <Image src="/uploads/DGSOFTWhiteIcon.svg" width={30} height={30} alt="dgsoft-logo" />
            </div>
            <SidebarItems />
        </div>
    )
}

export default  SidebarMain;

