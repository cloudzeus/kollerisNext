
'use client'
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import axios from "axios";
import * as XLSX from 'xlsx';
const Impas = () => {
    const [data, setData] = useState([]);
    const [showData, setShowData] = useState([]);
    console.log(data)
    const [expandedRows, setExpandedRows] = useState(null);

    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            console.log(workbook)
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData);
        }
    }
    const allowExpansion = (rowData) => {
        return rowData

    };
   
      
    const handleAddImpas = async () => {
        const chunkSize = 100;
        let arrayOfChunks = [];

        for (let i = 0; i < data.length; i += chunkSize) {
            let slice = data.slice(i, i + chunkSize);
            arrayOfChunks = slice

        await axios.post('/api/product/apiImpa', { action: 'insert', data: arrayOfChunks })
        }
        
}


    const handleFetch = async () => {
        const res = await axios.post('/api/product/apiImpa', {action: 'findAll'})
        setShowData(res.data.data)
    }

  
    useEffect(() => {
        handleFetch()
    }, [])

    const rowExpansionTemplate = (props) => {
        return (
            <ExpandedDataTable products={props.products}/>
        )
    }
  
    return (
        <AdminLayout>
            <DataTable 
                loading={showData.length == 0 ? true : false}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                paginator rows={10} rowsPerPageOptions={[20, 50, 100, 200]}
                value={showData} 
                tableStyle={{ minWidth: '50rem' }}>
                    <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                    <Column field="code" header="code"></Column>
                    <Column field="englishDescription" header="Code"></Column>
                    <Column field="greekDescription" header="Code"></Column>
                    <Column field="unit" header="Unit"></Column>
            </DataTable>
            {/* <input type="file" onChange={handleFileUpload} />
            {data ? ( 
            <DataTable 
                paginator rows={5} rowsPerPageOptions={[20, 50, 100, 200]}
                value={data} 
                tableStyle={{ minWidth: '50rem' }}>
                <Column field="Code" header="Code"></Column>
                <Column field="English Description" header="Code"></Column>
                <Column field="Ελληνική Περιγραφή" header="Code"></Column>
                <Column field="Unit" header="Unit"></Column>
            </DataTable> ): null}
            < Button label="add impas database" onClick={handleAddImpas}/> */}
        </AdminLayout>
    )
}



const ExpandedDataTable = ({products}) => {
    console.log(products)
    return (
        <div className="p-4">
            <p className="font-semibold mb-3 ">Προϊόντα συσχετισμένα με impa:</p>
            <DataTable dataKey="_id" value={products}>
                <Column field="name" header="Προϊόν"></Column>
        </DataTable>
        </div>
    )
}
export default Impas;
