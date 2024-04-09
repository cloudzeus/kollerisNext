import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx';
import { setHeaders } from '@/features/catalogSlice';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { setGridData } from '@/features/catalogSlice';
import { Toast } from 'primereact/toast';

const MassiveImageUpload = () => {
    const fileInputRef = useRef(null);
    const toast = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [fileLoading, setFileLoading] = useState(false)
    const handleFileUpload = async (e) => {
        setFileLoading(true)
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            dispatch(setGridData(parsedData))

            if (parsedData.length > 0) {
                const firstRow = parsedData[0];
                const headers = Object.keys(firstRow).map((key) => ({
                    field: key,
                }));
                dispatch(setHeaders(headers))
                setFileLoading(false)
                router.push('/dashboard/product/multi-image-upload')
            } else {
                setFileLoading(false)
                showWarn()
                return;
            }
              
        };
    };

    const showWarn = () => {
        toast.current.show({severity:'warn', summary: 'Warning', detail:'Δεν βρέθηκαν δεδομένα στο αρχείο', life: 3000});
    }
    const onUploadClick = () => {
        fileInputRef.current.click()
    }

   
    return (
        <div>
            <Toast ref={toast} />
            <input hidden className="hide" ref={fileInputRef} type="file" onChange={(e) => handleFileUpload(e)} />
            <Button className='w-full' severity='warning' loading={fileLoading} onClick={onUploadClick} label="Ανέβασμα Φωτογραφιών xlsx" icon="pi pi-upload"></Button>
        </div>
    )
}




export default MassiveImageUpload