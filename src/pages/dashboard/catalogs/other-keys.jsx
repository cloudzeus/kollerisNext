import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { clearMongoKeys, setGridData, setHeaders, setSelectedPriceKey } from '@/features/catalogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { setSelectedMongoKey } from '@/features/catalogSlice';
import { Toast } from 'primereact/toast';
import StepHeader from '@/components/StepHeader';


const OurDatabaseKeys = [
    {
        key: 0,
        value: 'Κανένα'
    },
    {
        key: 'CODE2',
        value: 'Κωδικός Εργοστασίου'
    },

    {
        key: 'CODE1',
        value: 'Κωδικός EAN'
    },
    {
        key: 'CODE',
        value: 'Κωδικός ERP'
    },
    {
        key: 'NAME',
        value: 'Όνομα'
    },
    {
        key: "NAME_ENG",
        value: 'Όνομα Αγγλικά'
    },
    {
        key: 'PRICER',
        value: 'ΤΙΜΗ ΧΟΝΔΡΙΚΗΣ'
    },
    {
        key: 'PRICEW',
        value: 'ΤΙΜΗ ΛΙΑΝΙΚΗΣ'
    },
    {
        key: 'PRICER02',
        value: 'ΤΙΜΗ SKROUTZ'
    },
    {
        key: 'DESCRIPTION',
        value: 'Περιγραφή'
    },
    {
        key: 'DESCRIPTION_ENG',
        value: 'Περιγραφή Αγγλικά'
    },
    {
        key: 'VOLUME',
        value: 'Όγκος'
    },
    {
        key: '',
        value: "Mάζα"
    },
    {
        key: '',
        value: "Μικτό Βάρος"
    },
    {
        key: 'WIDTH',
        value: 'Πλάτος'
    },
    {
        key: 'HEIGHT',
        value: 'Ύψος'
    },
    
    {
        key: 'LENGTH',
        value: 'Μήκος'
    },
    {
        key: 'VAT',
        value: 'ΦΠΑ'
    },
    {
        key: 'isSkroutz',
        value: 'Συμμετέχει στο Skroutz'
    },
   
    {
        key: 'GWEIGHT',
        value: 'GWEIGHT'
    },
   
]



const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useRef(null);
    const { gridData, headers, mongoKeys } = useSelector((state) => state.catalog)

    useEffect(() => {
        clearMongoKeys();
    }, [])

   
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 6000 });
    }


    
    const SelectTemplate = ({ field }) => {
        const dispatch = useDispatch()
        const [dvalue, setdValue] = useState('')

        const handleChange = (e) => {
           
            setdValue(e.value)
            dispatch(setSelectedMongoKey({
                oldKey: field,
                related: e.value
            }))

        }

        return (
            <div >
                <Dropdown
                    value={dvalue}
                    onChange={handleChange}
                    options={OurDatabaseKeys}
                    optionLabel="value"
                    optionValue='key'
                    className=" w-full"
                    placeholder="Επίλεξε Κλειδί"
                />
            </div>
        )
    }

 

    const handleMongoKeysChange = () => {
        const codeCondition = mongoKeys.some(key => key.related === 'CODE2');
        if(!codeCondition) {
            return false;
        }
        return true;
    }

    const onSubmit = () => {
       let condition = handleMongoKeysChange();
        if (!condition) {
            showError('Πρέπει να επιλέξεις στήλη τον ΚΩΔΙΚΟ ΕΡΓΟΣΤΑΣΙΟΥ')
            return;
        };
        
        setSelectedMongoKey([])
        router.push('/dashboard/catalogs/result')
    }

    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Συσχετισμός Κλειδίων" />
            <div className='mb-4 mt-2'>
            <p >
                Υποχρεωτικό Πεδίο: <span className='font-bold'> Κωδικός Εργοστασίου</span>
            </p>
            <p>
            Συσχετείστε τα πεδία που επιθυμείτε από τον κατάλογο σας με τα παρακάτω κλειδιά της βάσης μας
            </p>
            </div>
            <DataTable
                showGridlines
                loading={loading}
                selectionMode="radiobutton"
                paginator
                rows={10}
                rowsPerPageOptions={[20, 50, 100, 200]}
                value={gridData.slice(0, 5)}
                tableStyle={{ minWidth: '50rem' }}
                filterDisplay="row"
            >
                {headers.map((header, index) => (
                    <Column filterElement={SelectTemplate} showFilterMenu={false} filter key={header.field} field={header.field} header={header.field} />
                ))}
            </DataTable>
            <Button label="Διαμόρφωση" onClick={onSubmit} className='mt-2'/>
        </AdminLayout >
    );
};







export default Page;


