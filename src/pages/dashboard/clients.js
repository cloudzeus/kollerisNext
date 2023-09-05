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

export default function Clients() {

    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const [syncData, setSyncData] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });



    const handleFetch = async () => {
        console.log('fetching')
        setLoading(true)
        try {
            let resp = await axios.post('/api/clients/apiClients', { action: 'findAll' })
            console.log(resp.data.result)
            setData(resp.data.result)
            setSyncData(resp.data.missing)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    useEffect(() => {
        handleFetch();

    }, []);

    useEffect(() => {
        console.log('submitted: ' + submitted)
        if (submitted) handleFetch()
    }, [submitted])



    //TEMPLATES

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
            </span>
        );
    };
    const header = renderHeader();

   


   

    const rightToolbarTemplate = () => {
        return (
            <Sync data={syncData} setSubmitted={setSubmitted}/>
        )
    }


    return (
        <AdminLayout >
            <Toast ref={toast} />
            <Toolbar  end={rightToolbarTemplate} />
            <DataTable
                size="small"
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="_id"
                filters={filters}
                paginatorRight={true}
                loading={loading}
            >
                <Column field="TRDR" header="TRDR" sortable></Column>
                <Column field="NAME" header="Ονομα" sortable></Column>
                <Column field="AFM" header="ΑΦΜ" sortable></Column>
                <Column field="ADDRESS" header="Διεύθυνση" sortable></Column>
                <Column field="PHONE01" header="Τηλέφωνο" sortable></Column>
                <Column field="ZIP" header="Ταχ.Κώδικας" sortable></Column>
                <Column field="BALANCE" header="Υπόλοιπο" sortable></Column>
                {/* <Column body={actionBodyTemplate} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} style={{ width: '180px' }} filterMenuStyle={{ width: '5rem' }}></Column> */}

            </DataTable>
            {/* <EditDialog
                style={dialogStyle}
                data={editData}
                setData={setEditData}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            /> */}
            {/* <AddDialog
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            /> */}

        </AdminLayout >
    );
}







const ActiveTempate = ({ status }) => {
    return (
        <div>
            {status ? (
                <Tag severity="success" value=" active "></Tag>
            ) : (
                <Tag severity="danger" value="deleted" ></Tag>
            )}

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
const CreatedFromTemplate = ({ createdFrom, createdAt }) => {
    return (
        <RegisterUserActions
            actionFrom={createdFrom}
            at={createdAt}
            icon="pi pi-user"
            color="#fff"
            backgroundColor='var(--green-400)'
        />

    )
}







function Sync({data, setSubmitted}) {
    const op = useRef(null);
    const toast = useRef(null);
    console.log('dataaaaaa')
    console.log(data)
    const [selected, setSelected] = useState([]);
    console.log('selected')
    console.log(selected)
    const [loading, setLoading] = useState(false)


const handleSync = async () => {
    setLoading(true)
    console.log('sync')
    let {data} = await axios.post('/api/clients/apiClients', { action: 'upsert', data: selected })
    if(!data.success) {
        showError()
        setLoading(false)
        return;
    }
    showSuccess();
    setLoading(false)
    setSubmitted(true);
}


const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής Προσθήκη στο σύστημα μας', life: 5000 });
}
const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία προσθήκης', life: 4000 });
}


const footerTemplate = () => {
    return (
        <div>
            <Button  loading={loading} disabled={selected.length == 0 ? true : false} label="Sync" icon="pi pi-sync" className="p-button-secondary" onClick={handleSync}/>
        </div>
    );
}


return (
    <div className="card flex flex-column align-items-center gap-3">
        <Toast ref={toast} />
        <Button 
            type="button" 
            icon="pi pi-sync"  
            label="sync"
            className="p-button-secondary"
            tooltip='Αν νέες εγγραφές έχουν προστεθεί στο softone θα εμφανιστούν εδώ.
            Πατήστε για να δείτε τις εγγραφές'
            tooltipOptions={{ position: 'left' }}
            onClick={(e) => op.current.toggle(e)}>
            <Badge value={data.length} severity="danger" />
        </Button>
       
        <OverlayPanel ref={op} showCloseIcon>
            <DataTable 
                value={data} 
                selectionMode="single" 
                paginator 
                rows={5} 
                selection={selected} 
                footer={footerTemplate}
                onSelectionChange={(e) => setSelected(e.value)}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="TRDR" header="TRDR" style={{minWidth: '12rem'}} />
                <Column field="NAME" header="Όνομα Softone" style={{minWidth: '12rem'}} />
            </DataTable>
        </OverlayPanel>
    </div>
);
}