import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { setTotalProductsPrice, setMtrLines, setDeleteMtrlLines, setIsFinalSubmit} from '@/features/supplierOrderSlice';

const CalculateTemplate = ({ PRICER, MTRL, brandName, NAME}) => {
    const [quantity, setQuantity] = useState(1)
    const dispatch = useDispatch();
    const {selectedProducts, mtrlLines} = useSelector(state => state.supplierOrder)
    const increaseQuantity = () => {
      setQuantity(prev => prev + 1)
    }



  
    const decreaseQuantity = () => {
      if (quantity === 1) return
      setQuantity(prev => prev - 1)
  
    }
  
    useEffect(() => {
        console.log(selectedProducts)
    }, [selectedProducts])
  
  
    let total = quantity * parseFloat(PRICER)
    return (
      <div className='flex p-2'>
  
        <div className='font-xs flex align-items-center border-1 p-2 border-300 border-round'>
          <div
            onClick={ decreaseQuantity}
            className='mr-2 border-1 border-300  flex align-items-center justify-content-center border-round pointer-cursor'
            style={{ width: '25px', height: '25px' }}>
            <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
          </div>
          <div className='w-2rem flex align-items-center justify-content-center'>
            <p className='text-lg'>{quantity}</p>
          </div>
          <div
            onClick={ increaseQuantity}
            className='ml-2 border-1  flex align-items-center justify-content-center border-round border-400' style={{ width: '25px', height: '25px' }}>
            <i className="pi pi-plus" style={{ fontSize: '10px' }}></i>
          </div>
        </div>
        <div className='flex align-items-center'>
          <span className='font-bold ml-3'>{total.toFixed(2) + "€"}</span>
        </div>
      </div>
    )
  }

export default CalculateTemplate