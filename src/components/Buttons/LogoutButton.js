import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Para from '../Text/Para';

const LogoutButton= ({ userName }) => {

  const theme = useTheme()
  return (
     <LogoutWrapper onClick={() => console.log('works')}>
        <PersonIcon sx={{ color: `${theme.palette.primary.light}`, fontSize: '19px', marginRight: '5px' }} />
        <Stack direction="row" justifyContent="center" alignItems="center">
           <Para size="1.2">{userName}</Para>
           <KeyboardArrowDownIcon sx={{ color: `${theme.palette.primary.dark}`, fontSize: '19px', marginRight: '5px' }} />
        </Stack>
     </LogoutWrapper>
  )
}


const LogoutWrapper = styled.a`
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;
      border: 1px solid ${props => props.theme.palette.primary.light};
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);

`


const SidebarWrapper = styled.div`
   background-color: ${props => props.theme.palette.primary.bac};
`

export default LogoutButton;