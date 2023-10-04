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

const ChooseCustomer = () => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const [showTable, setShowTable] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch()

    console.log('search term')
    console.log(searchTerm)
    const fetchClients = async (action) => {
        setLoading(true)
        let { data } = await axios.post('/api/createOffer', {
            action: action,
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }

    useEffect(() => {
        fetchClients("searchClients");
    }, [searchTerm])


    useEffect(() => {
        fetchClients("findClients");
    }, [lazyState.rows, lazyState.first, ])


    const onSelectionChange = (e) => {
        dispatch(setSelectedClient(e.value))
        setShowTable(false)
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    const SearchClient = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </span>
            </div>
        )
    }

    return (
        <>  
            
            <div className='w-full flex justify-content-between '>
                <Button severity='secondary' label="Επιλογή Πελάτη" onClick={() => setShowTable(prev => !prev)} />
            </div>
            {showTable ? (
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
                    <Column selectionMode="single" headerStyle={{width: '30px'}}></Column>
                    <Column field="NAME"  filter showFilterMenu={false}  filterElement={SearchClient}  header="Όνομα Πελάτη"></Column>
                </DataTable>
            ) : null}

        </>
    )
}


export default ChooseCustomer