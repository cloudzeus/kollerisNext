import React, { use } from 'react'
import { Button } from 'primereact/button'
import StepHeader from './StepHeader'
import { setOfferPage, setPageId } from '@/features/impaofferSlice'
import { useSelector, useDispatch } from 'react-redux'


const CreateOffer = () => {
    const dispatch = useDispatch()
    return (
        <div>
            <div>
                <Button icon="pi pi-plus" label="Δημιουργία Προσφοράς" severity='warning' onClick={() => dispatch(setPageId(2))} />
            </div>
            <div className='mt-4 ml-1'>
                <StepHeader text={"Tρέχουσες Προσφορές"} />
            </div>
        </div>
    )
}

export default CreateOffer;