import React, { use, useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';
import Step2 from './(steps)/step2';
import Step3 from './(steps)/step3';
import { useDispatch, useSelector } from 'react-redux';
import { setGridData, setHeaders, setSelectedHeaders, setCurrentPage } from '@/features/catalogSlice';
import { set } from 'mongoose';
import axios from 'axios';

const PageContainer = () => {
    const { currentPage} = useSelector((state) => state.catalog)

    return (
        <AdminLayout>  
            {currentPage == 1 ? (
                <Step1  
                   
                  
                />
            ) : null}
            {currentPage == 2 ? (
                <Step2  
                  
                    /> 
            ): null}
            {currentPage == 3 ? (
                <Step3  
                  
                    /> 
            ): null}
        </AdminLayout>
    )
}

const Step1 = () => {
    const {gridData, headers, selectedHeaders} = useSelector((state) => state.catalog)
    const [urls, setUrls] = useState([])
    const dispatch = useDispatch()
    const [savedfile, setSavedFile] = useState('')
   
    const handleFileUpload = async (e) => {
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
        let savedatabasefile = await axios.post('/api/saveCatalog', {url: name, action: 'insert'})
      
       
    }

    
   
    
    
    
  



    useEffect(() => {
        if(gridData.length < 0) return;
        let array = []
        for (const key in gridData[0]) {
            array.push({
                key: key,
                value: gridData[0][key],
                text: gridData[3][key],
              
            })
        }
        dispatch(setHeaders(array))

    }, [gridData])

    const footer = () => {
        return (
            <Button disabled={headers.length === 0 ? true : false} label="Add" icon="pi pi-plus"  className="p-button-success"  onClick={onSubmit}/>
        )
    }
    const onSelection = (e) => {
        dispatch(setSelectedHeaders(e.value))
    }



    const onSubmit = () => {
        dispatch(setCurrentPage(2)) 
    }
    return (
        <>
            <input type="file" onChange={handleFileUpload} />
            <p>Step 1:</p>
            <a download={savedfile}>urls</a>
            {gridData ? (
                <DataTable
                    selectionMode={'checkbox'}
                    selection={selectedHeaders}
                    onSelectionChange={onSelection}
                    footer={footer}
                    paginator 
                    rows={20} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={headers}
                    tableStyle={{ minWidth: '50rem' }}>
                                  <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
                          <Column  header="this" field="value" body={template} />
                </DataTable>)
                : null}
         
        
        </ >
    )
}

const template = ({value, text}) => {
    return (
        <div>
            <p className='font-bold text-lg'> {value}</p>
            <p className='text-sm '>sample text: {text}</p>
          
        </div>
    )
}

export default PageContainer;