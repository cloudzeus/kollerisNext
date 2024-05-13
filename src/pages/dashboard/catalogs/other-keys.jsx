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
const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useRef(null);
    const { gridData, headers, mongoKeys } = useSelector((state) => state.catalog)
    const [isSubmit, setIsSubmit] = useState(false)

    useEffect(() => {
        clearMongoKeys();
    }, [])

   
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 6000 });
    }

    console.log('mongoKeys')
    console.log(mongoKeys)
  
    
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

    // useEffect(() => {
    //     console.log(mongoKeys)
    //     let nameCondition = mongoKeys.some(key => key.related === 'NAME');
    //     let codeCondition = mongoKeys.some(key => key.related === 'CODE2');
    //     if (nameCondition && codeCondition) {
    //         setIsSubmit(true); // Set isSubmit to true if 'name' or 'code' condition is met
    //     } else {
    //         setIsSubmit(false); // Set isSubmit to false if none of the conditions are met'
    //     }
    //     console.log(mongoKeys)
    // }, [mongoKeys])

    const handleMongoKeysChange = () => {
        const codeCondition = mongoKeys.some(key => key.related === 'CODE2');
        console.log(codeCondition)
        if(!codeCondition) {
            return false;
        }
        return true;
    }

    const onSubmit = () => {
        console.log(mongoKeys)
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


const OurDatabaseKeys = [
    {
        key: 0,
        value: 'Κανένα'
    },
    {
        key: 'NAME',
        value: 'Όνομα'
    },
    {
        key: 'PRICER',
        value: 'ΤΙΜΗ'
    },
    {
        key: 'PRICER01',
        value: 'ΤΙΜΗ SKROUTZ'
    },
    {
        key: 'PRICEW',
        value: 'ΤΙΜΗ ΛΙΑΝΙΚΗΣ'
    },
    {
        key: 'COST',
        value: 'ΚΟΣΤΟΣ'
    },
    {
        key: 'description',
        value: 'Περιγραφή'
    },
  
    {
        key: 'CODE1',
        value: 'EANCODE'
    },
    {
        key: 'CODE2',
        value: 'Κωδικός Εργοστασίου'
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
        value: 'englishDescription'
    },





]