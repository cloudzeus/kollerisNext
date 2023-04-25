import React from 'react'
import SidebarItem from './SidebarItem'
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';

const SidebarTabWithSubMenu = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <SidebarItem>
        <SidebarItem to="/dashboard" icon={<DashboardIcon color="hoverText" sx={{ color: `${theme.palette.text.darkHover}`, fontSize: '19px' }} />} label="Πίνακας Ελέγχου" />
      </SidebarItem>
    </>
  )
}

export default SidebarTabWithSubMenu