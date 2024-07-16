'use client';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {InputText} from 'primereact/inputtext';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedImpa, setDataSource, setShowImpaTable} from '@/features/impaofferSlice';
import {SearchAndSort} from "@/components/Forms/SearchAndSort";
import SearchInput from "@/components/Forms/SearchInput";


const ImpaGrid = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const {selectedImpa} = useSelector(state => state.impaoffer)
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
        const res = await axios.post('/api/product/apiImpa', {
            action: 'findAll',
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm,
            fetchActive: true,
        })

        setData(res.data.result)
        setTotalRecords(res.data.totalRecords)
        setLoading(false)
    }


    useEffect(() => {
        handleFetch()
    }, [searchTerm, lazyState.rows, lazyState.first,])


    const onPage = (event) => {
        setlazyState(event);
    };


    const handleSearchTerm = (name, value) => {
        setSearchTerm((prev) => ({...prev, [name]: value}))
    }


    const onSelectionChange = (e) => {
        dispatch(setSelectedImpa(e.value))

        setShowTable(false)
        dispatch(setShowImpaTable(false))
        dispatch(setDataSource(1))
    }
    return (
        <div>
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
                <Column selectionMode="single" headerStyle={{width: '3rem'}}></Column>
                <Column field="isActive" style={{width: '40px'}} header="isActive" body={IsActive}></Column>
                <Column
                    field="code"
                    header="Code"
                    filter
                    filterElement={() => (
                        <SearchInput
                            state={searchTerm.code}
                            handleSearch={(e) => handleSearchTerm('code', e.target.value)}
                        />
                    )} showFilterMenu={false}/>
                <Column
                    field="englishDescription"
                    header="Περιγραφή"
                    sortable
                    style={{minWidth: '12rem'}}
                    filter
                    filterElement={() => (
                        <SearchInput
                            state={searchTerm.english}
                            handleSearch={(e) => handleSearchTerm('english', e.target.value)}
                        />
                    )}
                    showFilterMenu={false}
                />
                <Column
                    field="greekDescription"
                    header="Ελλ. Περιγραφή"
                    style={{minWidth: '12rem'}}
                    filter
                    filterElement={() => (
                        <SearchInput
                            state={searchTerm.greek}
                            handleSearch={(e) => handleSearchTerm('greek', e.target.value)}
                        />
                    )}
                    showFilterMenu={false}
                />
            </DataTable>

        </div>
    )
}

const IsActive = ({isActive}) => {
    return (
        <div style={{width: '20px', height: '20px'}}
             className={`${isActive ? "bg-green-500" : "bg-red-500"} border-round flex align-items-center justify-content-center`}>
            {isActive ? <i className="pi pi-check text-white text-xs"></i> :
                <i className="pi pi-times text-white text-xs"></i>}
        </div>
    )
}


export default ImpaGrid;