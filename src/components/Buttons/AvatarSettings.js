import React, { useState } from 'react'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider'
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { SidebarItemNoLink, SidebarItem  } from '../Sidebar/SidebarTabs';
import LogoutIcon from '@mui/icons-material/Logout';


const AvatarSettings = () => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClick = () => {
    setShow(!show)
  }
  return (
    <>
      <Container onClick={onClick}>
      <Avatar 
        alt="Remy Sharp" 
        src=''
        sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px',width: 25, height: 25 }}
      />
      <SettingsIconStyled  />
    </Container>
    {show && <HiddenDropdown>
      <SidebarItem to="/dashboard" icon={<SettingsIcon color="hoverText" sx={{ color: `${theme.palette.primary.main}`, fontSize: '19px' }} />} label="Ρυθμίσεις" />
      <SidebarItem to="/dashboard" icon={<LogoutIcon color="hoverText" sx={{ color: `${theme.palette.primary.main}`, fontSize: '19px' }} />} label="Aποσύνδεση" />
      
    </HiddenDropdown>}
    </>

  )
}



const HiddenDropdown = styled.div`
  position: absolute;
  right: 15px;
  top: 60px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
`



const SettingsIconStyled = styled(SettingsIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 20px;
  margin-right: 2px;
`


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.primary.light};
  border-radius: 30px;
  padding: 5px;
  min-width: 80px;
  cursor: pointer;
  /* &:hover {
    background-color: ${({ theme }) => theme.palette.primary.main};
  } */
`


export default AvatarSettings