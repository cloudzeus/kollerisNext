import React, {useEffect} from 'react';
import { useSelector} from 'react-redux';
import { SidebarItem } from './SidebarTabs';
import styled from 'styled-components';
import LightHeader from '../Text/LightHeader';
import { useState } from 'react';
import { SidebarExpandableItem } from './SidebarTabs';
import { useSession} from "next-auth/react"


const BigSidebar = () => {

  const [open, setOpen] = useState(false);
  const { isSidebarOpen } = useSelector((store) => store.user);
  const {data } = useSession();


  const onClick = () => {
    setOpen(true)
  }
  return (
    <Wrapper isSidebarOpen={isSidebarOpen} >
      <LightHeader>ΜΕΝΟΥ</LightHeader>
      <SidebarItem to="/dashboard" label="Πίνακας Ελέγχου" />
      <SidebarItem to="/dashboard/test" label="Πελάτες" />
      <SidebarItem to="/dashboard/chart" label="Chart" />
      <SidebarItem to="/dashboard/admin/admin-panel-users" label="Χρήστες" />
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      <SidebarExpandableItem label="Accordion" open={open} setOpen={onClick}>
        <SidebarItem to="/dashboard/page1" label="Page1" />
        <SidebarItem to="/dashboard/page2" label="Page2" />
      </SidebarExpandableItem>
      <SidebarExpandableItem label="Accordion2" open={open} setOpen={onClick}>
        <SidebarItem to="/dashboard/page1" label="Page1" />
        <SidebarItem to="/dashboard/page2" label="Page2" />
      </SidebarExpandableItem>
      {data?.user?.role === 'admin' && (
         <SidebarExpandableItem label="Admin Pages" open={open} setOpen={onClick}>
         <SidebarItem to="/dashboard/admin" label="Page1" />
         <SidebarItem to="/dashboard/admin/page" label="Page2" />
       </SidebarExpandableItem>
      )}
    </Wrapper>


  );
};



const Wrapper = styled.div`
    display: ${props => props.isSidebarOpen ? 'block' : 'none'};
    position: absolute;
    top: 70px;
    background-color: white;
    width: 260px;
    z-index: 3;
    padding: 10px;
    height: 100%;
    z-index: 999999;
    @media (max-width: 768px) {
        width: 100%;

    }
 
  

`



export default BigSidebar;