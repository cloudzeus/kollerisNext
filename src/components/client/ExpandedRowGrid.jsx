import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import StepHeader from '../StepHeader';
import ClientHolder from './ClientHolders';

const ExpandedRowGrid = ({data}) => {
    const [gridData, setGridData] = useState([]) 
    const [expandedRows, setExpandedRows] = useState(null)
    

    const handleFetch = async () => {
        let res = await axios.post('/api/singleOffer', { action: "findSingleOrder", TRDR: data?.TRDR })
        setGridData(res.data.result)
    }
    useEffect(() => {
        handleFetch()
    }, [])

   
    return (
        <div className="card p-5">
            <p className='mb-2 font-bold'>Προσφορές</p>
            <DataTable 
                value={gridData} 
                tableStyle={{ minWidth: '50rem' }}
                showGridlines
                // rowExpansionTemplate={rowExpansionTemplate}
                // expandedRows={expandedRows}
                // onRowToggle={(e) => setExpandedRows(e.data)}
                >
                <Column field="clientName" header="Code"></Column>
                <Column field="SALDOCNUM" header="Category"></Column>
                <Column field="status" header="Quantity"></Column>
                <Column field="createdAt" header="Quantity"></Column>
            </DataTable>
            <div className='mt-6 mb-8'>
            <p className='mb-2 font-bold'>Προσφορές Πολλαπλών Επιλογών</p>
            <ClientHolder NAME={data?.NAME} />

            </div>
        </div>
    )
}


export default ExpandedRowGrid