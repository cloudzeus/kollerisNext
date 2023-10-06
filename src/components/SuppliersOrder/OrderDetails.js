import React from 'react'
import { useSelector } from 'react-redux'
const OrderDetails = () => {
    const { selectedSupplier } = useSelector(state => state.supplierOrder)
  return (
    <div className='bg-white p-3 border-round'>
        <span className='mb-3 block text-500 border-bottom-2 pb-2 border-100'>Στοιχεία αποστολής προσφοράς</span>
        <div className='mb-2'>
            <span>Όνομα Προμηθευτή:</span>
            <span className='font-bold ml-2'>{selectedSupplier?.NAME}</span>
        </div>
        <div>
            <span>Email Προμηθευτή:</span>
            <span className='font-bold ml-2'>{selectedSupplier?.EMAIL}</span>
        </div>
    </div>
  )
}

export default OrderDetails