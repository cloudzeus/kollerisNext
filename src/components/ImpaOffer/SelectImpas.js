import React, { lazy } from 'react'
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedImpa } from '@/features/impaofferSlice';

const SelectImpa = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const {selectedImpa} = useSelector(state => state.impaoffer)
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
        if(searchTerm.greek === '' && searchTerm.english === '' && searchTerm.code === '') {
            setLoading(true)
        }
        const res = await axios.post('/api/product/apiImpa', { action: action, skip: lazyState.first, limit: lazyState.rows, searchTerm: searchTerm })
        setData(res.data.result)
        setTotalRecords(res.data.totalRecords)
        setLoading(false)
    }

   
    useEffect(() => {
        if(searchTerm.greek)  handleFetch('searchGreekImpa');
        if(searchTerm.english)  handleFetch('searchEng');
        if(searchTerm.code)  handleFetch('searchCode');
        if(searchTerm.greek === '' && searchTerm.english === '' && searchTerm.code === '') handleFetch('findImpaBatch')
    }, [searchTerm, lazyState.rows, lazyState.first])




 



    // const showSuccess = () => {
    //     toast.current.show({severity:'success', summary: 'Success', detail:'Impa update ολοκληρώθηκε', life: 3000});
    // }

    // const showError = () => {
    //     toast.current.show({severity:'error', summary: 'Error', detail:'Ιmpa update δεν ολοκληρώθηκε', life: 3000});
    // }
    const onPage = (event) => {
        setlazyState(event);
    };

    const searchGreekName = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.greek} onChange={(e) => setSearchTerm((prev) => ({...prev, greek: e.target.value }))}  />
                </span>
            </div>
        )
    }
    const searchEngName = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.english} onChange={(e) => setSearchTerm((prev) => ({...prev, english: e.target.value }))}  />
                </span>
            </div>
        )
    }
    const searchCode = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.code} onChange={(e) => setSearchTerm((prev) => ({...prev, code: e.target.value }))}   />
                </span>
            </div>
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex lg:no-wrap  sm:flex-wrap">
                <div className="">
                    <span className="p-input-icon-left mr-3 sm:w-full">
                        <i className="pi pi-search" />
                        <InputText  type="search" placeholder="Αναζήτηση" />
                    </span>
                </div>
              
            </div>

        );
    };
  

    const header = renderHeader();
    return (
        <div >

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
                onSelectionChange={(e) => dispatch(setSelectedImpa(e.value))}
                className='w-full'
                filterDisplay="row"
                
            >   
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="code" header="Code"  style={{ minWidth: '12rem' }}  filter filterElement={searchCode} showFilterMenu={false}/>
                <Column field="englishDescription" header="Περιγραφή" sortable style={{ minWidth: '12rem' }} filter filterElement={searchEngName} showFilterMenu={false} />
                <Column field="greekDescription" header="Ελλ. Περιγραφή" style={{ minWidth: '12rem' }} filter filterElement={searchGreekName} showFilterMenu={false}/>
            </DataTable>

        </div>
    )
}

export default SelectImpa