'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedProducts, setSearchTerm, } from '@/features/supplierOrderSlice';
import { Toast } from 'primereact/toast';
import FilterMTRMARK from './FilterMTRMARK';
import StepHeader from '../ImpaOffer/StepHeader';
import { useRouter } from 'next/router';



const ChooseProducts = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { selectedProducts, selectedMarkes, searchTerm } = useSelector(state => state.supplierOrder)
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
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
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    const Search = () => {
        return (
            <>
                {selectedMarkes ? (
                     <div className="flex justify-content-start w-20rem ">
                     <span className="p-input-icon-left w-full">
                         <i className="pi pi-search " />
                         <InputText value={searchTerm} placeholder='Αναζήτηση Προϊόντος' onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
                     </span>
                 </div>
                ) : null}
            </>
        )
    }
 

    return (
        <>      
            <StepHeader text="Επιλογή Προϊόντων" />
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
                    className='border-1 border-round-sm	border-50 mt-4'
                    size="small"
                    filterDisplay="row"
                    id={'_id'}

                >
                    <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
                    <Column field="brandName" filter showFilterMenu={false} filterElement={FilterMTRMARK} header="Όνομα Μάρκας"></Column>
                    <Column field="NAME" filter showFilterMenu={false} filterElement={Search} header="Όνομα Πελάτη"></Column>
                </DataTable>
                <div className='mt-3'>
                        <Button  severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
                        <Button className='ml-2'disabled={selectedProducts.length == 0 ? true : false} severity='success' icon="pi pi-arrow-right" onClick={() => router.push('/dashboard/supplierOrder/chosenProducts')} />
                    </div>
          
        </>
    )
}




export default  ChooseProducts ;