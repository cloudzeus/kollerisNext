import React from 'react'
import SidebarItem from './SidebarItem'
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';

const SidebarTabWithSubMenu = ({items, to}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
 


  return (
    <>
        {/* <SidebarItem to={to} icon={<DashboardIcon color="hoverText" sx={{ color: `${theme.palette.text.darkHover}`, fontSize: '19px' }} />} label={label}/>
        {open ? (
          
        ): null} */}
    </>
  )
}

const SubMenu = styled.div`
  height: 40px;
  background-color: red;
`

export default SidebarTabWithSubMenu