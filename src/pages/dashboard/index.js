import React, { useEffect } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import UploadedProductsGrid from '@/components/grid/UploadedProductsGrid';
import ProductStats from '@/components/grid/ProductStats';
import StepHeader from '@/components/StepHeader';
import { DataTable } from 'primereact/datatable';
import OffersSection from '@/components/grid/Product/OffersSection';
const Page = () => {


  return (
    <AdminLayout>
     
     <OffersSection />
    
      <div className="col bg-white border-round mb-3">
        < UploadedProductsGrid />
      </div>
      <div className='ml-2'>
      <StepHeader text={"Προϊόν"} />
      </div>
      <div className='grid mt-1'>
        <div className='col'>
        < ProductStats />
        </div>
        <div className='col'></div>
      </div>
    </AdminLayout>

  )
}






export default Page;