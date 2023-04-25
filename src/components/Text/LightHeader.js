import React from 'react'
import styled from 'styled-components'


const LightHeader = ({ children }) => {
  return (
    <Para>
      {children}
    </Para>
  )
}



const Para = styled.p`
  color: ${({ theme }) => theme.palette.grey.pewter};
  font-weight: 300;
  font-size: 14px;
  margin-left: 20px;
  margin-top: 20px;
  letter-spacing: 1.4px;
  margin-bottom: 5px;
  font-family: 'Roboto Condensed', sans-serif;
`
export default LightHeader