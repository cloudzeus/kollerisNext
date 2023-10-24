'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedClient } from '@/features/impaofferSlice';
import { InputText } from 'primereact/inputtext';

const CustomersGrid = () => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState({
        name: '',
        afm: '',
        address: '',
        phone: ''
    })
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });

    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch()

    const fetchClients = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/clients/apiClients', {
            action: "fetchAll",
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }


    useEffect(() => {
         fetchClients();
     }, [
        lazyState.rows, 
        lazyState.first, 
        searchTerm
    ])



    const onSelectionChange = (e) => {
        dispatch(setSelectedClient(e.value))
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    const SearchClient = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.name} onChange={(e) => setSearchTerm(prev => ({...prev, name: e.target.value}))} />
                </span>
            </div>
        )
    }
    
    const SearchAFM = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.afm} onChange={(e) => setSearchTerm(prev => ({...prev, afm: e.target.value}))} />
                </span>
            </div>
        )
    }
    const SearchΑddress = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.address} onChange={(e) => setSearchTerm(prev => ({...prev, address: e.target.value}))} />
                </span>
            </div>
        )
    }
    const SearchPhone = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone} onChange={(e) => setSearchTerm(prev => ({...prev, phone: e.target.value}))} />
                </span>
            </div>
        )
    }

    return (
        <DataTable
            paginator
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
            first={lazyState.first}
            lazy
            totalRecords={totalRecords}
            onPage={onPage}
            selectionMode={'radio'}
            selection={selectedClient}
            onSelectionChange={onSelectionChange}
            value={data}
            className='border-1 border-round-sm	border-50 mt-2'
            size="small"
            filterDisplay="row"

        >
            <Column selectionMode="single" headerStyle={{ maxWidth: '200px' }}></Column>
            <Column field="NAME" style={{maxWidth: '350px'}} filter showFilterMenu={false} filterElement={SearchClient} header="Όνομα Πελάτη"></Column>
            <Column field="EMAIL" style={{maxWidth: '350px'}}  header="Email"></Column>
            <Column field="PHONE01" filter showFilterMenu={false} filterElement={SearchPhone} header="Τηλέφωνο"></Column>
            <Column field="ADDRESS" filter showFilterMenu={false} filterElement={SearchΑddress} header="Διεύθυνση"></Column>
            <Column field="AFM" style={{width: '120px'}} filter showFilterMenu={false} filterElement={SearchAFM} header="ΑΦΜ"></Column>
        </DataTable>
    )
}




export default CustomersGrid;