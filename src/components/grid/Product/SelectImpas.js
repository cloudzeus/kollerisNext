import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ProductQuantityProvider, ProductQuantityContext } from '@/_context/ProductGridContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedImpa, setDataSource, setShowImpaTable } from '@/features/impaofferSlice';

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
        const res = await axios.post('/api/product/apiImpa', {
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
        if (searchTerm.greek === '' && searchTerm.english === '' && searchTerm.code === '') handleFetch('findAll')
    }, [searchTerm, lazyState.rows, lazyState.first,])



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
            <div className="flex justify-content-start">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText className='w-full' value={searchTerm.code} onChange={(e) => setSearchTerm((prev) => ({ ...prev, code: e.target.value }))} />
                </span>
            </div>
        )
    }



    const onSelectionChange = (e) => {
        dispatch(setSelectedImpa(e.value))
       
        setShowTable(false)
        dispatch(setShowImpaTable(false))
        dispatch(setDataSource(1))
    }
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
                onSelectionChange={onSelectionChange}
                className='w-full'
                filterDisplay="row"

            >
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="code" header="Code"  filter filterElement={searchCode} showFilterMenu={false} />
                <Column field="englishDescription" header="Περιγραφή" sortable style={{ minWidth: '12rem' }} filter filterElement={searchEngName} showFilterMenu={false} />
                <Column field="greekDescription" header="Ελλ. Περιγραφή" style={{ minWidth: '12rem' }} filter filterElement={searchGreekName} showFilterMenu={false} />
            </DataTable>

        </div>
    )
}



 const SelectImpas = () => {
    const {selectedProducts, setSubmitted} = useContext( ProductQuantityContext)
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch();

    const toast = useRef(null);



    const handleImpaSubmit = async () => {
        let response = await axios.post('/api/product/apiImpa', { action: 'correlateImpa', id: selectedImpa._id, dataToUpdate: selectedProducts })
        if(!response.data.success) {
            showError()
        }
        showSuccess();
        setSubmitted(true)
    }

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Impa update ολοκληρώθηκε', life: 3000});
    }

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Ιmpa update δεν ολοκληρώθηκε', life: 3000});
    }

    return (
        <div >
            <Toast ref={toast} />
            {selectedImpa ? (
                <>  
                    <div>
                        <Button label="Επίλεξε ξανά" onClick={() => dispatch(setSelectedImpa(null))}/>
                    </div>
                    <div className='surface-100	 p-3 mt-2'>

                        <p className='font-bold  mb-1'>Στοιχεία Αλλαγής:</p>
                        <div>
                            <p className='font-semibold mt-2 '>Περιγραφή:</p>
                            <p>{selectedImpa?.englishDescription}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='font-semibold mt-2 '>Κωδικός:</p>
                            <p>{selectedImpa?.code}</p>
                        </div>
                        <Button severity='warning' label="Αλλαγή Impa" onClick={handleImpaSubmit} />
                    </div>
                </>

            ) : (
                <ChooseImpa />
            )}

        </div>
    )
}

export default SelectImpas