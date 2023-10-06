'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedProducts, setSearchTerm} from '@/features/supplierOrderSlice';
import { Toast } from 'primereact/toast';
import FilterMTRMARK from './FilterMTRMARK';
import { set } from 'mongoose';
const ChooseProductsWrapper = () => {
    const { selectedProducts, selectedSupplier } = useSelector(state => state.supplierOrder)
    return (
        <>
            {selectedSupplier ? (
                <ChooseProducts />
            ) : null}
        </>
    )
}


const ChooseProducts = () => {
    const dispatch = useDispatch()
    const { selectedProducts, selectedSupplier, selectedMarkes, searchTerm } = useSelector(state => state.supplierOrder)
    const [totalRecords, setTotalRecords] = useState(0);
    const [showTable, setShowTable] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    // const [searchTerm, setSearchTerm] = useState('')
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
  
 
    const fetch = async (action) => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', {
            action: action,
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm,
            mtrmark: selectedMarkes?.softOne?.MTRMARK
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }

 
    useEffect(() => {
        if (!selectedMarkes) {
            fetch('fetchProducts');
        }

        if(selectedMarkes) {
       
            fetch('searchBrand')
          
        }
       
    }, [selectedMarkes, lazyState.rows, lazyState.first, searchTerm])

    useEffect(() => {
        setlazyState(prev => ({...prev, first: 0}))
    }, [selectedMarkes])

    const onSelectionChange = (e) => {
        dispatch(setSelectedProducts(e.value))
        setShowTable(false)
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    const Search = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm} placeholder='Αναζήτηση Προϊόντος' onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
                </span>
            </div>
        )
    }

    const Footer = () => {
        return (
            <Button label="Συνέχεια" />
        )
    }


    return (
        <>
            <div className='mt-3 mb-2'>
                <Button severity='warning' label="Επιλογή Προϊόντων" onClick={() => setShowTable(prev => !prev)} />
            </div>
            {showTable ? (
                <DataTable
                    value={data}
                    paginator
                    rows={lazyState.rows}
                    rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                    first={lazyState.first}
                    lazy
                    totalRecords={totalRecords}
                    onPage={onPage}
                    selectionMode={'checkbox'}
                    selection={selectedProducts}
                    onSelectionChange={onSelectionChange}
                    loading={loading}
                    className='border-1 border-round-sm	border-50 mt-2'
                    size="small"
                    filterDisplay="row"
                    id={'_id'}
                    footer={Footer}

                >
                    <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
                    <Column field="NAME" filter showFilterMenu={false} filterElement={Search} header="Όνομα Πελάτη"></Column>
                    <Column field="brandName" filter showFilterMenu={false} filterElement={FilterMTRMARK} header="Όνομα Πελάτη"></Column>
                </DataTable>
            ) : null}
            {/* {selectedSupplier ? (
                <SupplierDetails selectedSupplier={selectedSupplier} />
            ) : null} */}
        </>
    )
}




export default ChooseProductsWrapper;