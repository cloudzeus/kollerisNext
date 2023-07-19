'use client'
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { AddDialog, EditDialog } from '@/GridDialogs/userDialog';
import UserRoleChip from '@/components/RoleChip';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import { ActionDiv } from '@/componentsStyles/grid';
import DeletePopup from '@/components/deletePopup';
import { Toast } from 'primereact/toast';
import GridIconTemplate from '@/components/grid/gridIconTemplate';


export default function TemplateDemo() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });



    const handleFetch = async () => {

    try {
        const resp = await axios.post('/api/user/apiUser', { action: 'findAll' })
        console.log(resp.data.result)
        setData(resp.data.result)
    } catch (error) {
        console.log(error)

    }
}

    useEffect(() => {
        handleFetch();
    }, [])

    //Refetch on add edit:
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

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };



    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        );
    };

    


    //Edit:
    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    //Add product
    const openNew = () => {
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
    };

    const onDelete = async (id) => {
        
        let res = await axios.post('/api/product/apiMarkes', { action: 'delete', id: id })
        if(!res.data.success) return showError()
        handleFetch()
        showSuccess()
    }

    // CUSTOM TEMPLATES FOR COLUMNS
    const actionBodyTemplate = (rowData) => {
        return (
            <ActionDiv>
                <Button size="small" style={{width: '40px', height: '40px'}}  disabled={!rowData.status} icon="pi pi-pencil" onClick={() => editProduct(rowData)} />
                <DeletePopup onDelete={() => onDelete(rowData._id)} status={rowData.status}  />
            </ActionDiv>
        );
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής διαγραφή', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }

    const dialogStyle = {
        marginTop: '10vh', // Adjust the top margin as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
       
      };




    return (
        <AdminLayout >
            <Toast ref={toast} />
            <Toolbar  left={leftToolbarTemplate} ></Toolbar>
            <DataTable
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey="_id"
                filters={filters}
                paginatorRight={true}
                removableSort
                onFilter={(e) => setFilters(e.filters)}
                loading={loading}
                editMode="row"
                selectOnEdit
            >
                <Column field="firstName" header="'Ονομα" body={nameTemplate} ></Column>
                <Column field="lastName" header="Επώνυμο" sortable></Column>
                <Column field="email" header="Email" sortable tableStyle={{ width: '5rem' }} body={emailTemplate}></Column>
                <Column field="createdAt"  body={userCreate} sortable header="Ημερομηνία Δημιουργίας" tableStyle={{ width: '5rem' }}></Column>
                <Column field="status"  sortable header="Status" tableStyle={{ width: '5rem' }} body={ActiveTempate}></Column>
                <Column field="role"  sortable header="Role" tableStyle={{ width: '5rem' }} body={(data) => UserRoleChip(data.role)}></Column>
                <Column body={actionBodyTemplate} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} tableStyle={{ width: '4rem' }} filterMenuStyle={{ width: '5rem' }}></Column>

            </DataTable>
            <EditDialog
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
            />
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

const RoleTemplate = ({ role }) => {
    switch (role) {
        case 'admin':
            return 
    }

}

const emailTemplate = (data) => {
    return (
        <div>  
            <GridIconTemplate 
                value={data.email} 
                icon="pi pi-envelope"
                color="#0d6efd"
            />
        </div>
    )
}
const nameTemplate = (data) => {
    return (
        <div>  
            <GridIconTemplate 
                value={data.firstName} 
                icon="pi pi-user"
                color="#0d6efd"
            />
        </div>
    )
}



const userCreate = ({createdAt}) => {
    return createdAt.split('T')[0]
}




