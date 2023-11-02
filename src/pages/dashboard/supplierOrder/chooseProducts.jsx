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
const ChooseProducts = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { selectedMarkes, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
  const {mtrLines, selectedProducts} = useSelector(state => state.products)
  console.log(selectedSupplier)

  useEffect(() => {
    if(!selectedSupplier) {
      router.push('/dashboard/suppliers')
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
         <SoftoneStatusButton onClick={handleFinalSubmit}/>

          </div>
       </div>
      ) : null}
     

    </AdminLayout>
  )
}







export default ChooseProducts;