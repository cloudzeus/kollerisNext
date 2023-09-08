'use client'
import React, { useState, useRef, useContext } from "react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { sub } from "date-fns";
import Link from "next/link";
import { Avatar } from "primereact/avatar";
import BreadCrumbs from "./BreadCrumbs";
import Image from "next/image";
import ProfileButton from "@/components/NavProfileButton";

import { createContext } from 'react';

const SidebarContext = createContext({
    isSidebarOpen: false,
    setUser: () => { }
});

const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    return (
        <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

const MultiColumnLayout = ({ children }) => {

    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);
    const btnRef11 = useRef(null);

    const [activeTab, setActiveTab] = useState(0);
    const [subActive, setSubActive] = useState(0);



    return (
        <SidebarProvider>
            <div className=" flex relative lg:static surface-ground">
                {/* FULL SIDEBAR CONTENT */}
                <div id="app-sidebar" className=" h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border w-full md:w-auto">
                    <div className="flex h-full">
                        <div className="flex flex-column h-full bg-indigo-900 flex-shrink-0 select-none w-5rem">
                            {/* COMPANY LOGO DIV */}
                            <div className="flex align-items-center justify-content-center flex-shrink-0 relative" style={{ height: '60px' }}>
                                <Image src="/uploads/DGSOFTWhiteIcon.svg" width={30} height={30} />
                            </div>
                            {/* SIDE MENU WITH ICONS */}
                            <IconMenu activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>
                        {/* SIDEBAR CONTAINER */}
                        <SidebaContainer>
                            <SidebarList id={1} activeTab={activeTab} title="Προϊόντα">
                                <SidebarItem goTo="product" subid={1} subActive={subActive} setSubActive={setSubActive} icon="pi-tag" title="Προϊόν" />
                                <SidebarItem goTo="product/brands" subid={2} subActive={subActive} setSubActive={setSubActive} icon="pi-tag" title="Μάρκα" />
                                <SidebarItem goTo="product/mtrcategories" subid={3} subActive={subActive} setSubActive={setSubActive} title="Κατηγορία" />
                                <SidebarItem goTo="product/mtrgroup" subid={4} subActive={subActive} setSubActive={setSubActive} title="Ομάδα" />
                                <SidebarItem goTo="product/mtrsubgroup" subid={5} subActive={subActive} setSubActive={setSubActive} title="Υποομάδα" />
                            </SidebarList>
                            <SidebarList id={2} activeTab={activeTab} title="Πελάτες" >
                                <SidebarItem goTo="clients" subid={6} subActive={subActive} setSubActive={setSubActive} icon="pi-user" title="Πελάτες" />
                                <SidebarItem goTo="users" subid={7} subActive={subActive} setSubActive={setSubActive} icon="pi-user" title="Xρήστες" />
                            </SidebarList>
                            <SidebarList id={3} activeTab={activeTab} title="Προμηθευτές" >
                                <SidebarItem goTo="product/manufacturers" subid={8} subActive={subActive} setSubActive={setSubActive} icon="pi-truck" title="Προμηθευτές" />
                            </SidebarList>
                            <SidebarList id={4} activeTab={activeTab} title="Βοηθητικά Δεδομένα" >
                                <SidebarItem goTo="info/countries" subid={9} subActive={subActive} setSubActive={setSubActive} icon="pi-map" title="Χώρες" />
                                <SidebarItem goTo="info/currencies" subid={10} subActive={subActive} setSubActive={setSubActive} icon="pi-dollar" title="Νομίσματα" />
                                <SidebarItem goTo="info/impas" subid={11} subActive={subActive} setSubActive={setSubActive} icon="pi-tag" title="Impa" />
                                <SidebarItem goTo="info/intrastat" subid={12} subActive={subActive} setSubActive={setSubActive} title="Κωδ. Intrastat" />
                                <SidebarItem goTo="info/units" subid={13} subActive={subActive} setSubActive={setSubActive} title="Μονάδες Μέτρησης" />
                                <SidebarItem goTo="info/vat" subid={14} subActive={subActive} setSubActive={setSubActive} title="ΦΠΑ" />
                            </SidebarList>
                        </SidebaContainer>


                    </div>
                </div>

                <div className="min-h-screen flex flex-column relative flex-auto">
                    {/* TOP BAR */}
                    <div className="flex justify-content-between lg:justify-content-start align-items-center px-5 surface-section border-bottom-1 surface-border relative lg:static" style={{ height: '60px' }}>
                        {/* BURGER */}
                        <div className="flex justify-content-end w-full bg-surface-100">
                            <StyleClass nodeRef={btnRef2} selector="#app-sidebar" enterClassName="hidden" enterActiveClassName="fadeinleft" leaveToClassName="hidden" leaveActiveClassName="fadeoutleft">
                                <a ref={btnRef2} className="p-ripple cursor-pointer block lg:hidden text-700 mr-3">
                                    <i className="pi pi-bars text-4xl"></i>
                                    <Ripple />
                                </a>
                            </StyleClass>
                            <div className="flex justify-content-end w-full bg-surface-100">
                                <ProfileButton />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-2">
                        <BreadCrumbs />
                    </div>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
};



const IconMenu = ({ activeTab, setActiveTab }) => {

    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);

    const handleIconPress = (id) => {
        setIsSidebarOpen(true)
        setActiveTab(id);
    }
    return (
        <div className="overflow-y-auto mt-3">
            <ul className="list-none py-3 pl-2 pr-0 m-0">
                {/* HOME */}
                <LinkButton activeTab={activeTab} id={0} goTo="" icon="pi-home"/>
                {/* PRODUCT */}
                <MenuItem id={1} activeTab={activeTab} setActiveTab={setActiveTab} icon="pi-tags"/>
                <MenuItem id={2} activeTab={activeTab} setActiveTab={setActiveTab} icon="pi-users"/>
                <MenuItem id={3} activeTab={activeTab} setActiveTab={setActiveTab} icon="pi-truck"/>
                <MenuItem id={4} activeTab={activeTab} setActiveTab={setActiveTab} icon="pi-info"/>
                <MenuItem id={5} activeTab={activeTab} setActiveTab={setActiveTab} icon="pi-chart-bar"/>
                <MenuItem id={6} activeTab={activeTab} setActiveTab={setActiveTab} icon="pi-cog"/>
             

            </ul>
        </div>
    )
}


