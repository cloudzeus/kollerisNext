import React from 'react'
import Styled from 'styled-components'

const Para = ({children, size}) => {
  return (
    <ParaContainer size={size}>{children}</ParaContainer>
  )
}

const ParaContainer = Styled.p`
  color: ${({theme}) => theme.palette.text.main};
  font-size: ${props => props.size ? `${props.size}rem` : '1.5rem'};
`


export default Para;