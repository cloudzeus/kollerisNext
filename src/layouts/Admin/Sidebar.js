import React, { useState, useRef } from "react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Tooltip } from "primereact/tooltip";
import BlockViewer from "./BlockViewer";

const MultiColumnLayout = () => {
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);
    const btnRef5 = useRef(null);
    const btnRef6 = useRef(null);
    const btnRef7 = useRef(null);
    const btnRef8 = useRef(null);
    const btnRef9 = useRef(null);
    const btnRef10 = useRef(null);
    const btnRef11 = useRef(null);

    const [activeTab, setActiveTab] = useState(0);
    const [activeTab2, setActiveTab2] = useState(0);

   

const block3 = `
<div className="min-h-screen flex relative lg:static surface-ground">
    <div id="app-sidebar" className="h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border w-full md:w-auto">
        <div className="flex h-full">
            <div className="flex flex-column h-full bg-indigo-900 flex-shrink-0 select-none">
                <div className="flex align-items-center justify-content-center flex-shrink-0" style={{ height: '60px' }}>
                    <img src="/demo/images/blocks/logos/hyper-light.svg" alt="Image" height="30" />
                </div>
                <div className="overflow-y-auto mt-3">
                    <ul className="list-none py-3 pl-2 pr-0 m-0">
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 0 })} onClick={() => setActiveTab2(0)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-home text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 1 })} onClick={() => setActiveTab2(1)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-bookmark text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 2 })} onClick={() => setActiveTab2(2)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-users text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 3 })} onClick={() => setActiveTab2(3)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-comments text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 4 })} onClick={() => setActiveTab2(4)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-calendar text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 5 })} onClick={() => setActiveTab2(5)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-cog text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto">
                    <hr className="mb-3 mx-2 border-top-1 border-none border-indigo-300" />
                    <a className="p-ripple m-3 flex align-items-center cursor-pointer p-2 justify-content-center hover:bg-indigo-600 border-round text-300 hover:text-0
            transition-duration-150 transition-colors">
                        <img src="/demo/images/blocks/avatars/circle/avatar-f-1.png" style={{ width: '24px', height: '24px' }} alt="avatar-f-1"/>
                        <Ripple />
                    </a>
                </div>
            </div>
            <div className="flex flex-column bg-indigo-500 p-4 overflow-y-auto flex-shrink-0 flex-grow-1 md:flex-grow-0" style={{ width: '300px' }}>
                <div className="justify-content-end mb-3 flex lg:hidden">
                    <StyleClass nodeRef={btnRef9} selector="#app-sidebar" leaveToClassName="hidden" leaveActiveClassName="fadeoutleft">
                        <button ref={btnRef9} icon="pi pi-times" className="p-ripple cursor-pointer text-white appearance-none bg-transparent border-none inline-flex justify-content-center align-items-center border-circle hover:bg-indigo-600 transition-duration-150 transition-colors"
                            style={{ width: '2rem', height: '2rem' }}>
                            <i className="pi pi-times text-xl text-indigo-100"></i>
                            <Ripple />
                        </button>
                    </StyleClass>
                </div>
                <div className="border-round flex-auto">
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 0 })}>Dashboard</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 1 })}>Bookmarks</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 2 })}>Team</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 3 })}>Messages</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 4 })}>Calendar</div>
                    <div className={classNames({ 'hidden': activeTab2 !== 5 })}>
                        <div className="p-3 font-medium text-2xl text-white mb-5">Settings</div>
                        <ul className="list-none p-0 m-0 text-white">
                            <li className="mb-3 flex align-items-start bg-indigo-700 p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-user text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Account</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">Accumsan sit amet nulla facilisi morbi tempus iaculis.</p>
                                </div>
                            </li>
                            <li className="mb-3 flex align-items-start p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-inbox text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Inbox</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">Condimentum vitae sapien pellentesque habitant.</p>
                                </div>
                            </li>
                            <li className="mb-3 flex align-items-start p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-credit-card text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Sales</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">Egestas integer eget aliquet nibh praesent tristique.</p>
                                </div>
                            </li>
                            <li className="mb-3 flex align-items-start p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-lock text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Privacy</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">In ante metus dictum at tempor commodo ullamcorper a lacus.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
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
                        <img src="/demo/images/blocks/avatars/circle/avatar-f-1.png" className="mr-3 lg:mr-0" style={{ width: '32px', height: '32px' }} alt="avatar-f-1"/>
                        <div className="block lg:hidden">
                            <div className="text-900 font-medium">Josephine Lillard</div>
                            <span className="text-600 font-medium text-sm">Marketing Specialist</span>
                        </div>
                        <Ripple />
                    </a>
                </li>
            </ul>
        </div>
        <div className="p-5 flex flex-column flex-auto">
            <div className="border-2 border-dashed border-round surface-border surface-section flex-auto">

            </div>
        </div>
    </div>
</div>
    `;

    return (
        <>
           
           
           <div className="min-h-screen flex relative lg:static surface-ground">
    <div id="app-sidebar" className="h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border w-full md:w-auto">
        <div className="flex h-full">
            <div className="flex flex-column h-full bg-indigo-900 flex-shrink-0 select-none">
                <div className="flex align-items-center justify-content-center flex-shrink-0" style={{ height: '60px' }}>
                    <img src="/demo/images/blocks/logos/hyper-light.svg" alt="Image" height="30" />
                </div>
                <div className="overflow-y-auto mt-3">
                    <ul className="list-none py-3 pl-2 pr-0 m-0">
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 0 })} onClick={() => setActiveTab2(0)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-home text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 1 })} onClick={() => setActiveTab2(1)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-bookmark text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 2 })} onClick={() => setActiveTab2(2)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-users text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 3 })} onClick={() => setActiveTab2(3)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-comments text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 4 })} onClick={() => setActiveTab2(4)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-calendar text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={classNames('p-ripple flex align-items-center cursor-pointer py-3 pl-0 pr-2 justify-content-center hover:bg-indigo-600 text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors', { 'bg-indigo-500': activeTab2 === 5 })} onClick={() => setActiveTab2(5)}
                                style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                <i className="pi pi-cog text-xl"></i>
                                <Ripple />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto">
                    <hr className="mb-3 mx-2 border-top-1 border-none border-indigo-300" />
                    <a className="p-ripple m-3 flex align-items-center cursor-pointer p-2 justify-content-center hover:bg-indigo-600 border-round text-300 hover:text-0
            transition-duration-150 transition-colors">
                        <img src="/demo/images/blocks/avatars/circle/avatar-f-1.png" style={{ width: '24px', height: '24px' }} alt="avatar-f-1"/>
                        <Ripple />
                    </a>
                </div>
            </div>
            <div className="flex flex-column bg-indigo-500 p-4 overflow-y-auto flex-shrink-0 flex-grow-1 md:flex-grow-0" style={{ width: '300px' }}>
                <div className="justify-content-end mb-3 flex lg:hidden">
                    <StyleClass nodeRef={btnRef9} selector="#app-sidebar" leaveToClassName="hidden" leaveActiveClassName="fadeoutleft">
                        <button ref={btnRef9} icon="pi pi-times" className="p-ripple cursor-pointer text-white appearance-none bg-transparent border-none inline-flex justify-content-center align-items-center border-circle hover:bg-indigo-600 transition-duration-150 transition-colors"
                            style={{ width: '2rem', height: '2rem' }}>
                            <i className="pi pi-times text-xl text-indigo-100"></i>
                            <Ripple />
                        </button>
                    </StyleClass>
                </div>
                <div className="border-round flex-auto">
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 0 })}>Dashboard</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 1 })}>Bookmarks</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 2 })}>Team</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 3 })}>Messages</div>
                    <div className={classNames('p-3 font-medium text-2xl text-white', { 'hidden': activeTab2 !== 4 })}>Calendar</div>
                    <div className={classNames({ 'hidden': activeTab2 !== 5 })}>
                        <div className="p-3 font-medium text-2xl text-white mb-5">Settings</div>
                        <ul className="list-none p-0 m-0 text-white">
                            <li className="mb-3 flex align-items-start bg-indigo-700 p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-user text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Account</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">Accumsan sit amet nulla facilisi morbi tempus iaculis.</p>
                                </div>
                            </li>
                            <li className="mb-3 flex align-items-start p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-inbox text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Inbox</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">Condimentum vitae sapien pellentesque habitant.</p>
                                </div>
                            </li>
                            <li className="mb-3 flex align-items-start p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-credit-card text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Sales</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">Egestas integer eget aliquet nibh praesent tristique.</p>
                                </div>
                            </li>
                            <li className="mb-3 flex align-items-start p-3" style={{ borderRadius: '12px' }}>
                                <i className="pi pi-lock text-xl mr-3 "></i>
                                <div className="flex flex-column">
                                    <span>Privacy</span>
                                    <p className="mt-2 mb-0 line-height-3 text-indigo-200">In ante metus dictum at tempor commodo ullamcorper a lacus.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
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
                        {/* <Ripple /> */}
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
                {/* <li className="border-top-1 surface-border lg:border-top-none lg:ml-auto">
                    <a className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors">
                        <img src="/demo/images/blocks/avatars/circle/avatar-f-1.png" className="mr-3 lg:mr-0" style={{ width: '32px', height: '32px' }} alt="avatar-f-1"/>
                        <div className="block lg:hidden">
                            <div className="text-900 font-medium">Josephine Lillard</div>
                            <span className="text-600 font-medium text-sm">Marketing Specialist</span>
                        </div>
                        <Ripple />
                    </a>
                </li> */}
            </ul>
        </div>
        <div className="p-5 flex flex-column flex-auto">
            <div className="border-2  border-round surface-border surface-section flex-auto">
                    
            </div>
        </div>
    </div>
</div>
        </>
    );
};




export default MultiColumnLayout;
