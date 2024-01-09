import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { toggleSidebar } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const NewSidebar = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar())
    }
    return (
        <Container>
            <div className='top'>
                <Image src="/uploads/logoPlain.png" width={150} height={35} alt="dgsoft-logo" priority />
                {/* <h1>Kolleris<span className='kolleris'>.</span></h1> */}

                <i onClick={() => handleToggleSidebar()} className="burger-close pi pi-angle-left" style={{ fontSize: '1.5rem', color: 'black' }}></i>

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
            {/* PRODUCTS */}
            <SidebarItem title={'Dahsboard'} goTo={'/dashboard'} logo />
            <SidebarHeader title={'Προϊόντα'} id={1} setActiveTab={setActiveTab} activeTab={activeTab} dropdown />
            {activeTab == 1 ? (
                <div >
                    <SidebarSubItem title={'Προϊον'} goTo={'/dashboard/product'} />
                    <SidebarSubItem title={'Μάρκες'} goTo={'/dashboard/product/brands'} />
                    <SidebarSubItem title={'Κατασκευαστές'} goTo={'/dashboard/product/manufacturers'} />
                    <SidebarSubItem title={'Κατηγορίες'} goTo={'/dashboard/product/mtrcategories'} />
                    <SidebarSubItem title={'Oμάδες'} goTo={'/dashboard/product/mtrgroup'} />
                    <SidebarSubItem title={'Υποομάδες'} goTo={'/dashboard/product/mtrsubgroup'} />
                </div>
            ) : null}


            {/* CLIENTS */}
            <SidebarHeader title={'Πελάτες'} id={3} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} dropdown />
            {activeTab == 3 ? (
                <div >
                    <SidebarSubItem title={'Λίστα πελατών'} goTo={'/dashboard/clients'} />
                    <SidebarSubItem title={'Προσφορές'} goTo={'/dashboard/offer'} />
                    <SidebarSubItem title={'Προσφορές Πολλ. Επιλογών'} goTo={'/dashboard/multi-offer'} />

                </div>
            ) : null}

            <SidebarHeader title={' Προμηθευτές'} id={4} setActiveTab={setActiveTab} activeTab={activeTab} goTo={'#'} dropdown />
            {activeTab == 4 ? (
                <div >
                    <SidebarSubItem title={'Λίστα Προμηθευτών'} goTo={'/dashboard/suppliers'} />
                    <SidebarSubItem title={'Picking'} goTo={'/dashboard/suppliers/picking'} />
                    <SidebarSubItem title={'Λίστα Παραγγελίες (Χωρίς Όριο)'} goTo={'/dashboard/suppliers/picking'} />
                    {/* <SidebarSubItem title={'Όλοι οι κατάλογοι'} goTo={'/dashboard/catalogs/saved'} /> */}


                </div>
            ) : null}
            <SidebarItem title={'Χρήστες'} goTo={'/dashboard/users'} />
            <SidebarItem title={'Impas'} goTo={'/dashboard/info/impas'} />
        </ul>
    )
}


const SidebarHeader = ({ id, setActiveTab, activeTab, title, dropdown }) => {
    const [activeIcon, setActiveIcon] = useState(false)
    const router = useRouter()
    const handleClick = () => {
        setActiveIcon(!activeIcon)
        setActiveTab((prev) => prev == id ? 0 : id)

    }
    return (
        <li onClick={handleClick} className={`sidebar-item ${activeTab == id ? "active" : null}`}>
            <div>
                <span className='ml-3'>{title}</span>
            </div>
            {dropdown ? (<i className={` pi ${!activeIcon ? 'pi-angle-down' : 'pi-angle-up'}`} style={{ fontSize: '1rem' }}></i>) : null}
        </li>
    )
}



const SidebarItem = ({ title, goTo, logo }) => {
    const router = useRouter()
    const handleClick = () => {
        router.push(goTo)
    }

    return (
        <li onClick={handleClick} className={`sidebar-item`}>
            <span className='ml-3'>{title}</span>
        </li>

    )
}
const SidebarSubItem = ({ title, goTo }) => {
    const router = useRouter()

    return (
        <li onClick={() => router.push(goTo)} className={`sub-item`}>
            <span className='ml-3'>{title}</span>
        </li>


    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 240px;
    /* background-color: #37404C; */
    background-color: white;
    border-right: 2px solid #EEF2F6;
  
    .top {
        height: 70px;
        /* background-color:#020202; */
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-bottom: 2px solid #EEF2F6;;
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
        /* margin-top: 20px; */
        ul {
            width: 100%;
            padding: 50px 12px 0px 10px; 
            margin: 0;
            
        }
     
        li {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            list-style: none;
            border-radius: 8px;
            margin-bottom: 5px;
            font-size: 14px;
            span {
                letter-spacing: 0.9;
            }
            
        }

        li.sidebar-item {
            padding: 12px 6px;
            /* background-color: #2d353f; */
            /* background-color: #8183F4; */
            border: 2px solid #EEF2F6;
            color:#090b64;
            font-weight: 400;
            letter-spacing: 0.8px;
            
        }

        li:hover {
            /* background-color: #262d36; */
            background-color: #EEF2F6;
            transition: background-color 0.2s, color 0.3s; /* This line is responsible for the smooth transition */
        }

        .active {
            /* background-color: #1a1f25; */
            background-color: #EEF2F6;
            transition: background-color 1s, color 0.3s; /* This line is responsible for the smooth transition */
        }
        .active:hover {
            /* background-color:#1a1f25 ; */
            background-color: #EEF2F6;
            transition: background-color 1s, color 0.3s; /* This line is responsible for the smooth transition */
        }
        
    }


    .bottom {
        height: 70px;
    }

    .sub-item {
        padding: 12px;
        list-style: none;
        position: relative;
        /* background-color: #252b33; */
        background-color:#e4eaf1;
        color:#090b64;
        min-height: 45px;
        line-height: 1.4;
       
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



export default NewSidebar;