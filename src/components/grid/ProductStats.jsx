import React, { useEffect, useState } from 'react'
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';

const ProductStats = () => {
    const [state, setState] = useState({
        totalProducts: 0,
        imageStat: 0,
        totalWithImages: 0,
        descriptions: 20,
    
    })
    const handleFetch = async () => {
        let {data} = await axios.post('/api/dashboard', {action: 'getStats'}) 
        console.log(data.result)  
        // setState(prev =>  ({...prev, 
        //     imageStat: data.result.imageStat,
        //     totalWithImages: data.result.totalWithImages,
        //     totalProducts: data.result.totalProducts,
        
        // }) )
        setState(data.result)
    }

    useEffect(() => {
        handleFetch()
    }, [])
  return (
    <div className='bg-white p-4 border-round'>
         <div className="card">
            <div className='mb-3'>
                <p className='text-lg'>Σύνολο Προϊόντων:</p>
                <span className='font-bold text-sm'>{state.totalProducts}</span>
                
            </div>
            <ProgressDiv  value={state.imageStat} total={state.totalWithImages} text="Προϊόντα με φωτογραφίες" />
            <ProgressDiv color={'orange'}  value={state.inSoftoneStat} total={state.inSoftone} text="Προϊόντα και στα 2 συστήματα" />
        </div>
    </div>
  )
}

const ProgressDiv = ({color, total, text, value}) => {
    return (
        <div className='grid mb-2'>
            <div className='col-12'>
                <div className='mb-2'>
                    <span className='font-bold'>{`${total} `}</span>
                    <span>{`${text} `}</span>
                  
                </div>
                <div className='flex align-items-center'>
                    <div className='w-full mr-3'>
                    <ProgressBar color={color} size="small" style={{ height: '10px', minWidth: '100px' }} value={value} showValue={false}></ProgressBar>
                    </div>
                  
                    <div className='w-2rem'>
                    <span className='font-bold text-xs' >{`${value.toFixed(2)}%`}</span>
                    </div>
                </div>
            </div>
          
        </div>
    )
}

export default ProductStats