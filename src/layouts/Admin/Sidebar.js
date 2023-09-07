import React, { useState, useRef, useContext } from "react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { sub } from "date-fns";
import Link from "next/link";



{/* <div className="overflow-y-auto mt-3">
<ul className="list-none py-3 pl-2 pr-0 m-0">
    <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 0 })} onClick={() => handleIconPress(0)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className="pi pi-home text-xl"></i>
            <Ripple />
        </a>
    </li>
    <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 1 })} onClick={() =>handleIconPress(1)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className="pi pi-tags text-xl"></i>
            <Ripple />
        </a>
    </li>
    <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 2 })} onClick={() => handleIconPress(2)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className="pi pi-users text-xl"></i>
            <Ripple />
        </a>
    </li>
    <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 3 })} onClick={() => handleIconPress(3)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className="pi pi-comments text-xl"></i>
            <Ripple />
        </a>
    </li>
    <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 4 })} onClick={() => handleIconPress(4)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className="pi pi-calendar text-xl"></i>
            <Ripple />
        </a>



    </li>
    <li className="mb-2">
        <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 5 })} onClick={() => handleIconPress(5)}
            style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
            <i className="pi pi-cog text-xl"></i>
            <Ripple />
        </a>
    </li>
</ul>
</div> */}


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
   
    const btnRef10 = useRef(null);
    const btnRef11 = useRef(null);

    const [activeTab, setActiveTab] = useState(0);
    const [subActive, setSubActive] = useState(0);

  

    return (
        <SidebarProvider>
            <div className="bg-white h-4rem border-bottom-1 border-200">sefsef</div>
            <div className=" flex relative lg:static surface-ground">

                <div id="app-sidebar" className="h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border w-full md:w-auto">
                    <div className="flex h-full">
                        <div className="flex flex-column h-full bg-indigo-900 flex-shrink-0 select-none">
                            {/* COMPANY LOGO DIV */}
                            <div className="flex align-items-center justify-content-center flex-shrink-0" style={{ height: '60px' }}>
                                <img src="/demo/images/blocks/logos/hyper-light.svg" alt="Image" height="30" />
                            </div>
                            {/* SIDE MENU WITH ICONS */}
                            <IconMenu activeTab={activeTab} setActiveTab={setActiveTab} />
                         

                            <div className="mt-auto">
                                <hr className="mb-3 mx-2 border-top-1 border-none border-indigo-300" />
                                <a className="p-ripple m-3 flex align-items-center cursor-pointer p-2 justify-content-center hover:bg-indigo-600 border-round text-300 hover:text-0
            transition-duration-150 transition-colors">
                                    <img src="/demo/images/blocks/avatars/circle/avatar-f-1.png" style={{ width: '24px', height: '24px' }} alt="avatar-f-1" />
                                    <Ripple />
                                </a>
                            </div>
                        </div>
                        {/* SIDEBAR CONTAINER */}
                            <SidebaContainer>
                                <SidebarList id={1} activeTab={activeTab} title="Προϊόντα">
                                    <SidebarItem goTo="product" subid={1} subActive={subActive} setSubActive={setSubActive} icon="pi-tag" title="Προϊόν"/>
                                    <SidebarItem goTo="product/brands" subid={2} subActive={subActive} setSubActive={setSubActive} icon="pi-tag" title="Μάρκα"/>
                                    <SidebarItem goTo="product/categories" subid={3} subActive={subActive} setSubActive={setSubActive} title="Κατηγορία" />
                                    <SidebarItem goTo="product/categories"subid={4} subActive={subActive} setSubActive={setSubActive} title="Ομάδα" />
                                    <SidebarItem subid={5} subActive={subActive} setSubActive={setSubActive} title="Υποομάδα" />
                                
                                </SidebarList>
                                <SidebarList id={2} activeTab={activeTab} title="Προϊόντα">
                                    <SidebarItem subid={3} subActive={subActive} setSubActive={setSubActive} />
                                    <SidebarItem subid={4} subActive={subActive} setSubActive={setSubActive} />
                                </SidebarList>
                            </SidebaContainer>


                    </div>
                </div>
                <div className="min-h-screen flex flex-column relative flex-auto">
                    <div className="flex justify-content-between lg:justify-content-start align-items-center px-5 surface-section border-bottom-1 surface-border relative lg:static" style={{ height: '60px' }}>
                        <div className="flex">
                            <StyleClass nodeRef={btnRef10} selector="#app-sidebar" enterClassName="hidden" enterActiveClassName="fadeinleft" leaveToClassName="hidden" leaveActiveClassName="fadeoutleft">
                                <a ref={btnRef10} className="p-ripple cursor-pointer block lg:hidden text-700 mr-3">
                                    <i className="pi pi-bars text-4xl"></i>
                                    <Ripple />
                                </a>
                            </StyleClass>
                        </div>
                        <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="30" className="block lg:hidden" />
                        <StyleClass nodeRef={btnRef11} selector="@next" enterClassName="hidden" enterActiveClassName="fadein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick>
                            <a ref={btnRef11} className="p-ripple cursor-pointer block lg:hidden text-700">
                                <i className="pi pi-ellipsis-v text-2xl"></i>
                                <Ripple />
                            </a>
                        </StyleClass>
                        <ul className="list-none p-0 m-0 hidden lg:flex lg:align-items-center select-none lg:flex-row lg:w-full
    surface-section border-1 lg:border-none surface-border right-0 top-100 z-1 shadow-2 lg:shadow-none absolute lg:static">
                            <li>
                                <a className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors">
                                    <i className="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0"></i>
                                    <span className="block lg:hidden font-medium">Inbox</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors">
                                    <i className="pi pi-star text-base lg:text-2xl mr-2 lg:mr-0"></i>
                                    <span className="block lg:hidden font-medium">Favorites</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors">
                                    <i className="pi pi-user text-base lg:text-2xl mr-2 lg:mr-0"></i>
                                    <span className="block lg:hidden font-medium">Account</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors">
                                    <i className="pi pi-bell text-base lg:text-2xl mr-2 lg:mr-0 p-overlay-badge"><Badge severity="danger" /></i>
                                    <span className="block lg:hidden font-medium">Notifications</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li className="border-top-1 surface-border lg:border-top-none lg:ml-auto">
                                <a className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors">
                                    <img src="/demo/images/blocks/avatars/circle/avatar-f-1.png" className="mr-3 lg:mr-0" style={{ width: '32px', height: '32px' }} alt="avatar-f-1" />
                                    <div className="block lg:hidden">
                                        <div className="text-900 font-medium">Josephine Lillard</div>
                                        <span className="text-600 font-medium text-sm">Marketing Specialist</span>
                                    </div>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className=" flex flex-column flex-auto">
                        <div className="">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};



