import React, { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import * as xlsx from 'xlsx';



const Saved = () => {
    const [catalogs, setCatalogs] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/saveCatalog', { action: 'findAll' })
        setCatalogs(data.result)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch()
    }, [submitted])





    return (
        <AdminLayout>
            <div>
                <DataTable
                    loading={loading}
                    paginator
                    rows={20} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={catalogs}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column header="Τιμοκατάλογοι" field="url" />
                    <Column body={({url}) => <ActionTemplate url={url} setSubmitted={setSubmitted} />} style={{ textAlign: 'end' }} />
                </DataTable>
            </div>
        </AdminLayout>
    )
}


const ActionTemplate = ({ url, setSubmitted}) => {
    const [savedfile, setSavedFile] = useState('')


    const readCSV = async () => {
        try {
            const response = await fetch(`/uploads/${url}`);
            if (!response.ok) throw new Error("Failed to fetch the file.");

            const blob = await response.blob();

            const reader = new FileReader();

            reader.onload = function (event) {
                const binary = event.target.result;
                const workbook = xlsx.read(binary, { type: 'binary' });
                const sheetNameList = workbook.SheetNames;
                const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
                console.log(data)
            };

            reader.readAsBinaryString(blob);
        } catch (error) {
            console.error("Error reading the file:", error);
        }
    };

    const download = async () => {
        try {
            // Fetch the file from the public directory
            const response = await fetch(`/uploads/${url}`);
            if (!response.ok) throw new Error("Failed to fetch the file.");
            const reader = new FileReader()
            const blob = await response.blob();
           
            reader.readAsBinaryString(blob);
      ;
            reader.onload = function (event) {
                const binary = event.target.result;
                const workbook = xlsx.read(binary, { type: 'binary' });
          
                let saveFile = xlsx.writeFile( workbook, 'test2.xlsx')
                setSavedFile(saveFile)
            };

            reader.readAsBinaryString(blob);
        } catch (error) {
            console.error("Error reading the file:", error);
        }
    };

    const onDelete = async () => {
        console.log(url)
        let {data} = await axios.post('/api/saveCatalog', {url: url, action: 'delete'})
        setSubmitted(true)
        
    }
    return (
        <div>
            <Button icon="pi pi-download" className="p-button-warning" onClick={download} />
            <Button icon="pi  pi-trash" text className="p-button-danger" onClick={onDelete}  />
        </div>
    )
}
export default Saved;