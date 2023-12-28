import { PickListComp } from "../create-impa-holder"
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton';
import { addMoreToHolder } from "@/features/impaofferSlice";
import { Message } from "primereact/message";
import { OverlayPanel } from 'primereact/overlaypanel';
import InfoPanel from "@/components/InfoPannel";


export default function Page() {

    const { mtrLines } = useSelector(state => state.products)
    const { holder } = useSelector(state => state.impaoffer)
    const op = useRef(null)
    const router = useRouter()
    const dispatch = useDispatch()
    const id = router.query.id
    const onCompletion = async () => {
        dispatch(addMoreToHolder({
            id: id,
            products: mtrLines
        }))
        router.push('/dashboard/multi-offer')
    }


    return (
        <AdminLayout>
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => router.back()} />
            </div>
            <InfoPanel message="Αν επιθυμείτε να αυξήσετε την ποσότητα προϊόντων που υπάρχουν ήδη στον holder, 
                προσθέστε τα στην λίστα, ρυθμίστε την ποσότητα που επιθυμείτε και πατήστε το κουμπί Προσθήκη" />
            <PickListComp disableImpaBtn={true} title="Προσθήκη Περισσότερων" />

            <div className='mt-4 mb-5'>
                <div className='mt-3'>
                    < SoftoneStatusButton onClick={onCompletion} btnText="Προσθήκη" />
                </div>

            </div>
        </AdminLayout>
    )
}