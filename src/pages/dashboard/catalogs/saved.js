import React, { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import * as xlsx from 'xlsx';


const readCSV = async (filenameArr) => {
    try {
        const response = await fetch(`/uploads/${filename}`);
        if (!response.ok) throw new Error("Failed to fetch the file.");

        const blob = await response.blob();

        const reader = new FileReader();

        reader.onload = function (event) {
            const binary = event.target.result;
            const workbook = xlsx.read(binary, { type: 'binary' });

            const sheetNameList = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
        };

        reader.readAsBinaryString(blob);
    } catch (error) {
        console.error("Error reading the file:", error);
    }
};


const Saved = () => {
    const [catalogs, setCatalogs] = useState([])


    const handleFetch = async () => {
        let { data } = await axios.post('/api/saveCatalog', { action: 'findAll' })
        setCatalogs(data.result)
    }

    useEffect(() => {
        handleFetch()
    }, [])





    return (
        <AdminLayout>
            <div>
                <DataTable

                    paginator
                    rows={20} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={catalogs}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column header="this" field="url" />
                    <Column body={ActionTemplate} style={{ textAlign: 'end' }} />
                </DataTable>
            </div>
        </AdminLayout>
    )
}


const ActionTemplate = ({ url }) => {
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
    return (
        <div>
            <Button icon="pi pi-download" className="p-button-warning" onClick={download} />
            <Button icon="pi pi-info" className="p-button-primary ml-3" onClick={readCSV} />
        </div>
    )
}
export default Saved;