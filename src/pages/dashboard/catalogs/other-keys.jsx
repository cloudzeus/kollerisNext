import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import StepHeader from '@/components/StepHeader';
import { Checkbox } from 'primereact/checkbox';
import { Toolbar } from 'primereact/toolbar';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { setGridData, setHeaders, setSelectedPriceKey } from '@/features/catalogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { setSelectedMongoKey } from '@/features/catalogSlice';
import { Toast } from 'primereact/toast';

const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useRef(null);
    const { gridData, headers, mongoKeys } = useSelector((state) => state.catalog)
    const [isSubmit, setIsSubmit] = useState(false)


    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
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

    useEffect(() => {
        
        let nameCondition = mongoKeys.some(key => key.related === 'NAME');
        let codeCondition = mongoKeys.some(key => key.related === 'CODE');
        if (nameCondition && codeCondition) {
            setIsSubmit(true); // Set isSubmit to true if 'name' or 'code' condition is met
        } else {
            setIsSubmit(false); // Set isSubmit to false if none of the conditions are met'
        }
        console.log(mongoKeys)
    }, [mongoKeys])


    const onSubmit = () => {
        console.log(isSubmit)
       if(!isSubmit) {
        showError('Πρέπει να επιλέξεις στήλη για το όνομα ή τον κωδικό')
        return;

       }
        router.push('/dashboard/catalogs/result')
    }

    return (
        <AdminLayout >
            <Toast ref={toast} />
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