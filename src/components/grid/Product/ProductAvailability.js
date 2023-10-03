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
   
        <div className='prod_availability_container' >
            <div  className='prod_availability_content '>
                <div className='prod_availability_row'>
                    <CircleDiv />
                    <span>Διαθεσιμα:</span>
                    <span className='prod_availability_available'>{data?.DIATHESIMA}</span>
                </div>

                <div className='prod_availability_row update-row'>

                    <span>updated:</span>
                    <span className='prod_availability_date'>{data?.date}</span>
                </div>


            </div>

        </div>
    )
}


export const ProductOrdered = ({data}) => {
    return (
        <div className='prod_availability_container'>
        <div >
            <div className='prod_availability_row'>
                <div className='prod_availability_circle prod_availability_circle-ordered'></div>
                <span >Σε παραγγελία:</span>
                <span className='prod_availability_available'>{data?.SEPARAGELIA}</span>
            </div>
    
        </div>
    </div>
    )
}
export const ProductReserved = ({data}) => {
    return (
        <div className='prod_availability_container'>
        <div >
            <div className='prod_availability_row'>
                <div className='prod_availability_circle prod_availability_circle-reserved'></div>
                <span className='prod_availability_block'>Δεσμευμένα:</span>
                <span className='prod_availability_available'>{data?.DESVMEVMENA}</span>
            </div>
    
        </div>
    </div>
    )
}



export default ProductAvailability