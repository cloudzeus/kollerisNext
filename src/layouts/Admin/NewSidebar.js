import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { toggleSidebar } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
const NewSidebar = () => {
    const dispatch = useDispatch()
    const handleToggleSidebar = () => {
		dispatch(toggleSidebar())
	}
    return (
        <Container>
            <div className='top'>
                <Image src="/uploads/DGSOFTWhiteIcon.svg" width={30} height={30} alt="dgsoft-logo" />
                <i onClick={() => handleToggleSidebar()} className="burger-close pi pi-angle-left" style={{ fontSize: '1.5rem' }}></i>

            </div>
            <div className='main'>
                <SidebarList />
            </div>
            <div className='bottom'></div>
        </Container>
    )
}


const SidebarList = () => {
    const [activeTab, setActiveTab] = useState(0)
    return (
        <ul>
            <SidebarItem icon={"pi-home"} title={'Aρχική'} id={1} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'/dashboard'} />
            {/* PRODUCT */}
            <SidebarHeader icon={"pi-shopping-cart"} title={'Προϊόντα'} id={2} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} dropdown />
            {activeTab == 2 ? (
                <div >
                    <SidebarSubItem title={'Προϊον'} goTo={'/dashboard/product'} />
                    <SidebarSubItem title={'Μάρκες'} goTo={'/dashboard/product/brands'} />
                    <SidebarSubItem title={'Κατασκευαστές'} goTo={'/dashboard/product/manufacturers'} />
                    <SidebarSubItem title={'Κατηγορίες'} goTo={'/dashboard/product/mtrcategories'} />
                    <SidebarSubItem title={'Oμάδες'} goTo={'/dashboard/product/mtrgroup'} />
                    <SidebarSubItem title={'Υποομάδες'} goTo={'/dashboard/product/mtrsubgroup'} />
                </div>
            ) : null}
            <SidebarHeader icon={"pi-shopping-cart"} title={'Τιμοκατάλογοι'} id={7} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} dropdown />
            {activeTab == 7 ? (
                <div >
                    <SidebarSubItem title={'Upload Κατάλογοι'} goTo={'/dashboard/catalogs'} />
                    <SidebarSubItem title={'Αποθηκευμένοι Κατάλογοι'} goTo={'/dashboard/catalogs/saved'} />
                 
                </div>
            ) : null}
            <SidebarItem icon={"pi-user"} title={'Πελάτες'} id={3} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} />
            <SidebarItem icon={"pi-user"} title={'Προμηθευτές'} id={4} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} />
            <SidebarItem icon={"pi-book"} title={'Impas'} id={5} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'/dashboard/info/impas'} />
            <SidebarHeader icon={"pi-shopping-cart"} title={'Βοηθ. Πίνακες'} id={6} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} dropdown />
            {activeTab == 6 ? (
                <div >
                    <SidebarSubItem title={'ΦΠΑ'} goTo={'/dashboard/info/vat'} />
                    <SidebarSubItem title={'Intrastat'} goTo={'/dashboard/info/intrastat'} />
                    <SidebarSubItem title={'Χώρες'} goTo={'/dashboard/info/countries'} />
                    <SidebarSubItem title={'Νόμισμα'} goTo={'/dashboard/info/currencies'} />
                </div>
            ) : null}
        </ul>
    )
}


const SidebarHeader = ({ icon, id, setActiveTab, activeTab, title, dropdown }) => {
    const [activeIcon, setActiveIcon] = useState(false)
    const handleClick = () => {
        setActiveIcon(!activeIcon)
        setActiveTab((prev) => prev == id ? 0 : id)
    }
    return (
        <li onClick={handleClick} className={`sidebar-item ${activeTab == id ? "active" : null}`}>
            <div>
                <i className={`pi ${icon}`} style={{ fontSize: '1rem' }}></i>
                <span className='text-lg ml-3'>{title}</span>
            </div>
            {dropdown ? (<i className={` pi ${!activeIcon ? 'pi-angle-down' : 'pi-angle-up'}`} style={{ fontSize: '1rem' }}></i>) : null}
        </li>
    )
}



const SidebarItem = ({ icon, id, setActiveTab, activeTab, title, goTo }) => {
    const handleClick = () => {
        setActiveTab((prev) => prev == id ? 0 : id)
    }
    return (

        <Link href={goTo}>
            <li onClick={handleClick} className={`sidebar-item ${activeTab == id ? "active" : null}`}>
                <div>
                    <i className={`pi ${icon}`} style={{ fontSize: '1rem' }}></i>
                    <span className='text-lg ml-3'>{title}</span>
                </div>
            </li>
        </Link>

    )
}

const SidebarSubItem = ({ title, goTo }) => {
    return (

        <Link href={goTo}>
            <li className={` sub-item`}>
                <span className='text-lg ml-3'>{title}</span>
            </li>
        </Link>

    )
}








const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 270px;
    background-color: #37404C;
  
    .top {
        height: 70px;
        background-color: #282E38;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;

    }
    .burger-close {
        cursor: pointer;
        display: none;
        color: white;
    }
    .main {
        overflow-y: auto;
        flex: 1;
        display: flex;
        justify-content: center;
        margin-top: 20px;
        ul {
            width: 100%;
            padding: 15px;
            margin: 0;
        }
        li {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            list-style: none;
            color: white;
            /* background-color: black; */
            border-radius: 8px;
            margin-bottom: 5px;
            span {
                letter-spacing: 1.2px;
            }
            
        }

        li.sidebar-item {
            padding: 15px;
           
        }

        li:hover {
            background-color: #262d36;
            transition: background-color 0.2s, color 0.3s; /* This line is responsible for the smooth transition */
        }

        .active {
            background-color: #1a1f25;
            transition: background-color 1s, color 0.3s; /* This line is responsible for the smooth transition */
        }
        .active:hover {
            background-color:#1a1f25 ;
        }
        
    }


    .bottom {
        height: 70px;
    }

    .sub-item {
        margin-left: 12px;
        padding: 12px;
        list-style: none;
        position: relative;
       
    }

    .sub-item:active {
        background-color: #1a1f25;
        transition: background-color 1s, color 0.3s; /* This line is responsible for the smooth transition */
    }

    .sub-item::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 50%;
        border-radius: 50%;
        height: 5px;
        width: 5px;
        background-color: #fff;
    }

    @media (max-width: 1024px) {
        width: 100%;
        .top {
            display: flex;
            justify-content: space-between;
        }

        .burger-close {
            display: block;
        }
        
   }
`


export default NewSidebar