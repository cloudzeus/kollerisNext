import { PickListComp } from "../create-impa-holder"
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton';
import axios from "axios";
import InfoPanel from "@/components/InfoPannel";
import { Toast } from 'primereact/toast';


export default function Page() {

    const { mtrLines } = useSelector(state => state.products)
    const { holder } = useSelector(state => state.impaoffer)
    const op = useRef(null)
    const toast = useRef(null)
    const router = useRouter()
    const dispatch = useDispatch()
    const holderId = router.query.id[0]
    const impaCode = router.query.id[1]
    console.log(holderId, impaCode)
    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Message Content', life: 3000});
    }
    

    const showError = (message) => {
        toast.current.show({severity: 'info', summary: 'Error', detail:message, life: 6000});
    }

    const onCompletion = async () => {
        const {data} = await axios.post('/api/createOffer', { action: 'addMoreToHolder', products: mtrLines, holderId: holderId })
        if(data.existing.length > 0) {
            for(let item of data.existing) {
                 showError(`Το προϊόν  ---- ${item} ---- υπάρχει ήδη στον holder`)
            } 
        } else {
            router.push('/dashboard/multi-offer')
        }
    }


    return (
        <AdminLayout>
            <Toast ref={toast} />
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => router.back()} />
            </div>
            <InfoPanel message="Αν επιθυμείτε να αυξήσετε την ποσότητα προϊόντων που υπάρχουν ήδη στον holder, 
                προσθέστε τα στην λίστα, ρυθμίστε την ποσότητα που επιθυμείτε και πατήστε το κουμπί Προσθήκη" />
            <PickListComp code={impaCode} disableImpaBtn={true} title="Προσθήκη Περισσότερων" />

            <div className='mt-4 mb-5'>
                <div className='mt-3'>
                    < SoftoneStatusButton onClick={onCompletion} btnText="Προσθήκη" />
                </div>

            </div>
        </AdminLayout>
    )
}