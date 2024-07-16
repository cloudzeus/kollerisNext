import React from 'react'
import PendingOrders from '@/components/suppliers/PendingOrders'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import {useRouter} from 'next/router'
import CompletedOrders from '@/components/suppliers/CompletedOrders'
import {Button} from "primereact/button";

const Page = () => {
    const router = useRouter();
    const {id} = router.query;
    return (
        <AdminLayout>
            <Button
                label="Όλες οι Παραγγελίες"
                icon="pi pi-arrow-left"
                severity="secondary"
                onClick={() => router.push('/dashboard/suppliers/orders')}
            />
            <PendingOrders id={id}/>
            <CompletedOrders id={id}/>
            <Button
                label="Προμηθευτές"
                icon="pi pi-arrow-left"
                className=" "
                onClick={() => router.push('/dashboard/suppliers')}
            />
        </AdminLayout>
    )
}

export default Page