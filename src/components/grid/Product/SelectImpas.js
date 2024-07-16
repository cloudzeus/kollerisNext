import React from 'react'
import { useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedImpa } from '@/features/impaofferSlice';
import ImpaGrid from '../impaGrid';
import { setSubmitted } from '@/features/productsSlice';
import { useToast } from '@/_context/ToastContext';

 const SelectImpas = () => {
    const {selectedProducts} = useSelector(state => state.products)
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch();
    const toast = useRef(null);
    const {showMessage} = useToast();


    const handleImpaSubmit = async () => {
        try {
            let response = await axios.post('/api/product/apiImpa', { action: 'correlateImpa', id: selectedImpa._id, dataToUpdate: selectedProducts })
            showMessage({
                severity: "success",
                summary: "Επιτυχία",
                message: response?.data?.message || 'Η αλλαγή των Impa ολοκληρώθηκε επιτυχώς'
            })
        } catch(e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e?.response?.data?.error || e.message
            })
        } finally {
            dispatch(setSubmitted())
        }
       
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