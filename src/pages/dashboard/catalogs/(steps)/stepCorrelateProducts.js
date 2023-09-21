import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
    setSelectedHeaders,
    setSelectedMongoKey,
    setCurrentPage,
    setAttribute
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
        value: 'Κωδικός ----'
    },
    {
        key: 'PRICER',
        value: 'Tιμή Λιανικής'
    },
   
    {
        key: 'PRICER',
        value: 'Tιμή Χονδρικής'
    },
    {
        key: 'COUNTRY',
        value: 'Χώρα'
    },
    {
        key: 'COUNTRY',
        value: 'Χώρα'
    },
    {
        key: 'WIDTH',
        value: 'Μήκος'
    },
    
    {
        key: 'HEIGHT',
        value: 'Ύψος'
    },
    {
        key: 'ΠΛΑΤΟΣ',
        value: 'Πλάτος'
    },
    {
        key: 'GWEIGHT',
        value: 'GWEIGHT'
    },
    {
        key: 'STOCK',
        value: 'STOCK'
    },
    {
        key: 'ΑΓΓΛΙΚΗ ΠΕΡΙΓΡΑΦΗ',
        value: 'ENLISH-DESCRIPTION'
    },
    {
        key: 'ΓΕΡΜΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ',
        value: 'GERMAN-DESCRIPTION'
    },
    {
        key: 'ΓΑΛΛΙΚΗ ΠΕΡΙΓΡΑΦΗ',
        value: 'GERMAN-DESCRIPTION'
    },
    {
        key: 'ΙΣΠΑΝΙΚΗ DESCRIPTION',
        value: 'SPANISH-DESCRIPTION'
    },
    {
        key: 'ΙΤΑΛΙΚΗ DESCRIPTION',
        value: 'ITALIAN-DESCRIPTION'
    },

]

const StepCorrelateProducts = () => {
    const { selectedHeaders, attributes, mongoKeys } = useSelector((state) => state.catalog)
    const dispatch = useDispatch();
    const [continueBtn, setContinue] = useState(false)
    const toast = useRef(null);
  
    console.log(mongoKeys)
    useEffect(() => {
        setContinue(false)
    
        let totalLength = attributes.length + mongoKeys.length

        if(totalLength === selectedHeaders.length) {
            setContinue(true)
        }
     
    }, [ selectedHeaders, mongoKeys, attributes])


    return (
        <div>
            <div className='card bg-white p-4 border-round mb-3 mt-2'>
                <p className="text-red-600 font-bold text-xl">CREATE CUSTOM ATTRIBUTE*:</p>
                <p className='text-xl'>Δημιουργούμε custom attributes αν δεν υπάρχει ήδη το κλειδί στο selecte box. Τα custom attributes κατά βάση μεγέθη, fields οπως size/content.</p>
            </div>
            <Toast ref={toast} />
            <DataTable
                showGridlines
                paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                value={selectedHeaders}
                tableStyle={{ minWidth: '50rem' }}>
                <Column header="Headers" field="value" body={Template} />
                <Column  body={SelectTemplate} style={{ width: '150px' }} />
                <Column field="value" body={Remove} style={{ width: '30px' }} />
            </DataTable>

        
            <div className='mt-3'>
        <Button     label="STEP 3"   severity="success"  icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(3))} />
        <Button 
        disabled={!continueBtn}
         label="FINAL STEP 5"   
         severity="success" 
         icon="pi pi-arrow-right" 
         className='ml-2' 
         onClick={() => {
          //GO TO stepSelectKeys
          dispatch(setCurrentPage(5))
        }} />
      </div>
        </div>
    )
}

const Template = ({ value, text, key }) => {
  
   
    return (
        <div className='flex justify-content-between'>
            <div>
                <p className='font-bold text-lg'> {value}</p>
                <p className='text-sm'>sample text: {text}</p>
            </div>
        </div>
    )
}



const SelectTemplate = ({ value, text, key }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [dvalue, setdValue] = useState('')

    const handleChange = (e) => {
        console.log(value)

        setdValue(e.value)
        dispatch(setSelectedMongoKey({
            oldKey: key,
            newkey: value,
            related: e.value
        }))

    }

    const handleInputChange = (e) => {
        setdValue(e.target.value)
        console.log(e.target.value)
        let object = {
            ogKey: key,
            name: value,
            value: e.target.value,

        }
        dispatch(setAttribute(object))
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

export default StepCorrelateProducts;