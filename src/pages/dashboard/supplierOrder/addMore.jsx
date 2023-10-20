'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';

import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { setLazyState } from '@/features/productsSlice';
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import SelectedProducts from '@/components/grid/SelectedProducts';
import { setSelectedProducts } from '@/features/supplierOrderSlice';
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton';
const ChooseProducts = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { selectedMarkes, searchTerm, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
  const {selectedProducts, mtrLines} = useSelector(state => state.products)



  useEffect(() => {
    if(!selectedMarkes) {
      router.push('/dashboard/product/brands')
    }
  }, [])
  const handleFinalSubmit = async () => {
    let { data } = await axios.post('/api/createOrder', {
      action: 'updateBucket',
      products: mtrLines,
      MTRMARK: selectedMarkes?.mtrmark,
    })
      router.push('/dashboard/product/brands')
  }
  return (
    <AdminLayout>
      <StepHeader text="Προσθήκη Προϊόντων στο bucket" />
      <ProductSearchGrid />
      {selectedProducts.length > 0 ? (
        <div className='mt-4'>
          <StepHeader text="Επιλεγμένα Προϊόντα" />
          <SelectedProducts />
        </div>
      ) : null}
      <div className='mt-3 flex'>
        <Button className='mr-2' severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
        <SoftoneStatusButton   onClick={handleFinalSubmit}/>
      </div>

    </AdminLayout>
  )
}





export default ChooseProducts;