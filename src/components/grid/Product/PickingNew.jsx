import React, { useEffect, useState, useRef} from 'react'
import SuppliersGrid from '@/components/suppliers/suppliersGrid'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedSupplier } from '@/features/supplierOrderSlice';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { useRouter } from 'next/router';

const PickingNew = () => {
    const [show, setShow] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const { selectedSupplier } = useSelector(state => state.supplierOrder)
    const {mtrLines} = useSelector(state => state.products)
    const [selected, setSelected] = useState({ name: 'Wharehouse 1000', code: 1000 });
    const toast = useRef(null);
    const router = useRouter()
    const dispatch = useDispatch();

    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    }

    useEffect(() => {
        dispatch(setSelectedSupplier(null))
        setSelected({ name: 'Wharehouse 1000', code: 1000 })
    }, [])

    useEffect(() => {
        if (selectedSupplier) {
            setShow(false)
        }
    }, [selectedSupplier])

    const onSubmit = async () => {
        
        if(!selectedSupplier) {
            showError('Επιλέξτε προμηθευτή')
            return;
        }
        let obj = {
            TRDR: selectedSupplier?.TRDR,
            supplier: selectedSupplier?.NAME,
            WHOUSE: selected.code,
            mtrLines: mtrLines 
        }
        setBtnLoading(true)
        const {data} = await axios.post('/api/pickingnew', {action: "createPurDoc", ...obj})
        console.log(data)
        if(!data.success) {
            showError(data?.message)
        } else {
            showSuccess(data?.message)
        }
        setBtnLoading(false)
        router.push('/dashboard/suppliers/picking');
    }

    return (
        <div>
            <Toast ref={toast} />
            <span className='font-bold'>Προμηθευτής</span>
            <div className='bg-white mt-2 p-3 border-1 border-round border-200 flex justify-content-between align-items-center'>
                <Button label="Επιλογή Προμηθευτή" severity='secondary' size="small" onClick={() => setShow(prev => !prev)} />
                {selectedSupplier && (<span className='font-bold'>{selectedSupplier?.NAME}</span>)}
            </div>
            {show ? (
                <SuppliersGrid  />
            ) : null
            }

            <span className='font-bold block mt-3'>Aποθήκη</span>
            <div className='bg-white mt-2 p-3 border-1 border-round border-200 flex justify-content-between align-items-center'>
                <ChoseWhareHouse selected={selected} setSelected={setSelected}/>
            </div>
            <Button loading={btnLoading} onClick={onSubmit}  label="Αποστολή" className='mt-4' disabled={!selected || !selectedSupplier}/>
        </div>
    )
}

const ChoseWhareHouse = ({selected, setSelected}) => {
   
    const wharehhpouses = [
        { name: 'Wharehouse 1000', code: 1000 },
        { name: 'Wharehouse 2000', code: 2000 },
        { name: 'Wharehouse 3000', code: 3000 },

    ];
    return (

        <Dropdown value={selected} onChange={(e) => setSelected(e.value)} options={wharehhpouses} optionLabel="name"
            place size="small" holder="Επιλογή Αποθήκης" className="w-full md:w-20rem" />
    )
}



export default PickingNew