import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';

import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { setGridData, setHeaders, setSelectedPriceKey, setData } from '@/features/catalogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import styled from 'styled-components';


const UploadCatalog = () => {
    const [loading, setLoading] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const fileInputRef = useRef(null);
    const [fileLoading, setFileLoading] = useState(false)
    const router = useRouter();
    const { gridData, headers, data } = useSelector((state) => state.catalog)
    const dispatch = useDispatch();
    const handleFileUpload = async (e) => {
        console.log(e)
        setFileLoading(true)
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            dispatch(setGridData(parsedData.slice(0, 5)))

            if (parsedData.length > 0) {
                const firstRow = parsedData[0];
                const secondRow = parsedData[1];
                const value = Object.values(secondRow)[0];
                const headers = Object.keys(firstRow).map((key) => ({
                    field: key,
                }));
                dispatch(setHeaders(headers))
                dispatch(setData(headers))
                setFileLoading(false)
            }
        };
    };

 

    const Start = () => {
        return (
            <p>Πίνακας</p>
        )
    }
    const End = () => {
        return (
            <i className='pi pi-angle-down cursor' style={{ margin: '4px 4px 0 0' }}></i>
        )
    }

    const onUploadClick = () => {
        fileInputRef.current.click()
    }

    return (
        <AdminLayout >

            {/* <UploadBtn>
                <input className="hide" ref={fileInputRef} type="file" onChange={handleFileUpload} />
                <Button loading={fileLoading} onClick={onUploadClick} label="Ανέβασμα αρχείου" icon="pi pi-plus"></Button>
            </UploadBtn> */}
                <div className='mt-2'>
            <DataTable
                header="Πίνακας Καταλόγου"
                loading={loading}
                selectionMode="radiobutton"
                paginator
                rows={10}
                rowsPerPageOptions={[20, 50, 100, 200]}
                value={gridData}
                tableStyle={{ minWidth: '50rem' }}
            >
                {headers.map((header, index) => (
                    <Column key={header.field} field={header.field} header={header.field} />
                ))}
            </DataTable>
            <div className='flex'>
            <div className='bg-white p-3 border-round mt-4 w-full'>
            <p className='font-bold'>Επιλέξτε την στήλη από τον πίνακα που αντιπροσωπεύει την τιμή κόστους</p>
            <ChooseKey headers={headers}  selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>

            </div>
            </div>
           
            <div>
                <Button
                    severity="success"
                    label="STEP 2"
                    disabled={selectedKey === null}
                    icon="pi pi-arrow-right"
                    className="mb-2 mt-3 bg-success"
                    onClick={() => {
                       router.push('/dashboard/catalogs/calculate-price')
                    }}
                />
            </div>
                </div>
          
        </AdminLayout >
    );
};





const ChooseKey = ({headers, selectedKey, setSelectedKey}) => {
    const dispatch = useDispatch();
    const onChange = (e) => {
        dispatch(setSelectedPriceKey(e.value.field))
        let newHeaders = headers.filter(item => item.field !== e.value.field)
        dispatch(setHeaders(newHeaders))
        setSelectedKey(e.value)
    }
    return (
        <Dropdown value={selectedKey} onChange={ onChange} options={headers} optionLabel="field" placeholder="Επιλογή Τιμής Κόστους" 
            filter  className="w-20rem mt-2" />
    )
}

const UploadBtn = styled.div`
  .hide {
    display: none;
  }
  display: inline-block;
`;

export default UploadCatalog;

