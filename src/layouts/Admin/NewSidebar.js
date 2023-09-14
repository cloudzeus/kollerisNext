import React, {useState} from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
const NewSidebar = () => {
    return (
        <Container>
            <div className='top'>
                <Image src="/uploads/DGSOFTWhiteIcon.svg" width={30} height={30} alt="dgsoft-logo" />
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
            <SidebarItem icon={"pi-home"} title={'Aρχική'} id={1} setActiveTab={ setActiveTab} activeTab={activeTab}  goTo={'/dashboard'}/>
            <SidebarItem icon={"pi-shopping-cart"} title={'Προίόντα'} id={2} setActiveTab={ setActiveTab} activeTab={activeTab} goTo={'/dashboard/product'} dropdown />
        </ul>
    )
}

const SidebarItem = ({icon, id, setActiveTab, activeTab, title, dropdown, goTo}) => {

    return (
        <li  onClick={() => setActiveTab(id)} className={` sidebar-item ${activeTab == id ? "active" : null}`}>
            <Link href={goTo}>
                <i className={`pi ${icon}`} style={{ fontSize: '1rem' }}></i>
                <span className='text-lg ml-3'>{title}</span>
            </Link>
            {dropdown ? ( <i className={`pi pi-angle-down`} style={{ fontSize: '1rem' }}></i>): null}
        </li>
    )
}





const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 320px;
    background-color: #37404C;
    .top {
        height: 70px;
        background-color: #282E38;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
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
            padding: 15px;
            /* background-color: black; */
            border-radius: 8px;
            margin-bottom: 5px;
            span {
                letter-spacing: 1.2px;
            }
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
`


export default NewSidebar