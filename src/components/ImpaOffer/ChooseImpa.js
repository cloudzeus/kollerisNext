import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedImpa } from '@/features/impaofferSlice';
import StepHeader from './StepHeader';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

const ChooseImpa = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const [showTable, setShowTable] = useState(false)
    const [searchTerm, setSearchTerm] = useState({
        code: '',
        english: '',
        greek: '',
    })

    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });


    const handleFetch = async (action) => {
        if (searchTerm.greek === '' && searchTerm.english === '' && searchTerm.code === '') {
            setLoading(true)
        }
        const res = await axios.post('/api/createOffer', {
            action: action,
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
        })

        setData(res.data.result)
        setTotalRecords(res.data.totalRecords)
        setLoading(false)
    }


    useEffect(() => {
        if (searchTerm.greek) handleFetch('searchGreekImpa');
        if (searchTerm.english) handleFetch('searchEng');
        if (searchTerm.code) handleFetch('searchCode');
        if (searchTerm.greek === '' && searchTerm.english === '' && searchTerm.code === '') handleFetch('findImpaBatch')
    }, [searchTerm, lazyState.rows, lazyState.first, ])



    const onPage = (event) => {
        setlazyState(event);
    };

    const searchGreekName = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.greek} onChange={(e) => setSearchTerm((prev) => ({ ...prev, greek: e.target.value }))} />
                </span>
            </div>
        )
    }
    const searchEngName = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.english} onChange={(e) => setSearchTerm((prev) => ({ ...prev, english: e.target.value }))} />
                </span>
            </div>
        )
    }
    const searchCode = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.code} onChange={(e) => setSearchTerm((prev) => ({ ...prev, code: e.target.value }))} />
                </span>
            </div>
        )
    }

   

    const onSelectionChange = (e) => {
        dispatch(setSelectedImpa(e.value))
        setShowTable(false)
    }
    return (
        <div className='mt-4' >
            <StepHeader text={"Βήμα 2"} />
            <CustomToolbar setState={setShowTable} />
            {showTable ? (
                <DataTable
                    first={lazyState.first}
                    lazy
                    onPage={onPage}
                    loading={loading}
                    value={data}
                    selectionMode="single"
                    paginator
                    totalRecords={totalRecords}
                    rows={lazyState.rows}
                    rowsPerPageOptions={[10, 20, 30]}
                    selection={selectedImpa}
                    onSelectionChange={onSelectionChange}
                    className='w-full'
                    filterDisplay="row"

                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="code" header="Code" style={{ minWidth: '12rem' }} filter filterElement={searchCode} showFilterMenu={false} />
                    <Column field="englishDescription" header="Περιγραφή" sortable style={{ minWidth: '12rem' }} filter filterElement={searchEngName} showFilterMenu={false} />
                    <Column field="greekDescription" header="Ελλ. Περιγραφή" style={{ minWidth: '12rem' }} filter filterElement={searchGreekName} showFilterMenu={false} />
                </DataTable>
            ) : null}

        </div>
    )
}


const CustomToolbar = ({ setState }) => {
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const StartContent = () => {
        return (
            <div className='w-full flex justify-content-between '>
                <Button severity='secondary' label="Επιλογή Impa" onClick={() => setState(prev => !prev)} />
            </div>
        )
    }

    const EndContent = () => {
        return (
            <div className='mr-5 w-15rem'>
                <p className='font-bold text-lg'>ΣΤΟΙΧΕΙΑ IMPA:</p>
                <p>{selectedImpa?.englishDescription}</p>
                <p>{selectedImpa?.code}</p>
            </div>
        )
    }

    return (
        <Toolbar start={StartContent} end={EndContent} />
    )
}

export default ChooseImpa;