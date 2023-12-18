import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import Link from 'next/link';
import StepHeader from '@/components/StepHeader';
import CreatedAt from '@/components/grid/CreatedAt';

export const Saved = () => {
    const [state, setState] = useState({
        catalogs: [],
        loading: false,
        submitted: false,
        totalRecords: 0,
        rows: 10,
        first: 0,
    })
    const handleFetch = async () => {
        setState(prev => ({ ...prev, loading: true }))
        let { data } = await axios.post('/api/saveCatalog', { action: 'findAll', limit: state.rows, skip: state.first})
        console.log(data.result)
        setState(prev => ({ 
            ...prev, 
            catalogs: data.result, 
            totalRecords: data.totalRecords, 
            loading: false,
        }))
    }

    useEffect(() => {
        handleFetch()
    }, [state.submitted, state.rows, state.first])

    const onPage = (e) => {
        setState(prev => ({ ...prev, rows: e.rows, first: e.first }))
    }

    const Actions  = ({catalogName, _id, name}) => {
        const onDelete = async () => {
            let {data} = await axios.post('/api/saveCatalog', {action: 'deleteCatalog',catalogName: catalogName, id: _id})
            setState(prev => ({ ...prev, submitted: !prev.submitted }))
            
        }
        return (
            <div>
                <Link href={`https://kolleris.b-cdn.net/catalogs/${name}`}>
                <i className="pi pi-download mr-2  mr-3"></i>
               </Link>
                <i className="pi pi-trash mr-2 text-red-500 mr-1 cursor-pointer" onClick={onDelete}></i>
            </div>
        )
    
    }
    
    const Created = ({createdAt}) => {
        return (
            <CreatedAt createdAt={createdAt} />
        )
    }

    return (
            <div>
                <StepHeader text="Κατάλογοι" />
                <DataTable
                    lazy
                    onPage={onPage}
                    first={state.first}
                    rows={state.rows}
                    loading={state.loading}
                    paginator
                    rowsPerPageOptions={[20, 50, 100, 200]}
                    value={state.catalogs}
                    tableStyle={{ minWidth: '50rem' }}>
                        {/* <Column header="Μάρκα" field="brand" /> */}
                        <Column header="Κατάλογος" field="name" />
                        <Column header="Μάρκα" field="brand.softOne.NAME" />
                        <Column header="Ημερομηνία" field="createdAt" body={Created} />
                        <Column body={Actions} style={{ textAlign: 'end' }} />
                </DataTable>
            </div>
    )
}



export default Saved;