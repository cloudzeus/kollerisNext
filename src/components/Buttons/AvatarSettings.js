import React from 'react'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';

const AvatarSettings = () => {
  const theme = useTheme();
  return (
    <Container onClick={() => console.log('pressed')}>
      <Avatar 
        alt="Remy Sharp" 
        src=''
        sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px',width: 25, height: 25 }}
      />
      <Sett  />
    </Container>
  )
}




const Sett = styled(SettingsIcon)`
  color: ${({ theme }) => theme.palette.secondary.shade100};
  font-size: 20px;
  margin-right: 2px;
`






const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.secondary.light};
  border-radius: 30px;
  padding: 5px;
  min-width: 80px;
  &:hover {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }
`


export default AvatarSettings