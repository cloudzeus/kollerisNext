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
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
  letter-spacing: 0.9px;
`
export default LightHeader