import React, {useRef} from 'react'; 
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import styled from 'styled-components';
import { Router } from 'next/router';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { logoutUser } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';


export default function ProfileButton() {
    const toast = useRef(null);
    const menuLeft = useRef(null);
    const menuRight = useRef(null);
    const route = useRouter();
    const dispatch = useDispatch();
    const { data: session, status } =  useSession()
    let user = session?.user?.user;
    let items = [
        { 
          
            template: (item, options) => {
                return (
                    <Link href="/dashboard/profile">
                    <PopupTopBar className={classNames(options.className, 'w-full p-link flex align-items-center')}>
                        <Avatar 
                            aria-controls="popup_menu_left"  
                            icon="pi pi-user" 
                            size="small" 
                            onClick={(event) => menuLeft.current.toggle(event)} 
                            style={{ backgroundColor: 'primary', color: '#ffffff', fontSize: '1rem' }} 
                            shape="circle"
                            />
                        <div className='name-div'>
                            <span className="font-bold">{user?.lastName}</span>
                            <span className="text-sm">{user?.role}</span>
                        </div>
                    </PopupTopBar>
                 </Link>
                   
                )
        }},
        // { label: 'Προφίλ', icon: 'pi pi-fw pi-user' },
        { separator: true},
        {      
            command: () => {
                console.log('click')
                signOut({
                    redirect: false
                })
        
                route.push('/auth/signin')
                dispatch(logoutUser())
            },
            label: 'Αποσύνδεση', 
            icon: 'pi pi-fw pi-power-off', }
       
    ];

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Avatar  
                aria-controls="popup_menu_left"  
                icon="pi pi-user" 
                onClick={(event) => menuLeft.current.toggle(event)} 
                style={{width: '35px', height: '35px', fontSize: '12px',  backgroundColor: 'var(--primary-400)', border:'none'}} 
                
                />
            <Menu 
                model={items} 
                popup 
                style={{marginTop: '2rem'}}
                ref={menuLeft}
                autoZIndex
                />
        </div>
    )
}


const Container = styled.div`

`

const PopupTopBar  = styled.button`
    display: flex;
    align-items: center;
    width: 100%;
    .name-div {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        justify-content: center;
    }
    .name-div span:first-child {

    }
    .name-div span:last-child {
        font-size: 0.7rem;
        font-style: italic;
    }
`