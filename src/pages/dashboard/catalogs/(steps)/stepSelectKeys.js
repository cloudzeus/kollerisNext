import React, { use, useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';

import { useDispatch, useSelector } from 'react-redux';
import { setGridData, setHeaders, setSelectedHeaders, setCurrentPage } from '@/features/catalogSlice';
import axios from 'axios';
import StepHeader from '@/components/StepHeader';

const StepsSelectKey1 = () => {
    const {  headers } = useSelector((state) => state.catalog)
    const dispatch = useDispatch();
    const [selectedGridKeys, setSelectedGridKeys] = useState(null)
  
    const onSelection = (e) => {
        setSelectedGridKeys(e.value)
        dispatch(setSelectedHeaders(e.value))
    }



    useEffect(() => {
        setSelectedGridKeys(null)
        dispatch(setSelectedHeaders(null))
    }, [dispatch])

    return (
        <> 
            <div>
                <StepHeader text="Επιλογή Υπόλοιπων Κλειδιών" />
            </div>
            <DataTable
                value={headers}
                selectionMode={'checkbox'}
                selection={selectedGridKeys}
                onSelectionChange={onSelection}
                tableStyle={{ minWidth: '50rem' }}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50, 100]}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="__EMPTY" header="Code" body={template}></Column>
            </DataTable>
            <div className='mt-3'>
                <Button  label="STEP 2"  severity="success" icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(2))} />
                <Button 
                  label="STEP 4" 
                    severity="success" 
                    disabled={selectedGridKeys === null ? true : false}
                    icon="pi pi-arrow-right" 
                    className='ml-2'
                     onClick={() => {
                    //GO TO STEP stepCorrelateProducts
                    dispatch(setCurrentPage(4))
                }} />
            </div>
        </ >
    )
}

const template = ({ value, text, text2 }) => {
    return (
        <div>
            <p className='font-bold text-lg'> {value}</p>
            <p className='text-sm '>sample text: {text}</p>
            <p className='text-sm '>sample text: {text2}</p>

        </div>
    )
}


export default StepsSelectKey1;