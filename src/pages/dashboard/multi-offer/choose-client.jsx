
'use client'
import CustomersGrid from '@/components/grid/clientGrid';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Button } from 'primereact/button';
import ClientDetails from '@/components/multiOffer/ClientDetails';
import { useRouter } from 'next/router';
import StepHeader from '@/components/StepHeader';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSession } from 'next-auth/react';
const ChooseCustomer = () => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user?.user.lastName;

    console.log(user)
    const handleClick = async () => {
        const {data} = await axios.post('/api/createOffer', { action: "startOffer", selectedClient: selectedClient, user: user})
        router.push('/dashboard/multi-offer')
    }
    return (
        <AdminLayout>
            <Button label="Πίσω" icon="pi pi-angle-left" className='mb-5' onClick={() => router.push('/dashboard/multi-offer')} />
            <StepHeader text="Eπιλογή Πελάτη" />
            <CustomersGrid />
            {/* <ClientDetails /> */}
            {selectedClient ? (<Button className='mt-3' label='Επόμενο' severity="success" onClick={handleClick} />
            ) : null}
        </AdminLayout>
    )
}


export default ChooseCustomer