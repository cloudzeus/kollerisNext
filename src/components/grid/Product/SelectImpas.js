import React from 'react'
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedImpa } from '@/features/impaofferSlice';
import ImpaGrid from '../impaGrid';
import { setSubmitted } from '@/features/productsSlice';

 const SelectImpas = () => {
    const {selectedProducts} = useSelector(state => state.products)
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch();

    const toast = useRef(null);



    const handleImpaSubmit = async () => {
        let response = await axios.post('/api/product/apiImpa', { action: 'correlateImpa', id: selectedImpa._id, dataToUpdate: selectedProducts })
        if(!response.data.success) {
            showError()
        }
        showSuccess();
        dispatch(setSubmitted())
    }

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Impa update ολοκληρώθηκε', life: 3000});
    }

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Ιmpa update δεν ολοκληρώθηκε', life: 3000});
    }

    return (
        <div >
            <Toast ref={toast} />
            {selectedImpa ? (
                <>  
                    <div>
                        <Button label="Επίλεξε ξανά" onClick={() => dispatch(setSelectedImpa(null))}/>
                    </div>
                    <div className='surface-100	 p-3 mt-2'>

                        <p className='font-bold  mb-1'>Στοιχεία Αλλαγής:</p>
                        <div>
                            <p className='font-semibold mt-2 '>Περιγραφή:</p>
                            <p>{selectedImpa?.englishDescription}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='font-semibold mt-2 '>Κωδικός:</p>
                            <p>{selectedImpa?.code}</p>
                        </div>
                        <Button severity='warning' label="Αλλαγή Impa" onClick={handleImpaSubmit} />
                    </div>
                </>

            ) : (
                <ImpaGrid />
            )}

        </div>
    )
}

export default SelectImpas