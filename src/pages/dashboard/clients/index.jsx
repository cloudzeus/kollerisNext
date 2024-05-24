import React, {useState, useEffect, useRef, useReducer} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import {InputText} from 'primereact/inputtext';
import {useDispatch} from 'react-redux';
import {Toast} from 'primereact/toast';
import StepHeader from '@/components/StepHeader';
import {useRouter} from 'next/router';
import ExpandedRowGrid from '@/components/client/ExpandedRowGrid';
import {Toolbar} from 'primereact/toolbar';
import {Button} from 'primereact/button';
import {EditDialog, AddDialog} from '@/GridDialogs/clientDialog';
import {setGridRowData} from '@/features/grid/gridSlice';
import {OverlayPanel} from 'primereact/overlaypanel';
import SearchInput from "@/components/Forms/SearchInput";


export default function Clients() {
    const router = useRouter();
    const op = useRef(null);

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
        name: '', afm: '', address: '', phone01: '', phone02: '', email: ''
    })
    const [lazyState, setlazyState] = useState({
        first: 0, rows: 50, page: 1,
    });

    const onPage = (event) => {
        setlazyState(event);
    };


    const fetchClients = async () => {
        setLoading(true)
        try {
            let {data} = await axios.post('/api/clients/apiClients', {
                action: "fetchAll",
                skip: lazyState.first,
                limit: lazyState.rows,
                searchTerm: searchTerm,
                sortOffers: sortOffers
            })
            setData(data.result)
            setTotalRecords(data.totalRecords)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }


    }


    useEffect(() => {
        (async () => {
            await fetchClients();

        })()
    }, [lazyState.rows, lazyState.first, searchTerm, submitted, sortOffers])

    //Add product
    const openNew = () => {
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
    };

    const handleSearchTerm = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setSearchTerm(prev => ({...prev, [name]: value}))
    }


    //handle sort offers:
    const onSort = () => {
        setSortOffers(prev => {
            if (prev === 0) return 1;
            if (prev === 1) return -1;
            if (prev === -1) return 0;
        })
    }





    const ShowOffers = ({OFFERSTATUS, NAME, _id}) => {

        const handleClick = () => {
            const encodedString = encodeURIComponent(NAME);
            router.push(`/dashboard/clients/offers/${encodedString}`)
        }
        if (OFFERSTATUS) {
            return (<div className='flex cursor-pointer align-items-center justify-content-center p-0'
                         onClick={handleClick}>
                <div className={`bg-green-600  border-round mr-1 mt-1 `}
                     style={{width: '4px', height: '4px'}}></div>
                <span className='font-xm text-600' style={{fontSize: '10px'}}>OFFERS</span>

            </div>)
        }


    }

    //EDIT TEMPALTE AND HANDLER
    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    const ActionTemplate = (rowData) => {
        return (<div className='flex align-items-center'>
            <i className="pi pi-pencil mr-2 cursor-pointer text-500" style={{fontSize: '12px'}}
               onClick={() => editProduct(rowData)}></i>
        </div>)
    }

    const LeftToolbarTemplate = () => {
        return (<div className="flex flex-wrap gap-2">
            <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew}/>
        </div>)
    }

    return (<AdminLayout>
        <Toast ref={toast}/>
        <StepHeader text="Πελάτες"/>
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
            rowsPerPageOptions={[20, 50, 100, 200, 500]}
            dataKey="_id"
            paginatorRight={true}
            loading={loading}
            filterDisplay="row"
            showGridlines
        >
            <Column
                body={ActionTemplate}
                bodyStyle={{textAlign: 'center'}}
            >

            </Column>
            <Column
                body={ShowOffers}
                filter showFilterMenu={false}
                filterElement={() => {
                    return <FilterOffers onSort={onSort} sortOffers={sortOffers}/>

                }}
                style={{width: '40px'}}
            ></Column>
            <Column
                field="NAME"
                filter
                showFilterMenu={false}
                header="Ονομα"
                filterElement={()=> (
                    <SearchInput
                        name="name"
                        value={searchTerm.name}
                        handleSearch={handleSearchTerm}
                    />
                )}
            >

            </Column>
            <Column
                field="AFM"
                filter
                showFilterMenu={false}
                filterElement={()=> (
                    <SearchInput
                        name="afm"
                        value={searchTerm.afm}
                        handleSearch={handleSearchTerm}
                    />
                )}
                header="ΑΦΜ"
                style={{width: '120px'}}
            >
            </Column>
            <Column
                header="Διεύθυνση"
                field="ADDRESS"
                filter
                showFilterMenu={false}
                style={{width: '120px'}}
                filterElement={()=> (
                    <SearchInput
                        name="address"
                        value={searchTerm.address}
                        handleSearch={handleSearchTerm}
                    />
                )}

            >

            </Column>
            <Column
                field="EMAIL"
                filter
                showFilterMenu={false}
                header="Email"
                style={{width: '120px'}}
                filterElement={()=> (
                    <SearchInput
                        name="email"
                        value={searchTerm.email}
                        handleSearch={handleSearchTerm}
                    />
                )}
            >
            </Column>
            <Column
                field="PHONE01"
                filter
                showFilterMenu={false}
                header="Τηλέφωνο"
                style={{width: '120px'}}
                filterElement={()=> (
                    <SearchInput
                        name="phone01"
                        value={searchTerm.phone01}
                        handleSearch={handleSearchTerm}
                    />
                )}

            >

            </Column>
            <Column
                field="PHONE02"
                filter
                showFilterMenu={false}
                header="Τηλέφωνο 2"
                style={{width: '120px'}}
                filterElement={()=> (
                    <SearchInput
                        name="phone02"
                        value={searchTerm.phone02}
                        handleSearch={handleSearchTerm}
                    />
                )}
            >

            </Column>
            <Column
                field="ZIP"
                header="Ταχ.Κώδικας"
                style={{width: '40px'}}
            >

            </Column>
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

    </AdminLayout>);
}


const FilterOffers = ({onSort, sortOffers}) => {


    return (<div>

        <div className='ml-3'>
            {sortOffers === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
            {sortOffers === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
            {sortOffers === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
        </div>
    </div>)
}
















