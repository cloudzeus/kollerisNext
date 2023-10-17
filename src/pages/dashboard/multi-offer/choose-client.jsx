
'use client'
import CustomersGrid from '@/components/grid/clientGrid';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Button } from 'primereact/button';
import ClientDetails from '@/components/ImpaOffer/ClientDetails';
import { useRouter } from 'next/router';
const ChooseCustomer = () => {
    const router = useRouter();
    return (
        <AdminLayout>  
            <div className='w-full flex justify-content-between '>
                <Button severity='secondary' label="Επιλογή Πελάτη" onClick={() => setShowTable(prev => !prev)} />
            </div>
               <CustomersGrid />
                <ClientDetails />
                <Button  label='Επόμενο' severity="success" onClick={() => router .push('/dashboard/multi-offer/create-holder') } />
        </AdminLayout>
    )
}


export default ChooseCustomer