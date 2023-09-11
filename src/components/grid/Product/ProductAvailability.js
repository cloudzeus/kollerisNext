import React, { useRef } from 'react'
import styled from 'styled-components'




export const ProductAvailability = ({ data }) => {
    const op = useRef(null);


    const CircleDiv = () => {
            return (
                <div className={`circle circle-div ${parseInt(data?.DIATHESIMA) < 0 ? 'circle-notavailable' : null }`}></div>
            )
       
       
    }
   

    return (
        <Container >
            <div  className='content '>
                <div className='row'>
                    <CircleDiv />
                    <span>Διαθεσιμα:</span>
                    <span className='available'>{data?.DIATHESIMA}</span>
                </div>

                <div className='row update-row'>

                    <span>updated:</span>
                    <span className='date'>{data?.date}</span>
                </div>


            </div>

        </Container>
    )
}


export const ProductOrdered = ({data}) => {
    return (
        <Container>
        <div >
            <div className='row'>
                <div className='circle circle-ordered'></div>
                <span >Σε παραγγελία:</span>
                <span className='available'>{data?.SEPARAGELIA}</span>
            </div>
    
        </div>
    </Container>
    )
}
export const ProductReserved = ({data}) => {
    return (
        <Container>
        <div >
            <div className='row'>
                <div className='circle circle-reserved'></div>
                <span className='block'>Δεσμευμένα:</span>
                <span className='available'>{data?.DESVMEVMENA}</span>
            </div>
    
        </div>
    </Container>
    )
}


const Container = styled.div`
    display: flex;
    align-items: center;
    .row {
        display: flex;
        align-items: center;
    }
    .block {
        display: block;
    }

    .row span {
        white-space: nowrap;
    }
   

    .update-row {
        font-size: 11px;
        margin-top: 2px;
    }
    .content {
       margin-right: 15px;
    }

    .available {
        margin-left: 4px;
        font-weight: bold;
     
    }

    .circle  {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 4px;
        margin-top: 3px;
    }

    .circle-div {
      
        background-color: #44f40b;
 
    }
    .circle-ordered{
   
        background-color: #e4941b;
      
    }
    .circle-reserved{
   
        background-color: #1ecbe1;
      
    }
    
   
    .circle-notavailable {
        background-color: #f40b0b;
    }

    .date {
        margin-left: 2px;
        font-style: italic;
        color: grey;
    }

   
`



export default ProductAvailability