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
  color: ${({ theme }) => theme.palette.grey.shade2};
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
  font-family: 'Roboto Condensed', sans-serif;
`
export default LightHeader