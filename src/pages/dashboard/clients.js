import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import ExpandedRowGrid from '@/components/client/ExpandedRowGrid';
import ClientHolder from '@/components/client/ClientHolders';

export default function Clients() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [data, setData] = useState([])
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
  
   
    const onPage = (event) => {
        setlazyState(event);
    };


    const handleFetch = async () => {
        setLoading(true)
        try {
            let {data} = await axios.post('/api/clients/apiClients', { 
                action: 'search',
                skip: lazyState.first,
                limit: lazyState.rows,
                searchTerm: searchTerm
            })
            console.log(data)
            setData(data.result)
            setTotalRecords(data.totalRecords)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    useEffect(() => {
        handleFetch();

    }, [lazyState.rows, lazyState.first, searchTerm]);

    useEffect(() => {
        console.log('submitted: ' + submitted)
        if (submitted) handleFetch()
    }, [submitted])




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
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </span>
            </div>
        )
    }
    const OffersDetails = () => {
        return (
            <div>
                <i className="pi pi-chevron-right p-2" onClick={() => router.push('/dashboard/clients/single-client-offers')}></i>
            </div>
        )
    }

    
    const allowExpansion = (rowData) => {
        return rowData

    };


    const rowExpansionTemplate = (data) => {
      
        return (
            <  ExpandedRowGrid data={data} setSubmitted={setSubmitted}/>
        );
    };


    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Πελάτες" />
            <DataTable
                lazy
                totalRecords={totalRecords}
                first={lazyState.first}
                onPage={onPage}
                rows={lazyState.rows}
                size="small"
                value={data}
                paginator
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="_id"
                paginatorRight={true}
                loading={loading}
                filterDisplay="row"
                showGridlines
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
            >   
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion}  style={{ width: '20px' }} />
                <Column field="NAME"  filter showFilterMenu={false}  filterElement={SearchClient} header="Ονομα" sortable></Column>
                <Column field="AFM" header="ΑΦΜ" sortable></Column>
                <Column field="EMAIL" header="ΑΦΜ" sortable></Column>

                <Column field="ADDRESS" header="Διεύθυνση" sortable></Column>
                <Column field="PHONE01" header="Τηλέφωνο" sortable></Column>
                <Column field="ZIP" header="Ταχ.Κώδικας" sortable></Column>
                <Column field="Δείτε τις Προσφορές" header="Δείτε τις Προσφορές" ></Column>
            </DataTable>
            {/* <EditDialog
                style={dialogStyle}
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
            /> */}

        </AdminLayout >
    );
}



















