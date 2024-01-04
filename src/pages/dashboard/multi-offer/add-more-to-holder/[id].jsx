'use client'
import React, { useEffect, useState, useRef } from 'react'
import StepHeader from '@/components/StepHeader'
import ProductSearchGrid from '@/components/grid/ProductSearchGrid'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import SelectedProducts from '@/components/grid/SelectedProducts'
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton'
import axios from 'axios'
import { Toast } from 'primereact/toast'


const Page = () => {
    const router = useRouter();
    const { selectedProducts, mtrLines } = useSelector(state => state.products)
    const {id} = router.query;
    const toast = useRef(null)

    
    const showError = async (message) => {
            toast.current.show({severity: 'info', summary: 'Error', detail: message, life: 6000});
    }

    const onComplete = async (e) => {
        console.log(mtrLines)
        const {data} = await axios.post('/api/createOffer', { action: 'addMoreToHolder', products: mtrLines, holderId: id })
        console.log(data)
       
        if(data.existing.length > 0) {
            for(let item of data.existing) {
                 showError(`Το προϊόν  ---- ${item} ---- υπάρχει ήδη στον holder`)
            } 
               
        } else {
            router.push('/dashboard/multi-offer')
        }
       

    }
 
   

    return (
        < AdminLayout>
            <Toast ref={toast} />
            <Button label="Πίσω" icon="pi pi-angle-left" className='mb-5' onClick={() => router.back()} />
            <StepHeader text={"Επιλογή Προϊότων "} />
            <ProductSearchGrid />
            <div className='col-12 mt-6'>
                {selectedProducts.length > 0 ? (
                    <div>
                        <StepHeader text={`Συνολο Προϊόντων`} />
                        <SelectedProducts />
                    </div>
                ) : null}

            </div>
            <div className='mt-4 mb-5'>
                <SoftoneStatusButton btnText="Προσθήκη"  onClick={onComplete}/>
            </div>

        </ AdminLayout>
    )
}



export default Page;