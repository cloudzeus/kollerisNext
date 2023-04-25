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
  font-weight: 500;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 20px;
  letter-spacing: 0.9px;
  margin-bottom: 5px;
`
export default LightHeader