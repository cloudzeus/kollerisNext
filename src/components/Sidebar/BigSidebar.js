import { Container, Box } from '@mui/material';
// import styles from 'styles/Sidebar.module.css'
import styles from '@/styles/Sidebar.module.css'

import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { SidebarItem, SidebarItemNoLink } from './SidebarTabs';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import Divider from '@mui/material/Divider';
import LightHeader from '../Text/LightHeader';
//ICONS:
import { useState } from 'react';
import { SidebarExpandableItem } from './SidebarTabs';


const BigSidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setOpen(true)
  } 
  return (
    <SidebarWrapper>
      <LightHeader>ΜΕΝΟΥ</LightHeader>
      <SidebarItem to="/dashboard"  label="Πίνακας Ελέγχου" />
      <SidebarItem to="/test"  label="Πελάτες" />
      <SidebarItem to="/chart"  label="Chart" />
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      <SidebarExpandableItem label="Accordion" open={open} setOpen={onClick}>
        <SidebarItem to="/fake/page1"  label="Page1" />
        <SidebarItem to="/fake/page2"  label="Page2" />
      </SidebarExpandableItem>
      <SidebarExpandableItem label="Accordion2" open={open} setOpen={onClick}>
        <SidebarItem to="/fake/page1"  label="Page1" />
        <SidebarItem to="/fake/page2"  label="Page2" />
      </SidebarExpandableItem>
     
    </SidebarWrapper>


  );
};






const SidebarWrapper = ({ children }) => {
  const matches = useMediaQuery('(max-width:600px)');
  const { isSidebarOpen } = useSelector((store) => store.user);
  let conditions = matches && isSidebarOpen
  return (
    <Box className={`${conditions ? styles.fullNavbar : null}  ${!isSidebarOpen && styles.none} ${styles.container}`} sx={{ bgcolor: 'white', width: 260, height: 'calc(100% - 70px)', position: 'fixed', top: '70px', zIndex: 10, overflowY: 'auto', }}>
      {children}
    </Box>
  )
}






export default BigSidebar;