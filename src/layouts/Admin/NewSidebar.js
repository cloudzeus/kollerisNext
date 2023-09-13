import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
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
    return (
        <ul>

            <SidebarItem icon={"pi-home"} title={'Aρχική'} />
        </ul>
    )
}

const SidebarItem = ({icon}) => {
    return (
        <li className='sidebar-item'>
            <i className={`pi ${icon}`} style={{ fontSize: '1rem' }}></i>
            <span className='text-lg ml-2'>Αρχική</span>
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
        ul {
            width: 90%;
        }
        li {
            list-style: none;
            color: white;
            padding: 10px;
            background-color: black;
            border-radius: 8px;
            span {
                letter-spacing: 1.2px;
            }
        }

    }
    .bottom {
        height: 70px;
    }
`


export default NewSidebar