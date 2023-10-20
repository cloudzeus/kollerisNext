'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import SelectedProducts from '@/components/grid/SelectedProducts';
import { setSelectedProducts } from '@/features/productsSlice';
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton';
const ChooseProducts = ({ hideBackBtn }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { selectedMarkes, searchTerm, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
  const {mtrLines, selectedProducts} = useSelector(state => state.products)
  console.log('selected supplier')
  console.log(selectedSupplier)

  useEffect(() => {
    if(!selectedSupplier) {
      router.push('/dashboard/product/suppliers')
    }
  }, [])




  useEffect(() => {
    console.log( mtrLines)
  }, [mtrLines])



 


  const handleFinalSubmit = async () => {
    let { data } = await axios.post('/api/createOrder', {
      action: 'createBucket',
      products: mtrLines,
      email: inputEmail,
      TRDR: selectedSupplier?.TRDR,
      NAME: selectedSupplier?.NAME,
      MTRMARK: selectedMarkes.mtrmark,
      minItems: selectedMarkes.minItemsOrder,
      minValue: selectedMarkes.minValueOrder
    })
    router.push('/dashboard/product/brands')
  }
  return (
    <AdminLayout>
      <StepHeader text="Προσθήκη Προϊόντων στο bucket" />
      <ProductSearchGrid />
 
      {selectedProducts.length !== 0 ? (
         <div className='mt-3'>
          <StepHeader text="Επιλεγμένα Προϊόντα" />
     <SelectedProducts />
          <div className='mt-3 flex align-items-center'>
            <Button className='mr-3' severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
         <SoftoneStatusButton label="Ολοκλήρωση"  onClick={handleFinalSubmit}/>

          </div>
       </div>
      ) : null}
     

    </AdminLayout>
  )
}



const CalculateTemplate = ({ PRICER, MTRL }) => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch();
  const { selectedProducts, mtrLines } = useSelector(state => state.supplierOrder)



  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }




  const decreaseQuantity = () => {
    if (quantity === 1) return
    setQuantity(prev => prev - 1)

  }

  useEffect(() => {
    if (quantity == 1) return;
    if (mtrLines === 0) return;
    let find = mtrLines.find(el => el.MTRL === MTRL)
    if (find) {
      dispatch(updateMtrlines({
        MTRL: find?.MTRL,
        QTY1: quantity,
      }))
    }

  }, [quantity])



  let total = quantity * parseFloat(PRICER)
  return (
    <div className='flex p-2'>

      <div className='font-xs flex align-items-center border-1 p-2 border-300 border-round'>
        <div
          onClick={decreaseQuantity}
          className='mr-2 border-1 border-300  flex align-items-center justify-content-center border-round pointer-cursor'
          style={{ width: '25px', height: '25px' }}>
          <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
        </div>
        <div className='w-2rem flex align-items-center justify-content-center'>
          <p className='text-lg'>{quantity}</p>
        </div>
        <div
          onClick={increaseQuantity}
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




export default ChooseProducts;