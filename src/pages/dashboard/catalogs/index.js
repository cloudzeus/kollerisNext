import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import axios from "axios";
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';
import Step2 from './(steps)/step2';
import Step3 from './(steps)/step3';




const PageContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [headers, setHeaders] = useState([]); 
    const [selectedHeaders, setSelectedHeaders] = useState(null);
    const [data, setData] = useState([]);

    return (
        <AdminLayout>  
            {currentPage == 1 ? (
                <Step1  
                    data={data}
                    setData={setData} 
                    setCurrentPage={setCurrentPage} 
                    headers={headers} 
                    setHeaders={setHeaders}  
                    selectedHeaders={selectedHeaders}
                    setSelectedHeaders={setSelectedHeaders}
                />
            ) : null}
            {currentPage == 2 ? (
                <Step2  
                    setCurrentPage={setCurrentPage} 
                    headers={headers}  
                    selectedHeaders={selectedHeaders} /> 
            ): null}
            {currentPage == 3 ? (
                <Step3  
                    data={data}
                    setCurrentPage={setCurrentPage} 
                    headers={headers}  
                    selectedHeaders={selectedHeaders} /> 
            ): null}
        </AdminLayout>
    )
}

const Step1 = ({
        data, 
        setData, 
        setCurrentPage, 
        headers, 
        setHeaders, 
        selectedHeaders, 
        setSelectedHeaders
    }) => {

    const [selectedProducts, setSelectedProducts] = useState(null);
    
    const handleFileUpload = (e) => {
        console.log('e')
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData);
        }
    }

    console.log(data[0])

    useEffect(() => {
        if(data.length < 0) return;
        console.log(data[0]) 
        let array = []
        for (const key in data[0]) {
            console.log(data[0][key])
            array.push({
                key: key,
                value: data[0][key],
            })
            setHeaders(array)
        }

    }, [data])

    const footer = () => {
        return (
            <Button disabled={headers.length === 0 ? true : false} label="Add" icon="pi pi-plus"  className="p-button-success"  onClick={onSubmit}/>
        )
    }
    const onSelection = (e) => {
        setSelectedHeaders(e.value);
    }



    const onSubmit = () => {
        console.log('submit')
        console.log('selectedProducts')
        console.log(selectedProducts)
        setCurrentPage(2)
    }
    return (
        <>
            <input type="file" onChange={handleFileUpload} />
            <p>Step 1:</p>
            {data ? (
                <DataTable
                    selectionMode={'checkbox'}
                    selection={selectedHeaders}
                    onSelectionChange={onSelection}
                    footer={footer}
                    paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={headers}
                    tableStyle={{ minWidth: '50rem' }}>
                                  <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
                          <Column  header="this" field="value"/>
                </DataTable>)
                : null}
        </ >
    )
}

export default PageContainer;