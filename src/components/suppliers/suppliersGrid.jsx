import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedSupplier, setInputEmail } from '@/features/supplierOrderSlice';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import StepHeader from '../multiOffer/StepHeader';

const SuppliersGrid = () => {
    const router = useRouter();
    const { selectedSupplier,  inputEmail, mtrl } = useSelector(state => state.supplierOrder)
    const [showTable, setShowTable] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState({
        name: '',
        email: '',
        phone: '',
    })
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch()
    useEffect(() => {
       dispatch(setSelectedSupplier(null)) 
    }, [])
    const fetch = async (action) => {
        if(action == "fetchSuppliers") {
            setLoading(true)
        }
     
        let { data } = await axios.post('/api/supplier', {
            action: action,
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        if(action == "fetchSuppliers") {
            setLoading(false)
        }
     

    }

  
    useEffect(() => {
        if (searchTerm.name == '' && searchTerm.email == '' && searchTerm.phone == '') {
            fetch("fetchSuppliers");
        } else {
            fetch("search")
        }
    }, [searchTerm.name, searchTerm.phone, searchTerm.email, lazyState.rows, lazyState.first,])


  

    const onSelectionChange = (e) => {
        dispatch(setSelectedSupplier(e.value))
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
                    <InputText value={searchTerm.name} onChange={(e) => setSearchTerm(prev => ({...prev, name: e.target.value}))} />
                </span>
            </div>
        )
    }

    const SearchEmail = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.email} onChange={(e) => setSearchTerm(prev => ({...prev, email: e.target.value}))} />
                </span>
            </div>
        )
    }
    const SearchPhone = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone}  onChange={(e) => setSearchTerm(prev => ({...prev, phone: e.target.value}))} />
                </span>
            </div>
        )
    }

    


 
  
    return (
        <>
            <StepHeader text="Προμηθευτές" />
                <DataTable
                    value={data}
                    paginator
                    rows={lazyState.rows}
                    rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                    first={lazyState.first}
                    lazy
                    totalRecords={totalRecords}
                    onPage={onPage}
                    selectionMode={'radio'}
                    selection={selectedSupplier}
                    onSelectionChange={onSelectionChange}
                    loading={loading}
                    className='border-1 border-round-sm	border-50 mt-3'
                    size="small"
                    filterDisplay="row"
                    id={'_id'}
                    showGridlines
                >
                    <Column selectionMode="single" headerStyle={{ width: '30px' }}></Column>
                    <Column field="NAME" style={{width: '400px'}} filter showFilterMenu={false} filterElement={SearchClient} header="Όνομα Πελάτη"></Column>
                    <Column field="EMAIL"  style={{width: '500px'}} filter showFilterMenu={false} filterElement={SearchEmail} header="Email"></Column>
                    <Column field="PHONE01" style={{width: '200px'}} filter showFilterMenu={false} filterElement={SearchPhone} header="Τηλέφωνο"></Column>
                    <Column field="ADDRESS" header="Διεύθυνση"></Column>
                </DataTable>
        </>
    )
}






export default SuppliersGrid;