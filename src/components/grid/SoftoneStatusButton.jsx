'use client'
import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setProductsForSoftone } from '@/features/productsSlice';
const SoftoneStatusButton = ({onClick}) => {
    const dispatch = useDispatch() 
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const { selectedProducts } = useSelector(state => state.products)
    const router = useRouter();
    const checkStatus = () => {
        const notInSoftone = selectedProducts.filter(product => product.SOFTONESTATUS == false)
        dispatch(setProductsForSoftone(notInSoftone))
        return notInSoftone
      
    }

    const onBtnClick =() => {
        setLoading(true)
        let result = checkStatus();
      
     
        if(result.length > 0) {
        setVisible(true)
            setLoading(false)
            return;
        } 
        if(result.length === 0) {
            onClick()
        }
       
    }
    
    const accept = () => {
        router.push('/dashboard/add-to-softone')
        setVisible(false)
        setLoading(false)
    }

    const reject =() => {
        setVisible(false)
        setLoading(false)
        onClick()
    }

    return (
        <div>
            <ConfirmDialog 
                visible={visible} 
                onHide={() => setVisible(false)}
                message="Έχετε προσθέσει προϊόντα που δεν υπάρχουν στο Softone. Θέλετε να συνεχίσετε;" 
                acceptLabel="Προσθήκη στο Softone"
                rejectLabel='Συνέχεια'
                 header="SOFTONE STATUS" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
            {selectedProducts.length !== 0 ? (
            <Button icon="pi pi-angle-right" disabled={selectedProducts.length === 0} label="Ολοκλήρωση Holder" onClick={onBtnClick} loading={loading}
            />
            ) : null}
        </div>
    )
}

export default SoftoneStatusButton