const IconMenu = ({activeTab, setActiveTab}) => {

    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);

    const handleIconPress = (id) => {
        setIsSidebarOpen(true)
        setActiveTab(id);
    }
    return (
        <div className="overflow-y-auto mt-3">
        <ul className="list-none py-3 pl-2 pr-0 m-0">
            <li className="mb-2">
                <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 0 })} onClick={() => handleIconPress(0)}
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    {/*ICON */}
                    <i className="pi pi-home text-xl"></i>
                    <Ripple />
                </a>
            </li>
            <li className="mb-2">
                <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 1 })} onClick={() =>handleIconPress(1)}
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    {/*ICON */}
                    <i className="pi pi-tags text-xl"></i>
                    <Ripple />
                </a>
            </li>
            <li className="mb-2">
                <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 2 })} onClick={() => handleIconPress(2)}
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    <i className="pi pi-users text-xl"></i>
                    <Ripple />
                </a>
            </li>
            <li className="mb-2">
                <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 3 })} onClick={() => handleIconPress(3)}
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    <i className="pi pi-comments text-xl"></i>
                    <Ripple />
                </a>
            </li>
            <li className="mb-2">
                <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 4 })} onClick={() => handleIconPress(4)}
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    <i className="pi pi-calendar text-xl"></i>
                    <Ripple />
                </a>



            </li>
            <li className="mb-2">
                <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab === 5 })} onClick={() => handleIconPress(5)}
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    <i className="pi pi-cog text-xl"></i>
                    <Ripple />
                </a>
            </li>
        </ul>
    </div>
    )
}


const SidebaContainer = ({ children }) => {
    const btnRef9 = useRef(null);
    const fadeout = "fadeoutleft"
    const fadein = "fadeinleft"
    const {isSidebarOpen} = useContext(SidebarContext)
    return (
      <>
        {isSidebarOpen ? (
              <div className={`flex flex-column bg-indigo-500 p-4 overflow-y-auto flex-shrink-0 flex-grow-1 md:flex-grow-0`} style={{ width: '300px' }}>
              <div className="justify-content-end mb-3 flex lg:hidden ">
                  <StyleClass nodeRef={btnRef9} selector="#app-sidebar" leaveToClassName="hidden" leaveActiveClassName="fadeoutleft">
                      <button ref={btnRef9} icon="pi pi-times" className="p-ripple cursor-pointer text-white appearance-none bg-transparent border-none inline-flex justify-content-center align-items-center border-circle hover:bg-indigo-600 transition-duration-150 transition-colors"
                          style={{ width: '2rem', height: '2rem' }}>
                          <i className="pi pi-times text-xl text-indigo-100"></i>
                          <Ripple />
                      </button>
                  </StyleClass>
              </div>
              <div className="border-round flex-auto">
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


export default MultiColumnLayout;
