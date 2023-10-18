import { Button } from 'primereact/button';
import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
const Page = () => {
    const router = useRouter();
  return (
    < AdminLayout >
       <div>
                <Button icon="pi pi-plus" label="Δημιουργία Προσφοράς" severity='warning' onClick={() => router.push('/dashboard/offer/select-products')}/>
            </div>
    </ AdminLayout >
         
  )
}

export default Page;