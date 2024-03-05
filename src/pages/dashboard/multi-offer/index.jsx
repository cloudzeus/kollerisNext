'use client';
import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'
import StepHeader from '@/components/StepHeader';
import axios from 'axios'
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
                <StepHeader text={"Προσφορές Πολλαπλών σημείων σε πελάτες"} />
                <ClientHolder NAME={null} />
              
            </div>
        </AdminLayout>
    )
}


export default Page;