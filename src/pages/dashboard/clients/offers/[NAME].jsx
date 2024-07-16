'use client'
import React from 'react'
import ClientHolder from '@/components/client/ClientHolders';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import OfferGrid from '@/components/offer/OfferGrid';
const Page = () => {
    const router = useRouter();
    const { NAME } = router.query;
    const decodedString = decodeURIComponent(NAME);


    return (
        <AdminLayout>
            <Button label="Πίσω" icon="pi pi-arrow-left" onClick={() => router.back()}  className='mb-4'/>
            <div className='mb-3'>
            <p className="stepheader">Προσφορές πολλαπλών επιλογών</p>
           
            </div>
            < ClientHolder NAME={decodedString} />
            <div className="mt-5">
            <p className="stepheader">Προσφορές</p>
            </div>
            <OfferGrid  clientName={NAME}/>

        </AdminLayout>
    )
}


export default Page;