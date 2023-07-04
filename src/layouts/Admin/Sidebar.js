
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { toggleSidebar } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
export default function SidebarMain() {
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const {isSidebarOpen} = useSelector((store) => store.user)
    const customIcons = (
        <React.Fragment>
            <button className="p-sidebar-icon p-link mr-2">
                <span className="pi pi-print" />
            </button>
            <button className="p-sidebar-icon p-link mr-2">
                <span className="pi pi-search" />
            </button>
        </React.Fragment>
    );
    
    return (
        <div >
            <Sidebar visible={isSidebarOpen} modal={false   }  onHide={() => dispatch(toggleSidebar(false))} icons={customIcons}>
                <h2>Sidebar</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </Sidebar>
            <Button icon="pi pi-plus" onClick={() => dispatch(toggleSidebar(true)) } />
        </div>
    )
}
        