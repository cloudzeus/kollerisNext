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
      <SidebarItem to="/dashboard" label="Πίνακας Ελέγχου" />
      <SidebarItem to="/dashboard/product/brands" label="Μάρκες" />
      <SidebarItem to="/dashboard/admin/admin-panel-users" label="Χρήστες" />
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      <SidebarExpandableItem label="SpreadSheet" open={open} setOpen={onClick}>
        <SidebarItem to="/dashboard/page2" label="SpreadSheet01" />
        <SidebarItem to="/dashboard/page2" label="SpreadSheet01" />
      </SidebarExpandableItem>
      <SidebarExpandableItem label="Προϊόν" open={open} setOpen={onClick}>
        <SidebarItem to="/dashboard/product/brands" label="Mάρκες" />
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
    padding-top: 20px;
    display: ${props => props.isSidebarOpen ? 'block' : 'none'};
    position: absolute;
    top: 70px;
    background-color: white;
    /* background-color: red; */
    width: 260px;
    z-index: 3;
    height: 100%;
    z-index: 99;
    @media (max-width: 768px) {
        width: 100%;

    }
 
  

`



export default BigSidebar;