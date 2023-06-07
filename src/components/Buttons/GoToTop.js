import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import NorthIcon from '@mui/icons-material/North';
import { IconBtn } from './Button';
const GoToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
   
    return (
        <Container isVisible={isVisible} >
            <NorthIcon />
        </Container>
    )
}

const Container = styled(IconBtn)`
    /* display: ${({ isVisible }) => isVisible ? 'block' : 'none'}; */
    position: absolute;
    right: 3px;
    bottom: 20px;
    width: 30px;
    height: 30px;
    background-color: ${({ theme }) => theme.palette.accent};
    z-index: 9999;
    svg {
        font-size: 18px;
    }

`


  


export default GoToTop