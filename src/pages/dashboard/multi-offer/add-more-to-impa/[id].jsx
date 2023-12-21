import { PickListComp } from "../create-impa-holder"
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton';
import { addMoreToHolder } from "@/features/impaofferSlice";
export default function Page() {
    const {mtrLines} = useSelector(state => state.products)
    const {holder} = useSelector(state => state.impaoffer)
    const router = useRouter()
    const dispatch = useDispatch()
    const id = router.query.id
    const onCompletion = async () => {
      
        dispatch(addMoreToHolder({
            id: id,
            products: mtrLines
        }))
        router.push('/dashboard/multi-offer/create-holder')
    }

    useEffect(() => {
        console.log('--------------------------------------------')
        console.log('submit holder')
        console.log(holder)
    }, [holder])
    return (
        <AdminLayout>
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => router.back()} />
            </div>
            <PickListComp disableImpaBtn={true} />
            <div className='mt-4 mb-5'>
                <div className='mt-3'>

                    < SoftoneStatusButton onClick={onCompletion} btnText="Προσθήκη" />

                </div>

            </div>
        </AdminLayout>
    )
}