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
import { AddDialog, EditDialog } from '@/GridDialogs/mtrgroupDialog';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import { SubGridStyles } from '@/componentsStyles/grid';
import GridActions from '@/components/grid/GridActions';
import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { useSession } from 'next-auth/react';

import GridLogoTemplate from '@/components/grid/gridLogoTemplate';
import TranslateField from '@/components/grid/GridTranslate';
import StepHeader from '@/components/StepHeader';
const dialogStyle = {
    marginTop: '10vh', // Adjust the top margin as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

};


export default function Groups() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession()
    let user = session?.user?.user;

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });

    const handleFetch = async () => {
        setLoading(true);
        let res = await axios.post('/api/product/apiGroup', { action: 'findAll' })
        setData(res.data.result)
        setLoading(false);
    }

    useEffect(() => {
        handleFetch()
    }, [])



    //Refetch on add edit:
    useEffect(() => {
        if (submitted) handleFetch()
    }, [submitted])





    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';
        return (
            <>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
                </span>
            </>
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





    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        );
    };




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
        if (!res.data.success) return showError()
        handleFetch()
        showSuccess()
    }

    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data.groupIcon} />
    }


    const imageTemplate = (data) => {
        return <GridLogoTemplate logo={data.groupImage} />
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <i className="pi pi-pencil cursor-pointer" onClick={() => editProduct(rowData)}></i>
            </div>
        )
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής διαγραφή', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }




    const RowExpansionTemplate = (data) => {
        return <RowExpansionGrid id={data._id} />
    }




    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Oμάδες" />
            <Toolbar start={leftToolbarTemplate} ></Toolbar>
            <DataTable
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                rowExpansionTemplate={RowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey="_id"
                filters={filters}
                paginatorRight={true}
                removableSort
                onFilter={(e) => setFilters(e.filters)}
                //edit:
                size="small"
                loading={loading}
                editMode="row"
                selectOnEdit
            >
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="groupIcon" header="Λογότυπο" body={logoTemplate} style={{ width: '50px' }} ></Column>
                <Column field="groupImage" header="Φωτογραφία Group" body={imageTemplate} style={{ width: '50px' }} ></Column>
                <Column field="category.categoryName" header="Κατηγορία"  ></Column>
                <Column field="groupName" header="Όνομα Group" ></Column>
                <Column field="englishName" header="Μετάφραση"></Column>

                {/* <Column field="createdFrom" sortable header="createdFrom" style={{ width: '90px' }} body={CreatedFromTemplate}></Column> */}
                <Column field="updatedFrom" sortable header="updatedFrom" style={{ width: '90px' }} body={UpdatedFromTemplate}></Column>
                {/* <Column field="status" sortable header="Status" style={{ width: '90px' }}  bodyStyle={{ textAlign: 'center' }}  body={ActiveTempate}></Column> */}
                {user?.role === 'admin' ? (
                    <Column body={actionBodyTemplate} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} style={{ width: '40px' }} ></Column>
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



//The component for the nested grid:
const RowExpansionGrid = ({ id }) => {
    const [data, setData] = useState(false)
    const [loading, setLoading] = useState(false)
    // console.log('GROUPS: ' + JSON.stringify(groups))
    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data?.groupIcon} />
    }

    const handleFetch = async () => {
        setLoading(true);
        let res = await axios.post('/api/product/apiCategories', { action: 'findSubGroups', groupId: id })
        setData(res.data.result)
        console.log('subgroups')
        console.log(res.data.result)
        setLoading(false);
    }

    useEffect(() => {
        handleFetch()
    }, [])
    return (
        <SubGridStyles>
            <span className="subgrid-title" >Subgroups:</span>
            <div className="data-table">
                <DataTable
                    loading={loading}
                    value={data}
                    rows={8}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginator
                    srollable
                    showGridlines
                    dataKey="subGroupName"

                >
                    <Column field="subGroupIcon" body={logoTemplate} style={{ width: '50px' }} header="Λογότυπο"></Column>
                    <Column field="subGroupName" header="'Ονομα"></Column>

                </DataTable>
            </div>
        </SubGridStyles>
    );
};















