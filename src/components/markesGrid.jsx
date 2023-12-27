import React, { useRef, useState, useEffect } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { InputText } from "primereact/inputtext";

export default function MarkesOverlay({ supplierID, setRefetch }) {
    const op = useRef(null);
    console.log('supplierID', supplierID)


    return (
        <div className="">
            <Button label="Προσθήκη Μάρκας" icon="pi pi-plus" severity="secondary" className='mb-2' onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op}>
                <MarkesGrid supplierID={supplierID} />
            </OverlayPanel>
        </div>
    );
}





const MarkesGrid = ({ supplierID }) => {
    const [state, setState] = useState({
        data: [],
        totalRecords: 0,
        loading: false,
        selected: [],
        first: 0,
        rows: 5,
        searchBrand: ''
    })


    const handleFetch = async () => {
        setState({ ...state, loading: true })
        const { data } = await axios.post('/api/product/apiMarkes', { 
            action: "findBrandName", 
            skip: state.first, 
            limit: state.rows,
            searchBrand: state.searchBrand
        })
        setState({ ...state, data: data.result, totalRecords: data.totalRecords, loading: false })
    }

    const handleSelected = (e) => {
        setState(prev => ({ ...prev, selected: e.value }))
    }
    


    useEffect(() => {
        console.log('state')
        console.log(state.searchBrand)
    }, [state])


    useEffect(() => {
        handleFetch();
    }, [state.rows, state.first, state.searchBrand])



    const onPage = (event) => {
        setState({ ...state, first: event.first, rows: event.rows });
    };


    const handleSubmit = async () => {
        const { data } = await axios.post('/api/product/apiMarkes',
            {
                action: "relateBrandsToSupplier",
                supplierID: supplierID,
                brands: state.selected
            })
        setRefetch(prev => !prev)
        console.log(data)
    }

    const Footer = () => {
        return (
            <div>
                <Button onClick={handleSubmit} disabled={!state.selected.length} label="Προσθήκη" icon="pi pi-plus" severity="secondary" className='mb-2' />
            </div>
        )
    }

    const handleSearch = (e) => {
        setState(prev => ({ ...prev, searchBrand: e.target.value }))

    }
    return (
        <>
            <span className="p-input-icon-left mb-2">
                <i className="pi pi-search" />
                <InputText placeholder="Search" value={state.searchBrand} onChange={handleSearch} />
            </span>
            <DataTable
                loading={state.loading}
                lazy
                totalRecords={state.totalRecords}
                onPage={onPage}
                value={state.data}
                selectionMode="multiple"
                paginator
                footer={Footer}
                rows={state.rows}
                selection={state.selected}
                onSelectionChange={handleSelected}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="softOne.NAME" header="Name" sortable style={{ minWidth: '12rem' }} />
            </DataTable>
        </>
    )

}