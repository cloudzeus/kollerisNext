'use client'
import React, { useEffect, useState } from 'react'

import StepHeader from '@/components/StepHeader'
import ProductSearchGrid from '@/components/grid/ProductSearchGrid'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { setHolder } from '@/features/impaofferSlice'
import { useRouter } from 'next/router'
import SelectedProducts from '@/components/grid/SelectedProducts'
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton'
import { setPlainHolderName } from '@/features/impaofferSlice'
import axios from 'axios'






const PlainHolder = () => {
    const dispatch = useDispatch();
    const {plainHolderName} = useSelector(state => state.impaoffer)
    const router = useRouter();
    const {id} = router.query;
    console.log('id')
    console.log(id)
    const onChange = (e) => {
        dispatch(setPlainHolderName(e.target.value))
    }

    useEffect(() => {
        dispatch(setPlainHolderName(''))
    }, [])

    return (
        < AdminLayout>
            <Button label="Πίσω" icon="pi pi-angle-left" className='mb-5' onClick={() => router.back()} />
            <StepHeader text={"Ονομα Holder"} />
            <div className='w-20rem mb-3 mt-2 flex'>
                <InputText className='w-full' value={plainHolderName} onChange={onChange } placeholder='Δώστε ένα όνομα στον Holder' />
                <Button className='ml-2' icon={plainHolderName !== '' ? "pi pi-check" : "pi pi-times"} severity={plainHolderName !== '' ? "success" : "danger"} />
            </div>
            {plainHolderName ? (<Continue  name={plainHolderName} holderId={id}/>) : null}

        </ AdminLayout>
    )
}


const Continue = ({name, holderId}) => {
    const { selectedProducts, mtrLines } = useSelector(state => state.products)
    const router = useRouter();
   
    const onHolderCompletions = async () => {
        console.log(mtrLines)
        const {data} = axios.post('/api/createOffer', { action: 'createHolder', name: name, products: mtrLines, holderId: holderId })
        // router.push('/dashboard/multi-offer/create-holder')
    }
    return (
        <>
            <StepHeader text={"Eπιλογή Προϊότων"} />
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
                <SoftoneStatusButton btnText="Ολοκλήρωση Holder"  onClick={onHolderCompletions}/>
            </div>
        </>
    )
}
export default PlainHolder