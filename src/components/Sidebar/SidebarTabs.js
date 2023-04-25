import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import Para from '../Text/Para';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Stack } from '@mui/material';


export const SidebarItem = ({ to, icon, label }) => {
  const router = useRouter();
  const theme = useTheme()
  const active = router.pathname === to;
  return (
    <NextLink href={to} passHref>
      <StyledSpan active={active} theme={theme}>
        {icon}
        <SidebarText>{label}</SidebarText>
        
      </StyledSpan >
    </NextLink>
  );
};
export const SidebarItemNoLink = ({ isOpen, setIsOpen, icon, label }) => {
  const onClick = () => {
    setIsOpen(!isOpen)
  }

  const theme = useTheme()
  return (
      <StyledSpanExtend onClick={onClick} theme={theme}>
        <Stack direction={'row'}>
          {icon}
          <SidebarText>{label}</SidebarText>
        </Stack>
        {isOpen ?<KeyboardArrowDownIcon fontSize='17px' /> : <KeyboardArrowUpIcon fontSize='17px' />}
      </ StyledSpanExtend  >
  );
};


const SidebarText = styled.p`
  margin-left: 15px;
  color: ${({theme}) => theme.palette.text.main};
  font-size: ${props => props.size ? `${props.size}px` : '13px'};
  letter-spacing: 0.9px;
`




const StyledSpan = styled.span`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  text-decoration: none;
  color: #333;
  border-left: 3px solid transparent;
  width: 100%;
  
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  ${({ active, theme }) =>
    active &&
    `
    border-left-color: ${theme.palette.text.darkHover};
    background-color: ${theme.palette.hoverColor};
    color: ${theme.palette.text.darkHover};

  `}
`;

const StyledSpanExtend = styled(StyledSpan)`
  justify-content: space-between;
`


