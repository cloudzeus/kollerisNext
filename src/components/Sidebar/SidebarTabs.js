import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';



export const SidebarItem = ({ to, icon, label }) => {
  const router = useRouter();
  const theme = useTheme()
  const active = router.pathname === to;
  return (
    <NextLink href={to} passHref>
      <StyledSpan active={active} theme={theme}>
        {icon}
        {/* <StyledText active={active} theme={theme}  style={{ marginLeft: 8, fontWeight: 700, color: theme.palette.primary.textMain}}>{label.toUpperCase()}</StyledText >
           */}
        <StyledText>{label}</StyledText>
      </StyledSpan >
    </NextLink>
  );
};



const StyledText = styled.span`
  color: ${({ theme }) => theme.palette.text.lighHeaderShade2};
  font-weight: 600;
  letter-spacing : 1px;
  margin-left: 10px;
  font-size: 15px;
`;


const StyledSpan = styled.span`
  display: flex;
  align-items: center;
  height: 50px;
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


