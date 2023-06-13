import React from 'react'

import styled from 'styled-components'
const FlexContainer = ({children, justify, align, className}) => {
  return (
    <Container 
      justify={justify}
      align={align}
      className={className}
      >
        {children}
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    align-items: ${props => props.align ? props.align : 'center'};
    justify-content: ${props => props.justify};
`

export default FlexContainer;