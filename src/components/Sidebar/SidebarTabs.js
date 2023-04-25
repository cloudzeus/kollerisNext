import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import Para from '../Text/Para';


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


const SidebarText = styled.p`
  font-size: 14px;
  margin-left: 15px;
  color: ${({ theme }) => theme.palette.grey.shade1};
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


