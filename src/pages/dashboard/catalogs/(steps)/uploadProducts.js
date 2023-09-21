import React, { use, useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';

import { useDispatch, useSelector } from 'react-redux';
import { setGridData, setHeaders, setCurrentPage, setSelectedPriceKey } from '@/features/catalogSlice';
import axios from 'axios';
import styled from 'styled-components';

const UploadProducts = () => {
    const { gridData, headers, } = useSelector((state) => state.catalog)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [onSelectKey, setOnSelectKey] = useState(null)
    const fileInputRef = useRef(null);


    const handleFileUpload = async (e) => {
        setLoading(true)
        const reader = new FileReader();
        let name = e.target.files[0].name
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            dispatch(setGridData(parsedData))


        }

        let formData = new FormData();
        let acceptedFiles = e.target.files[0]
        console.log(acceptedFiles)
        formData.append('files', acceptedFiles);


        const response = await fetch('/api/uploads/saveFile', {
            method: 'POST',
            body: formData,
        });

        // let savedatabasefile = await axios.post('/api/saveCatalog', {url: name, action: 'insert'})
        setLoading(false)
    }


    useEffect(() => {
        if (gridData.length === 0) return;
        let array = []
        for (const key in gridData[0]) {
            array.push({
                key: key,
                value: gridData[0][key],
                text: gridData[3][key],

            })
        }
        dispatch(setHeaders(array))

    }, [gridData, dispatch])


    const onSelection = (e) => {
        setOnSelectKey(e.value)
        dispatch(setSelectedPriceKey(e.value.key))
    }




    return (
        <>
           <h2 className='mb-3 mt-4'>Ανεβάστε Αρχείο:</h2>
            <UploadBtn>
                <input className='hide' ref={fileInputRef} type="file" onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current.click()} label="Upload" icon="pi pi-plus"></Button>
            </UploadBtn>

            <h2 className='mb-3 mt-4'>Επιλογή Κλειδιού Τιμής:</h2>

            {gridData ? (

                <DataTable
                    loading={loading}
                    selectionMode={'radiobutton'}
                    selection={onSelectKey}
                    onSelectionChange={onSelection}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[20, 50, 100, 200]}
                    value={headers}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column selectionMode="single" headerStyle={{ width: '30px' }}></Column>
                    <Column header="Κλειδιά" field="value" body={template} />
                </DataTable>)
                : null}
            <div>
                <Button
                severity="success"
                label="STEP 2"
                    disabled={onSelectKey === null ? true : false}
                    icon="pi pi-arrow-right" className='mb-2 mt-3 bg-success ' onClick={() => {
                        //GO TO CalculatePrice
                        dispatch(setCurrentPage(2))
                    }} />
            </div>

        </ >
    )
}



const template = ({ value, text }) => {
    return (
        <div>
            <p className='font-bold text-lg'> {value}</p>
            <p className='text-sm '>sample text: {text}</p>

        </div>
    )
}


export default UploadProducts;



const UploadBtn = styled.div`
    .hide {
        display: none;
    }
    display: inline-block;
`