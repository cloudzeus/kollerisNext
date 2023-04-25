import { Container, Box } from '@mui/material';
// import styles from 'styles/Sidebar.module.css'
import styles from '@/styles/Sidebar.module.css'

import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { SidebarItem } from './SidebarTabs';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import Divider from '@mui/material/Divider';
import LightHeader from '../Text/LightHeader';
//ICONS:
import DashboardIcon from '@mui/icons-material/Dashboard';





const BigSidebar = () => {
  const theme = useTheme();

  return (
    <SidebarWrapper>
        <LightHeader>Μενού</LightHeader>
      <SidebarItem to="/dashboard" icon={<DashboardIcon color="hoverText" sx={{ color: `${theme.palette.text.darkHover}`, fontSize: '19px' }} />} label="Πίνακας Ελέγχου" />
      <SidebarItem to="/test" icon={<PersonIcon color="secondary" sx={{color: `${theme.palette.text.darkHover}`,  fontSize: '19px' }} />} label="Πελάτες" />
      <SidebarItem to="/chart" icon={<PersonIcon sx={{ color: `${theme.palette.text.darkHover}`, fontSize: '19px' }} />} label="Chart" />
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
    </SidebarWrapper>


  );
};



const SidebarWrapper = ({ children }) => {
  const matches = useMediaQuery('(max-width:600px)');
  const { isSidebarOpen } = useSelector((store) => store.user);
  let conditions = matches && isSidebarOpen
  return (
    <Box className={`${conditions ? styles.fullNavbar : null}  ${!isSidebarOpen && styles.none} ${styles.container}`} sx={{ bgcolor: 'white', width: 260, height: 'calc(100% - 70px)', position: 'fixed', top: '70px', zIndex: 10, overflowY: 'scroll' }}>
      {children}
    </Box>
  )
}






export default BigSidebar;