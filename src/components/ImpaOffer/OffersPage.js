import React from 'react'
import { Button } from 'primereact/button'
import StepHeader from './StepHeader'
import ChooseCustomer from './ChooseCustomer'
import { useDispatch } from 'react-redux'
import { setOfferPage, setHolderPage, setPageId} from '@/features/impaofferSlice'


const ΟffersPage = () => {
    const dispatch = useDispatch()

    return (
        <div>
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => dispatch(setPageId(1))} />
            </div>
            <StepHeader text={"Επιλογή Πελάτη"} />
            
            <ChooseCustomer />
            <div className=''>
                <div className='bg-white mt-3 border-round p-4 flex align-item-center justify-content-between'>
                    <div>
                        <Button icon="pi pi-plus" label="Νέο Holder" severity='warning' onClick={() => dispatch(setPageId(3))} />
                    </div>
                    <div>
                    </div>
                </div>
                {/* <Holders counter={counter} setCounter={setCounter} /> */}
            </div>
        </div>
    )
}

export default ΟffersPage;