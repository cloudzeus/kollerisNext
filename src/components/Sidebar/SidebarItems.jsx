'use client';
import React, { useState } from 'react'
import styles from "../../styles/sidebar.module.css";
import Link from 'next/link';


const SidebarItems = () => {
    const [state, setState] = useState({
        products: false,
        something: false,
    })
    const handleProduct = () => {setState({ ...state, products: !state.products })}

    return (
        <div className={styles.mainSidebar}>
            <Item title="Αρχική" goTo="/dashboard" />
            <Expandable  onClick={handleProduct} title="Προϊντα"/>
            {state.products ? (
                <>
                    <SubItem title="Προϊον" goTo={"/dashboard/product"} />
                    <SubItem title="Μάρκες" goTo={'/dashboard/brands'} />
                </>
            ) : null}
        </div>
    )
}


const Item = ({ goTo, title }) => {
    return (
        <div className={styles.item}>
            <Link className='w-full h-full text-white block flex align-items-center p-4' href={goTo} shallow>{title}</Link>
        </div>
    )
}
const SubItem = ({ goTo, title }) => {
    return (
        <div className={styles.subItem}>
            <Link className='w-full h-full text-white block flex align-items-center p-4' href={goTo} shallow>{title}</Link>
        </div>
    )
}


const Expandable = ({ state, setState, header, onClick, title }) => {
    return (
        <span className={styles.expandable} onClick={onClick} title={title}>
            {title}
            <i className={`pi pi-angle-down`} style={{ fontSize: '1rem' }}></i>
        </span>
    )
}

export default SidebarItems