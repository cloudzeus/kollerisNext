import React from 'react'
import styled from 'styled-components'
const StepHeader = ({text}) => {
  return (
    <Header>{text}</Header>
  )
}


const Header = styled.p`
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 20px;
    position: relative;
    &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: -10px;
        width: 20px;
        border-radius: 20px;
        height: 3px;
        background-color: orange;

    }
`

export default StepHeader