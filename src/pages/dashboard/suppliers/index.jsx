import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { EditDialog, AddDialog } from '@/GridDialogs/supplierDialog';
import { setGridRowData } from '@/features/grid/gridSlice';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useSelector } from 'react-redux';
import { setSelectedSupplier } from '@/features/supplierOrderSlice';


export default function Page() {
    const op = useRef(null);
    const { selectedSupplier,  inputEmail, mtrl } = useSelector(state => state.supplierOrder)

    const router = useRouter();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0)
    const [data, setData] = useState([])
    const toast = useRef(null);
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sortOffers, setSortOffers] = useState(0)
    const [searchTerm, setSearchTerm] = useState({
        name: '',
        afm: '',
        address: '',
        phone01: '',
        phone02: '',
        email: ''
    })
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 50,
        page: 1,
    });


    const onPage = (event) => {
        setlazyState(event);
    };


    const fetchClients = async () => {
        const isAnyFieldNotEmpty = Object.values(searchTerm).some(value => value == '');
        if (isAnyFieldNotEmpty) {
            setLoading(true)
        }
       
        let { data } = await axios.post('/api/suppliers', {
            action: "fetchAll",
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm,
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
        searchTerm,
        submitted,
        sortOffers
    ])



   


  
    //Add product
    const openNew = () => {
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
    };



   



    const SearchName = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.name} onChange={(e) => setSearchTerm(prev => ({ ...prev, name: e.target.value }))} />
                </span>
            </div>
        )
    }

    const SearchAFM = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.afm} onChange={(e) => setSearchTerm(prev => ({ ...prev, afm: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchΑddress = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.address} onChange={(e) => setSearchTerm(prev => ({ ...prev, address: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchPhone01 = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone01} onChange={(e) => setSearchTerm(prev => ({ ...prev, phone01: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchPhone02 = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone02} onChange={(e) => setSearchTerm(prev => ({ ...prev, phone02: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchEmail = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.email} onChange={(e) => setSearchTerm(prev => ({ ...prev, email: e.target.value }))} />
                </span>
            </div>
        )
    }

   


    // const ShowOffers = ({ OFFERSTATUS, NAME }) => {
        
    //     const handleClick = () => {
    //         const encodedString = encodeURIComponent(NAME);
    //         router.push(`/dashboard/clients/offers/${encodedString}`)
    //     }
    //     if (OFFERSTATUS) {
    //         return (
    //             <div className='flex cursor-pointer align-items-center justify-content-center p-0' onClick={handleClick}>
    //                 <div className={`bg-green-600  border-round mr-1 mt-1 `} style={{ width: '4px', height: '4px' }}></div>
    //                 <span className='font-xm text-600' style={{fontSize: '10px'}}>OFFERS</span>

    //             </div>
    //         )
    //     }
        

    // }

    //EDIT TEMPALTE AND HANDLER
    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    const newOrder = async (supplier) => {
        dispatch(setSelectedSupplier(supplier))
        router.push('/dashboard/supplierOrder/chooseProducts')
    }
    const ActionTemplate = (rowData) => {
        return (
            <div className='flex align-items-center justify-content-center'>
            <i className="pi pi-cog mr-2 cursor-pointer text-primary" style={{fontSize: '12px'}} onClick={(e) => op.current.toggle(e)}></i>
            <OverlayPanel ref={op}>
                <div className='flex flex-column'>
                <Button label="Διαμόρφωση Προμηθευτή" icon="pi pi-pencil" className='w-full mb-2' onClick={() => editProduct(rowData)} />
                <Button disabled={rowData?.ORDERSTATUS} label="ΝΕΑ Παραγγελία" severity='success' icon="pi pi-plus" className='w-full mb-2' onClick={() => newOrder(rowData)} />
                </div>
            </OverlayPanel>
            {/* <i className="pi pi-pencil mr-2 cursor-pointer text-500" style={{fontSize: '12px'}} onClick={() => editProduct(rowData)}></i> */}
        </div>
        )
    }

    const LeftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button disabled={true} label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        )
    }

    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Προμηθευτές" />
            <Toolbar start={LeftToolbarTemplate}></Toolbar>
            <DataTable
                lazy
                totalRecords={totalRecords}
                first={lazyState.first}
                onPage={onPage}
                rows={lazyState.rows}
                size="small"
                value={data}
                paginator
                rowsPerPageOptions={[50, 100, 200, 500]}
                dataKey="_id"
                paginatorRight={true}
                loading={loading}
                filterDisplay="row"
                showGridlines
            >   
                <Column body={ActionTemplate} bodyStyle={{textAlign: 'center'}} style={{width: '50px'}}></Column>
                <Column body={Offers} bodyStyle={{textAlign: 'center'}} style={{width: '50px'}}></Column>
                {/* <Column body={ShowOffers} filter showFilterMenu={false} filterElement={FilterOffers} style={{width: '40px'}}></Column> */}
                <Column field="NAME" filter showFilterMenu={false} filterElement={SearchName} header="Ονομα"></Column>
                <Column field="AFM" filter showFilterMenu={false} filterElement={SearchAFM} header="ΑΦΜ" ></Column>
                <Column field="ADDRESS" filter showFilterMenu={false} filterElement={SearchΑddress} header="Διεύθυνση" ></Column>
                <Column field="EMAIL" filter showFilterMenu={false} filterElement={SearchEmail} header="Email"></Column>
                <Column field="PHONE01" filter showFilterMenu={false} filterElement={ SearchPhone01} header="Τηλέφωνο" ></Column>
                <Column field="PHONE02" filter showFilterMenu={false} filterElement={SearchPhone02} header="Τηλέφωνο 2" ></Column>
                <Column field="ZIP" header="Ταχ.Κώδικας" ></Column>
                <Column field="updatedFrom" header="updatedFrom"  body={UpdatedFromTemplate} style={{ width: '90px' }}></Column>

            </DataTable>
            <EditDialog
                data={editData}
                setData={setEditData}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
            <AddDialog
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />

        </AdminLayout >
    );
}







const Offers = (rowData) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setSelectedSupplier(rowData))
    }, [])
    const router = useRouter()
    return (
        <div>
            <Button icon="pi pi-tag" onClick={() => router.push(`/dashboard/suppliers/order/${rowData.TRDR}`)} />
        </div>
    )
}





const UpdatedFromTemplate = ({ updatedFrom, updatedAt }) => {
    return (
        <RegisterUserActions
            actionFrom={updatedFrom}
            at={updatedAt}
            icon="pi pi-user"
            color="#fff"
            backgroundColor='var(--yellow-500)'
        />

    )
}