const SidebaContainer = ({ children }) => {
    const btnRef9 = useRef(null);
    
    const { isSidebarOpen, setIsSidebarOpen} = useContext(SidebarContext)

    const hideSidebar = () => {
        setIsSidebarOpen(false)
    }
    return (
        <>
            {isSidebarOpen ? (
                <div className={`flex flex-column bg-indigo-500  overflow-y-auto flex-shrink-0 flex-grow-1 md:flex-grow-0`} style={{ width: '300px' }}>
                    <div className="border-bottom-1 p-4 border-indigo-600 flex justify-content-end cursor-pointer" onClick={hideSidebar}>
                        <i className="pi pi-angle-left text-white"  style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <div className="justify-content-end mb-3 p-2  flex lg:hidden ">
                        <StyleClass nodeRef={btnRef9} selector="#app-sidebar" leaveToClassName="hidden" leaveActiveClassName="fadeoutleft">
                            <button ref={btnRef9} icon="pi pi-times" className="p-ripple cursor-pointer text-white appearance-none bg-transparent border-none inline-flex justify-content-center align-items-center border-circle hover:bg-indigo-600 transition-duration-150 transition-colors"
                                style={{ width: '2rem', height: '2rem' }}>
                                <i className="pi pi-times text-xl text-indigo-100 "></i>
                                <Ripple />
                            </button>
                        </StyleClass>
                    </div>
                    <div className="border-round flex-auto p-4">
                        {children}
                    </div>
                </div>
            ) : null}
        </>
    )
}

const SidebarList = ({ children, id, activeTab, title }) => {

    return (
        <div className={classNames({ 'hidden': activeTab !== id })}>

            <div className="p-3 font-light text-xl text-white mb-1 mt-3">{title}</div>
            <ul className="list-none p-0 m-0 text-white">
                {children}
            </ul>
        </div>
    )
}

const SidebarItem = ({ subid, subActive, setSubActive, icon, title, goTo }) => {
    const condition = subActive === subid ? "bg-indigo-700" : null;
    const { setIsSidebarOpen } = useContext(SidebarContext);

    const onClick = () => {
        setSubActive(subid)
        setIsSidebarOpen(false)
    }
    return (
        <li onClick={onClick} className={`mb-3 flex ${condition} align-items-start p-3`} style={{ borderRadius: '12px' }}>
            <Link className="flex" href={`/dashboard/${goTo}`}>
                <i className={`pi ${icon} text-md mr-3 `}></i>
                <div className="flex flex-column">
                    <span>{title}</span>
                </div>
            </Link>
        </li>
    )
}




const LinkButton = ({goTo, activeTab, id, icon}) => {
    const classes = `p-ripple flex 
    align-items-center cursor-pointer py-3 pl-0 pr-2 
    justify-content-center hover:bg-indigo-600 
    text-indigo-100 hover:text-indigo-50 
    transition-duration-150 transition-colors', 
    { 'bg-indigo-500': ${activeTab} === ${id} }`
    return (
        <li className="mb-2">
            <Link 
                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }} 
                href={`/dashboard/${goTo}`} className={classNames(classes)}>
            <div
                >
                <i className={`pi ${icon} text-xl`}></i>
                <Ripple />
            </div>
            </Link>
          
        </li>
    )
}

const MenuItem = ({icon, activeTab, setActiveTab, id}) => {
    const {setIsSidebarOpen} = useContext(SidebarContext);
    const handleIconPress = (id) => {
        setIsSidebarOpen(true)
        setActiveTab(id);
    }
    return (
        <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === id })} onClick={() => handleIconPress(id)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className={`pi ${icon} text-xl`}></i>
            <Ripple />
        </a>
    </li>
    )
}

export default MultiColumnLayout;
