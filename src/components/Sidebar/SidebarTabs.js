import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export const SidebarItem = ({ to, icon, label, subItem }) => {
  const router = useRouter();
  const theme = useTheme()
  const active = router.pathname === to;



  return (
    <NextLink href={to} passHref >
      <StyledSpan pl="6px"  subItem={subItem} active={active} theme={theme}>
        {icon}
        <span className="text" >{label}</span>
      </StyledSpan >
    </NextLink>
  );
};


export const SidebarExpandableItem = ({label, active, children,}) => {
  const [open , setOpen] = useState(false)
  const theme = useTheme()

    const onClick = () => {
      setOpen(!open)
    }

    const sx = {
      fontSize: '20px',
      color: 'grey'
    }
    return (
        <>
           <StyledSpan  onClick={onClick} active={active} theme={theme}>
            {open ? <KeyboardArrowDownIcon sx={sx} /> :<KeyboardArrowRightIcon  sx={sx} />  }
           {/* <SidebarText >{label}</SidebarText> */}
           <span className="text">{label}</span>
        </StyledSpan>
        <div>
         {open && children}
        </div>
        </>
      
    )
}




export const SidebarText = styled.p`
  font-weight: 300;
  color: ${({theme}) => theme.palette.text.main};
  font-size: ${props => props.size ? `${props.size}px` : '13px'};
  letter-spacing: 0.9px;
  padding-left: ${props => props.$extraPad ? '10px' : null};
`


const SidebarTextExtraPad = styled(SidebarText)`
  padding-left: 10px;
`


//Parent Container for the Sidebar tab:
export const StyledSpan = styled.div`
  width: 95%;
  border-radius: 0 35px 35px 0;
  display: flex;
  align-items: center;
  height: 40px;
  padding: ${props => props.subItem ? '0 40px' : '0 16px'};
  text-decoration: none;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.light};
    font-weight: 500;
  }
  ${({ active, theme }) =>
    active &&
    `
    background-color: ${theme.palette.background};
    color: ${theme.palette.primary.main};

  `}

  span.text {
    font-size: 14px;
    letter-spacing: 0.2px;
    padding-left: ${props => props.pl ? props.pl : '0px'};
  }
 
 
`;




