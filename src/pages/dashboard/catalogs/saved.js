import React, { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import * as xlsx from 'xlsx';
import CreatedAt from '@/components/grid/CreatedAt';
import Link from 'next/link';
import StepHeader from '@/components/StepHeader';


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



    const Actions  = ({catalogName, TRDR, _id}) => {
        const onDelete = async () => {
            let {data} = await axios.post('/api/saveCatalog', {action: 'delete',catalogName: catalogName,  TRDR: TRDR, id: _id})
            setSubmitted(true)
            
        }
        return (
            <div>
                <Link href={`https://kolleris.b-cdn.net/catalogs/${catalogName}`}>
                <i className="pi pi-download mr-2  mr-3"></i>
               </Link>
                <i className="pi pi-trash mr-2 text-red-500 mr-1 cursor-pointer" onClick={onDelete}></i>
            </div>
        )
    }

    return (
        <AdminLayout>
            <div>
                <StepHeader text="Κατάλογοι" />
                <DataTable
                    loading={loading}
                    paginator
                    rows={20} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={catalogs}
                    tableStyle={{ minWidth: '50rem' }}>
                        <Column header="Όνομα Προμηθευτή" field="NAME" />
                        <Column header="Κατάλογος" field="catalogName" />
                        <Column body={Actions} style={{ textAlign: 'end' }} />
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