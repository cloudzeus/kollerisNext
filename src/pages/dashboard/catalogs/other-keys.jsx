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

const Page = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { gridData, headers, data, selectedPriceKey, mongoKeys } = useSelector((state) => state.catalog)
    console.log( mongoKeys)

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

    // const Remove = ({ value }) => {
    //     const dispatch = useDispatch()
    //     const { selectedHeaders } = useSelector((state) => state.catalog)
    //     const remove = (e) => {

    //         const filtered = selectedHeaders.filter(item => item.value !== value)
    //         dispatch(setSelectedHeaders(filtered))
    //     }
    //     return (
    //         <i className="pi pi-trash" style={{ fontSize: '1rem', color: 'red' }} onClick={remove}></i>

    //     )
    // }



    return (
        <AdminLayout >
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
                    <Column filterElement={SelectTemplate} showFilterMenu={false} filter key={header.field} field={header.field} header={header.header} />
                ))}
            </DataTable>
            <Button label="διαμόρφωση" onClick={() => router.push('/dashboard/catalogs/result')} />
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