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
import ExpandedRowGrid from '@/components/client/ExpandedRowGrid';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { EditDialog, AddDialog } from '@/GridDialogs/clientDialog';
import { setGridRowData } from '@/features/grid/gridSlice';
import { Dropdown } from 'primereact/dropdown';
import { set } from 'mongoose';
export default function Clients() {
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
        setLoading(true)
        let { data } = await axios.post('/api/clients/apiClients', {
            action: "fetchAll",
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm,
            sortOffers: sortOffers
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



    const renderHeader = () => {

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
            </span>
        );
    };
    const header = renderHeader();



    const SearchClient = () => {
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

    const FilterOffers = () => {
        console.log(sortOffers)
       const onSort = () => {
        setSortOffers(prev => {
            if(prev === 0) return 1;
            if(prev === 1) return -1;
            if(prev === -1) return 0;
        })
       }
        
        return (
            <div>
                {/* <Dropdown value={selectedFilterOffer} onChange={(e) => setSelectedFilterOffer(e.value)} options={options} optionLabel="name" 
                placeholder="Επιλογή Φίλτρου" className="w-full md:w-14rem" /> */}
                  <div className='ml-3'>
                    {sortOffers === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
                    {sortOffers === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
                    {sortOffers === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
                </div>
            </div>
        )
    }


    const ShowOffers = ({ OFFERSTATUS, NAME }) => {
        const handleClick = () => {
            const encodedString = encodeURIComponent(NAME);
            router.push(`/dashboard/clients/offers/${encodedString}`)
        }
        if (OFFERSTATUS) {
            return (
                <div className='flex cursor-pointer align-items-center justify-content-center p-0' onClick={handleClick}>
                    <div className={`bg-green-600  border-round mr-1 mt-1 `} style={{ width: '4px', height: '4px' }}></div>
                    <span className='font-xm text-500'>OFFERS</span>

                </div>
            )
        }

    }

    //EDIT TEMPALTE AND HANDLER
    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    const ActionTemplate = (rowData) => {
        return (
            <div className='flex align-items-center'>
                <i className="pi pi-pencil mr-2 cursor-pointer text-500" style={{fontSize: '12px'}} onClick={() => editProduct(rowData)}></i>
            </div>
        )
    }

    const LeftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        )
    }

    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Πελάτες" />
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
             <Column body={ActionTemplate} bodyStyle={{textAlign: 'center'}}></Column>
                <Column body={ShowOffers} filter showFilterMenu={false} filterElement={FilterOffers}></Column>
                <Column field="NAME" filter showFilterMenu={false} filterElement={SearchClient} header="Ονομα"></Column>
                <Column field="AFM" filter showFilterMenu={false} filterElement={SearchAFM} header="ΑΦΜ" ></Column>
                <Column field="ADDRESS" filter showFilterMenu={false} filterElement={SearchΑddress} header="Διεύθυνση" ></Column>
                <Column field="EMAIL" filter showFilterMenu={false} filterElement={SearchEmail} header="Email"></Column>
                <Column field="PHONE01" filter showFilterMenu={false} filterElement={ SearchPhone01} header="Τηλέφωνο" ></Column>
                <Column field="PHONE02" filter showFilterMenu={false} filterElement={SearchPhone02} header="Τηλέφωνο 2" ></Column>
                <Column field="ZIP" header="Ταχ.Κώδικας" ></Column>
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



















