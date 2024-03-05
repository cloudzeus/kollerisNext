import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import StepHeader from '@/components/StepHeader'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { setSingleProductForSoftone } from '@/features/productsSlice';


const Page = () => {
    const {productsForSoftone} = useSelector(store => store.products)
    const router = useRouter();

  

 
  return (
    < AdminLayout>
        <StepHeader text ="Προϊόντα στην ουρά για προσθήκη στο softOne"/>
        <div className="card">
            <DataTable value={productsForSoftone} tableStyle={{ minWidth: '50rem' }}>
                <Column field="NAME" header="Προϊόν"></Column>
                <Column field="NAME"  body={Actions} style={{width: '40px'}}></Column>
            </DataTable>
        </div>
        <Button className='mt-2' label="Πίσω" onClick={() => router.back()} />
    </ AdminLayout>
  )
}

const Actions = (product) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const handleClick = () => {
        dispatch(setSingleProductForSoftone(product))
        router.push('/dashboard/add-to-softone/add')
    }
    return (
        <div>  
            <Button icon="pi pi-plus" severity={"secondary"} onClick={handleClick}/>
        </div>
    )
}

export default Page