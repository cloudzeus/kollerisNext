import React from 'react'
import styled from 'styled-components'
const GridPriceTemplate = ({PRICER}) => {
  return (
    <Container >
        <div className="price-icon">
            <p>$</p>
        </div>
        <p>{PRICER ? `${PRICER}` : 'NO PRICE'} </p>
    </Container >
  )
}

export default GridPriceTemplate


const Container = styled.div`
    display: flex;
    align-items: center;
    .price-icon {
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #d1d1d1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        color: #6a6b70;
    }
   
    
`