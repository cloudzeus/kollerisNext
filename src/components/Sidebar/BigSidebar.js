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
  console.log(theme.palette)

  return (
    <SidebarWrapper>
      <Box mt={3}>
        <SidebarItem to="/dashboard" icon={<DashboardIcon sx={{ color: `${theme.palette.hoverText}`, fontSize: '19px' }} />} label="Dashboard" />
      </Box>
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      <LightHeader>ADMIN LAYOUT PAGES</LightHeader>
      <SidebarItem to="/dashboard" icon={<PersonIcon sx={{ color: `${theme.palette.hoverText}`, fontSize: '19px' }} />} label="Dashboard" />
      <SidebarItem to="/test" icon={<PersonIcon sx={{ color: `${theme.palette.hoverText}`, fontSize: '19px' }} />} label="Test" />
      <SidebarItem to="/chart" icon={<PersonIcon sx={{ color: `${theme.palette.hoverText}`, fontSize: '19px' }} />} label="Chart" />
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


// const StyledIcon = styled(Avatar)`
//   ${({ theme }) => `
//   cursor: pointer;
//   background-color: ${theme.palette.primary.main};
//   transition: ${theme.transitions.create(['background-color', 'transform'], {
//   duration: theme.transitions.duration.standard,
// })};
//   &:hover {
//     background-color: ${theme.palette.secondary.main};
//     transform: scale(1.3);
//   }
//   `}
// `;


const StyledHeader = styled.h4`
  color: ${({ theme }) => theme.palette.text.lightHeader};
  font-weight: 700;
  margin-left: 10px;
  padding-left: 20px;
  margin: 10px 0;
  font-size: 15px;
  letter-spacing: 0.9px;
`;




export default BigSidebar;