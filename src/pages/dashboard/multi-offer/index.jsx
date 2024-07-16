'use client';
import React from 'react'
import { Button } from 'primereact/button'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import ClientHolder from '@/components/client/ClientHolders';
import { useDispatch } from 'react-redux';
import { resetHolder } from '@/features/impaofferSlice';

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch()
   


    const nextPage = () => {
        dispatch(resetHolder())
        router.push('/dashboard/multi-offer/choose-client')
    }

    return (
        <AdminLayout>
            <div>
                <Button icon="pi pi-plus" label="Δημιουργία Προσφοράς Πολλ. Επιλ" severity='secondary' onClick={nextPage} />
            </div>
            <div className='mt-4 ml-1'>
                <p className="stepheader">Προσφορές Πολλαπλών σημείων σε πελάτες</p>
                <ClientHolder NAME={null} />
              
            </div>
        </AdminLayout>
    )
}


export default Page;