import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import SelectedProducts from '@/components/grid/SelectedProducts'
import { useRouter } from 'next/router';
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import StepHeader from '@/components/StepHeader';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
const Page = () => {
    const router = useRouter();
    const {selectedProducts} = useSelector(state => state.products);
    console.log(selectedProducts)
  return (
    <AdminLayout>
        <div>
            <StepHeader text="Επιλογή Προϊόντων" />
            <ProductSearchGrid />
            {selectedProducts.length > 0 ? (
               <>
                  <div className='mt-4'>
                 <StepHeader text="Επιλεγμένα Προϊόντα" />
                 </div>
                 <SelectedProducts />
                 <Button onClick={() => router.push('/dashboard/offer')} className='mt-4' label="Ολοκλήρωση" color="primary" />
               </>
            ) : null}
           
        </div>
    </AdminLayout >
  )
}

export default Page