'use client'
import React, { useEffect, useState } from 'react'

import StepHeader from '@/components/StepHeader'
import ProductSearchGrid from '@/components/grid/ProductSearchGrid'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { addMoreToHolder, setHolder } from '@/features/impaofferSlice'
import { useRouter } from 'next/router'
import SelectedProducts from '@/components/grid/SelectedProducts'
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton'
import { setPlainHolderName } from '@/features/impaofferSlice'



function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
}



const PlainHolder = () => {
    const dispatch = useDispatch();
    const {plainHolderName} = useSelector(state => state.impaoffer)
    const router = useRouter();
    const { selectedProducts, mtrLines } = useSelector(state => state.products)
    const id = router.query.id
  
    const onComplete = (e) => {
        dispatch(addMoreToHolder({
            id: id,
            products: mtrLines
        }))
        router.push('/dashboard/multi-offer')

    }

   

    return (
        < AdminLayout>
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



export default PlainHolder