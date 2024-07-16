'use client'
import React from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import SelectedProducts from '@/components/grid/SelectedProducts';
import { useSession } from 'next-auth/react';
import {useToast} from "@/_context/ToastContext";

const Page = () => {

  const router = useRouter()
  const { data: session } = useSession();
  let user = session?.user;
  const {id} = router.query
  const {selectedProducts, mtrLines} = useSelector(state => state.products)
const {showMessage} = useToast()



  const handleFinalSubmit = async () => {
    try {
      let { data } = await axios.post('/api/createOrder', {
        action: 'updateBucket',
        products: mtrLines,
        TRDR: id,
        createdFrom: user?.lastName,
      })
      router.push(`/dashboard/suppliers/order/${id}`)
    } catch(e) {
      console.log({e})
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message
      })
    } finally {

    }

  }
  return (
    <AdminLayout>
      <p className="stepheader">Προσθήκη Προϊόντων Στον Κουβά</p>
      <ProductSearchGrid />
      {selectedProducts.length > 0 ? (
        <div className='mt-4'>
          <p className="stepheader">Επιλεγμένα Προϊόντα</p>
          <SelectedProducts />
          <div className='my-2'>
            <Button className='mr-2' severity='secondary' icon="pi pi-arrow-left" onClick={() => router.back()} />
            <Button className='mr-2' label="Oλοκλήρωση"  icon="pi pi-check" onClick={handleFinalSubmit} />
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}





export default Page;