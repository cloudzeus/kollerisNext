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
import StepHeader from '../ImpaOffer/StepHeader';

const ChooseSupplier = () => {
    const router = useRouter();
    const { selectedSupplier,  inputEmail, mtrl } = useSelector(state => state.supplierOrder)
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
    useEffect(() => {
       dispatch(setSelectedSupplier(null)) 
    }, [])
    const fetch = async (action) => {
     
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', {
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
        if (searchTerm == '') {
            fetch("fetchSuppliers");
        } else {
            fetch("searchSupplier")
        }
    }, [searchTerm, lazyState.rows, lazyState.first,])


  

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
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </span>
            </div>
        )
    }

  
    return (
        <>
            <StepHeader text="Επιλογή Προμηθεύτή" />
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
                >
                    <Column selectionMode="single" headerStyle={{ width: '30px' }}></Column>
                    <Column field="NAME" filter showFilterMenu={false} filterElement={SearchClient} header="Όνομα Πελάτη"></Column>
                    <Column field="EMAIL" header="Email"></Column>
                </DataTable>
         
            {selectedSupplier ? (
                <>
                    <SupplierDetails selectedSupplier={selectedSupplier} />
                    <div className='mt-3'>
                        <Button label="Eπόμενο" disabled={inputEmail !== '' ? false : true} severity='success' icon="pi pi-arrow-right" onClick={() => router.push('/dashboard/supplierOrder/chooseProducts')} />
                    </div>
                </>

            ) : null}
        </>
    )
}




const SupplierDetails = ({ selectedSupplier }) => {
    const [editEmail, setEditEmail] = useState(false)
    const toast = useRef(null);
    const { inputEmail } = useSelector(state => state.supplierOrder)
    const dispatch = useDispatch();

    const showSuccess = () => {
        toast.current.show({ severity: 'success', detail: 'Eπιτυχής αλλαγή email', life: 3000 });
    }


    const showWarn = () => {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Αποτυχημένη αλλαγή email', life: 3000 });
    }


    const handleEmail = (e) => {
        dispatch(setInputEmail(e.target.value))
    }

    const onSubmitEmail = async () => {
        let { data } = await axios.post('/api/createOrder', { action: "saveNewEmail", id: selectedSupplier._id, email: inputEmail })
        if (data.success) {
            showSuccess()
            setEditEmail((prev) => !prev)
        } else {
            showWarn()
        }
    }

    useEffect(() => {
        if (!selectedSupplier) return;
        dispatch(setInputEmail(selectedSupplier?.EMAIL || ""))
    }, [selectedSupplier])

    return (
        <div className='mt-3 bg-white p-4 border-round'>
            <Toast ref={toast} />
            <p className="font-bold mb-3 text-lg">Στοιχεία Προμηθευτή</p>
            <div className="flex flex-column gap-2 mb-4">
                <label htmlFor="username">Όνομα:</label>
                <InputText
                    className='opacity-80 w-20rem'
                    disabled={true}
                    value={selectedSupplier?.NAME}
                    id="username"
                    aria-describedby="username-help"
                />
            </div>
            <label className='mb-2 block' htmlFor="username">Email: </label>
            <div className="flex gap-2">
                <InputText
                    disabled={!editEmail}
                    onChange={handleEmail}
                    className={`w-20rem ${!editEmail && "opacity-80"}`}
                    value={inputEmail}
                    id="username"
                    aria-describedby="username-help"
                />
                {!editEmail ? (
                    <Button
                        onClick={() => { setEditEmail(prev => !prev) }}
                        icon={"pi pi-pencil"}
                        severity={"primary"}
                    />
                ) : (
                    <>
                        <div>
                            <Button
                                icon={"pi pi-check"}
                                severity={"success"}
                                onClick={onSubmitEmail}
                                className='mr-2'
                            />
                            <Button
                                icon={"pi pi-times"}
                                severity={"danger"}
                                onClick={() => setEditEmail(prev => !prev)}
                            />
                        </div>
                    </>

                )}


            </div>
        </div>
    )
}


export default ChooseSupplier