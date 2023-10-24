import React, { useEffect, useRef } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import SelectedProducts from '@/components/grid/SelectedProducts'
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import StepHeader from '@/components/StepHeader';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import { setLoading } from '@/features/productsSlice';
const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const toast = useRef(null);
    const {selectedProducts, mtrLines} = useSelector(state => state.products);
    const {offerEmail} = useSelector(state => state.impaoffer);
    const { selectedClient } = useSelector(state => state.impaoffer)

    useEffect(() => {
      if(!selectedClient) {
        router.push('/dashboard/offer')
      }
    }, [])

    const showSuccess = (message) => {
      toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    }
  
    const showError = (message) => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
    const onClick = async () => {
      
        setLoading(true)
        const {data} = await axios.post('/api/singleOffer', {
          action: "createOrder", 
          data: mtrLines, 
          email: offerEmail,
          name: selectedClient?.NAME,
          TRDR: selectedClient?.TRDR
        })

        if(!data.success) {
          showError(data.error)
          return;
        } 
        setLoading(false)

        router.push('/dashboard/offer')
    }
  return (
    <AdminLayout>
      <Toast ref={toast} />
        <div>
            <StepHeader text="Επιλογή Προϊόντων" />
            <ProductSearchGrid />
            {selectedProducts.length > 0 ? (
               <>
                  <div className='mt-4'>
                 <StepHeader text="Επιλεγμένα Προϊόντα" />
                 </div>
                 <SelectedProducts />
                 <Button loading={loading} onClick={onClick} className='mt-4' label="Ολοκλήρωση" color="primary" />
               </>
            ) : null}
           
        </div>
    </AdminLayout >
  )
}

export default Page