import React, { useEffect, useState, useRef} from 'react'
import SuppliersGrid from '@/components/suppliers/suppliersGrid'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedSupplier } from '@/features/supplierOrderSlice';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { InputTextarea } from "primereact/inputtextarea";
import { useToast } from '@/_context/ToastContext';

const PickingNew = () => {
    const [show, setShow] = useState(true)
    const [remarks, setRemarks] = useState('');
    const [btnLoading, setBtnLoading] = useState(false)
    const { selectedSupplier } = useSelector(state => state.supplierOrder)
    const {mtrLines} = useSelector(state => state.products)
    const {showMessage} = useToast()
 
    const [selected, setSelected] = useState({ name: 'Wharehouse 1000', code: 1000 });
    const toast = useRef(null);
    const dispatch = useDispatch();

    
    
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
        try {
            setBtnLoading(true)
            const {data} = await axios.post('/api/pickingnew', {
                action: "createPurDoc", 
                TRDR: selectedSupplier?.TRDR,
                supplier: selectedSupplier?.NAME,
                WHOUSE: selected.code,
                mtrLines: mtrLines,
                remarks: remarks
            })
            showMessage({
                severity: "success",
                summary: "Success",
                message: data?.message + " " + data?.result,
            })
        } catch(e) {
            showMessage({
                severity: "error",
                summary: "Error",
                message: e?.response?.data?.error || e.message,
            
            })
        } finally {
            setBtnLoading(false)
        }
       
       
       
    }

    return (
        <div>
            <span className='font-bold'>Προμηθευτής: {selectedSupplier && selectedSupplier?.NAME}</span>
            <div className='bg-white my-3 flex justify-content-between align-items-center'>
                <Button label="Επιλογή Προμηθευτή" severity='secondary' size="small" onClick={() => setShow(prev => !prev)} />
            </div>
            {show ? (
                <SuppliersGrid  />
            ) : null
            }

            <span className='font-bold block mt-3'>Aποθήκη</span>
            <div className='bg-white mt-2   flex justify-content-between align-items-center'>
                <ChoseWhareHouse selected={selected} setSelected={setSelected}/>
            </div>
            <span className='font-bold block mt-3'>Σχόλια</span>
            <div className='bg-white mt-2 mb-2  flex justify-content-between align-items-center'>
                <InputTextarea 
                className='w-full' 
                value={remarks} 
                onChange={(e) => setRemarks(e.target.value)}
                rows={2} 
                 cols={25} 
                 />
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
        <Dropdown 
            value={selected}
            onChange={(e) => setSelected(e.value)} 
            options={wharehhpouses} 
            optionLabel="name"
            size="small" 
            holder="Επιλογή Αποθήκης" 
            className="w-full md:w-20rem custom_dropdown" 
            />
    )
}



export default PickingNew