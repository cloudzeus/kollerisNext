import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import NorthIcon from '@mui/icons-material/North';
import { IconBtn } from './Button';
const GoToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleFullscreen = () => {
        console.log('toggleFullscreen')
        // const doc = window.document;
        // const docEl = doc.documentElement;
        // console.log(doc)
        // const requestFullscreen =
        //   docEl.requestFullscreen ||
        //   docEl.mozRequestFullScreen ||
        //   docEl.webkitRequestFullScreen ||
        //   docEl.msRequestFullscreen;
        
        // const exitFullscreen =
        //   doc.exitFullscreen ||
        //   doc.mozCancelFullScreen ||
        //   doc.webkitExitFullscreen ||
        //   doc.msExitFullscreen;
      
        // if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        //   requestFullscreen.call(docEl);
        // } else {
        //   exitFullscreen.call(doc);
        // }
      }
    return (
        <Container isVisible={isVisible} onClick={toggleFullscreen}>
            <NorthIcon />
        </Container>
    )
}

const Container = styled(IconBtn)`
    /* display: ${({ isVisible }) => isVisible ? 'block' : 'none'}; */
    position: absolute;
    right: 20px;
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