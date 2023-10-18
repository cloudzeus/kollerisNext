
'use client'
import CustomersGrid from '@/components/grid/clientGrid';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Button } from 'primereact/button';
import ClientDetails from '@/components/multiOffer/ClientDetails';
import { useRouter } from 'next/router';
import StepHeader from '@/components/StepHeader';
import { useSelector } from 'react-redux';
const ChooseCustomer = () => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const router = useRouter();
    return (
        <AdminLayout>
            <StepHeader text="Eπιλογή Πελάτη" />
            <CustomersGrid />
            <ClientDetails />
            {selectedClient ? (<Button className='mt-3' label='Επόμενο' severity="success" onClick={() => router.push('/dashboard/multi-offer/create-holder')} />
            ) : null}
        </AdminLayout>
    )
}


export default ChooseCustomer