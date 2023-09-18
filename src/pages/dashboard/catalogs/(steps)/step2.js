import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
    setGridData,
    setHeaders,
    setSelectedHeaders,
    setSelectedMongoKey,
    setCurrentPage,
    setDropdownValue
} from '@/features/catalogSlice';
import { InputText } from "primereact/inputtext";


import { Toast } from 'primereact/toast';

const OurDatabaseKeys = [
    {
        key: 'name',
        value: 'Όνομα'
    },
    {
        key: 'description',
        value: 'Περιγραφή'
    },
    {
        key: 'CODE',
        value: 'EANCODE'
    },
    {
        key: 'CODE1',
        value: 'Κωδικός εργοστασίου'
    },
    {
        key: 'CODE2',
        value: 'Κωδικός εργοστασίου'
    },
    {
        key: 'PRICER',
        value: 'Tιμή Λιανικής'
    },
    {
        key: 'PRICER',
        value: 'Tιμή Λιανικής'
    },
    {
        key: 'PRICER',
        value: 'Tιμή Λιανικής'
    },
    {
        key: 'PRICER',
        value: 'Tιμή Λιανικής'
    },


]

const Step2 = () => {
    const { selectedHeaders } = useSelector((state) => state.catalog)
    const dispatch = useDispatch();
    const [continueBtn, setContinue] = useState(false)
    const toast = useRef(null);


    const showWarn = () => {
        toast.current.show({severity:'warn', summary: 'Warning', detail:'Message Content', life: 3000});
    }

    useEffect(() => {
        let array = [];
        setContinue(false)
        selectedHeaders.map((item) => {
            if(item.hasOwnProperty('related')) {
                array.push(item)
            }
        })
        if(array.length === selectedHeaders.length) {
            setContinue(true)
        }
    }, [ selectedHeaders])


    return (
        <div>
            <div className='card bg-white p-2 border-round mb-3 mt-2'>
                <p>customattributes</p>
            </div>
            <Toast ref={toast} />
            <DataTable
                showGridlines
                paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                value={selectedHeaders}
                tableStyle={{ minWidth: '50rem' }}>
                <Column header="Headers" field="value" body={Template} />
                <Column  body={Second} style={{ width: '150px' }} />
                <Column field="value" body={Remove} style={{ width: '30px' }} />
            </DataTable>

            <div>
                <Button label="back" icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(1))} />
                <Button disabled={!continueBtn} label="next" icon="pi pi-arrow-right" onClick={() => {
                    if(continueBtn) {
                        dispatch(setCurrentPage(3))
                    } else {
                        showWarn()
                    }
                }} />
            </div>
        </div>
    )
}

const Template = ({ value, text }) => {
  
   
    return (
        <div className='flex justify-content-between'>
            <div>
                <p className='font-bold text-lg'> {value}</p>
                <p className='text-sm'>sample text: {text}</p>
            </div>
        </div>
    )
}



const Second = ({ value, text }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [dvalue, setdValue] = useState('')

    const handleChange = (e) => {
        setdValue(e.value)
        dispatch(setSelectedMongoKey({
            old: value,
            new: e.value
        }))

    }

    const handleInputChange = (e) => {
        setdValue(e.target.value)
        dispatch(setSelectedMongoKey({
            old: value,
            new: e.target.value
        }))
    }
    return (
        <div >
    
            {!show ? (
                 <Dropdown 
                 value={dvalue} 
                 onChange={handleChange} 
                 options={OurDatabaseKeys} 
                 optionLabel="value"
                 optionValue='key'
                 className=" w-full" 
                 placeholder="Επίλεξε Κλειδί"
             />
            ) : null}
               
            
               
           
                {show ? (<InputText className='w-full' placeholder="custom attribute" value={dvalue} onChange={handleInputChange }/>) : null}
                <p 
                onClick={() => setShow(prev => !prev)} 
                className='ml-2 mt-1 underline text-blue-500 cursor-pointer w-full'
                >{!show ? "create custom attribute" : "πίσω"}</p>

        </div>
    )
}

const Remove = ({ value }) => {
    const dispatch = useDispatch()
    const { selectedHeaders } = useSelector((state) => state.catalog)
    const remove = (e) => {
        console.log('remove')
        console.log(selectedHeaders)
        const filtered = selectedHeaders.filter(item => item.value !== value)
        dispatch(setSelectedHeaders(filtered))
    }
    return (
        <i className="pi pi-trash" style={{ fontSize: '1rem', color: 'red' }} onClick={remove}></i>

    )
}

export default Step2