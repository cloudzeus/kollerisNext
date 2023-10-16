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
import { AddDialog, EditDialog } from '@/GridDialogs/brandDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';

import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import GridLogoTemplate from '@/components/grid/gridLogoTemplate';

import { useSession } from 'next-auth/react';
import StepHeader from '@/components/StepHeader';
import GridExpansionTemplate from '@/components/markes/GridExpansionTemplate';
import MarkesActions from '@/components/markes/MarkesActions';
import { setSelectedMarkes } from '@/features/supplierOrderSlice';
import { useRouter } from 'next/router';
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
    const { data: session } =  useSession()
    let user = session?.user?.user;


    const handleFetch = async () => {
        setLoading(true)
        try {
            let resp = await axios.post('/api/product/apiMarkes', { action: 'findAll' })
            setData(resp.data.markes)
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



    const logoTemplate = (data) => {
        return (
            <GridLogoTemplate logo={data?.logo} />

        )
    }
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


    const allowExpansion = (rowData) => {
        return rowData

    };



    const rowExpansionTemplate = (data) => {
        console.log('row expansion data')
        console.log(data)
        return (
            < GridExpansionTemplate data={data} />
        );
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

   

    const onOrder = async (rowData) => {
        let mtrmark = rowData?.softOne?.MTRMARK
        let {data} = await axios.post('/api/createOrder', {action: 'findOnePending', mtrmark: mtrmark})
        // has one active order. There will always be a max of one active order.
        if(data.result !== 0) {
            showError('Υπάρχει ήδη ενεργή παραγγελία για αυτή τη μάρκα')
            return;
        }
        
        dispatch(setSelectedMarkes({
            NAME: rowData?.softOne?.NAME,
            mtrmark: mtrmark,
            minItemsOrder: rowData?.minItemsOrder,
            minValueOrder: rowData?.minValueOrder,

        }))
        router.push('/dashboard/supplierOrder/supplier')
    }
           
    // CUSTOM TEMPLATES FOR COLUMNS
    const actionBodyTemplate = (rowData) => {
        return (
            <MarkesActions  onEdit={editProduct} onOrder={onOrder} rowData={rowData} />
        )
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής διαγραφή', life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 4000 });
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
            <div>
                <StepHeader text="Μάρκες" />
            </div>
            <Toolbar start={leftToolbarTemplate}></Toolbar>
            <DataTable
                size="small"
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
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
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="logo" header="Λογότυπο" body={logoTemplate} style={{ width: '50px' }} ></Column>
                <Column field="softOne.NAME" header="Ονομα" sortable></Column>
                <Column field="minItemsOrder"  header="Min items order" sortable></Column>
                <Column field="minValueOrder"  header="Μin value order" sortable></Column>
                <Column field="minYearPurchases"  header="Μin year purchases" sortable></Column>
                <Column field="updatedFrom" sortable header="updatedFrom" style={{ width: '90px' }} body={UpdatedFromTemplate}></Column>
                {user?.role === 'admin' ? (
                    <Column body={actionBodyTemplate} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} style={{ width: '90px' }} ></Column>
                ) : null}

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




const ActionTemplate = () => {
    return (
        <div>

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







