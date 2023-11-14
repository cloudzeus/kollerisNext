import React, { useEffect } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useSession, signIn, signOut } from "next-auth/react"
import { StyleClass } from 'primereact/styleclass';
import UploadedProductsGrid from '@/components/grid/UploadedProductsGrid';
import ProductStats from '@/components/grid/ProductStats';
import StepHeader from '@/components/StepHeader';
const Page = () => {
  const session = useSession();


  return (
    <AdminLayout>
      <div className='mb-5'>
        <StepHeader text="Dashboard" />
      </div>
      <div className="col bg-white border-round mb-3">
        < UploadedProductsGrid />
      </div>

      <div className='grid'>
        <div className='col'>
        < ProductStats />
        </div>
        <div className='col'></div>
      </div>
      


    </AdminLayout>

  )
}




export default Page;