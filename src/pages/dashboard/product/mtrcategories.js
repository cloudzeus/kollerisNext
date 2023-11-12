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
import { AddDialog, EditDialog } from '@/GridDialogs/mtrcategoriesDialog';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import {  SubGridStyles } from '@/componentsStyles/grid';

import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import GridActions from '@/components/grid/GridActions';
import GridLogoTemplate from '@/components/grid/gridLogoTemplate';
import TranslateField from '@/components/grid/GridTranslate';
import { useSession } from 'next-auth/react';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import { AddDialog as GroupAdd, EditDialog as GroupEdit } from '@/GridDialogs/mtrgroupDialog';
import {EditDialog as SubGroupEdit} from '@/GridDialogs/mtrsubgroupDialog';


export default function Categories() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });
    //Set the toggled columns
    const { data: session } =  useSession()
    let user = session?.user?.user;



    const handleFetch = async () => {
        setLoading(true)
        let res = await axios.post('/api/product/apiCategories', { action: 'findAll' })
        setData(res.data.result)
        setLoading(false)
    }



    useEffect(() => {
        handleFetch()
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
        if (!res.data.success) return showError()
        handleFetch()
        showSuccess()
    }

    // CUSTOM TEMPLATES FOR COLUMNS
    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data.categoryIcon} />
    }
    const imageTemplate = (data) => {
        return <GridLogoTemplate logo={data.categoryImage} />
    }

    const actionBodyTemplate = (rowData) => {

        return (
            // <GridActions onDelete={onDelete} onEdit={editProduct} rowData={rowData}/>
            <div>
                 <i className="pi pi-pencil cursor-pointer" onClick={() => editProduct(rowData)}></i>
                 {/* <i className="pi pi-image ml-3 cursor-pointer" onClick={() => router.push('/dashboard/')}></i> */}
            </div>
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


    const RowExpansionTemplate = (data) => {
        return <RowExpansionGrid id={data._id} />
    }


   
   
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Κατηγορίες" />
            <Toolbar start={leftToolbarTemplate}></Toolbar>
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
                loading={loading}
                editMode="row"
                selectOnEdit
            >
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="categoryIcon" header="Λογότυπο" body={logoTemplate} style={{ width: '50px' }}></Column>
                <Column field="categoryImage" header="Φωτογραφία" body={imageTemplate} style={{ width: '50px' }} ></Column>
                <Column field="categoryName" header="Ονομα Κατηγορίας" sortable></Column>
                <Column field="englishName" header="Mετάφραση" ></Column>
                <Column field="updatedFrom" header="updatedFrom"  body={UpdatedFromTemplate} style={{ width: '90px' }}></Column>
                {/* <Column field="createdFrom" sortable header="createdFrom"  body={CreatedFromTemplate} style={{ width: '90px' }}></Column> */}
                {user?.role === 'admin' ? (
                   <Column body={actionBodyTemplate} exportable={false}  bodyStyle={{ textAlign: 'center' }} style={{ width: '100px' }} ></Column>
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
const RowExpansionGrid = ({id }) => {
    const dispatch = useDispatch();

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { data: session } =  useSession()
    let user = session?.user?.user;

    const [expanded, setExpanded] = useState(null);
       
    const handleFetch = async () => {
        setLoading(true);
        let res = await axios.post('/api/product/apiCategories', { action: 'findGroups', categoryId: id })
        setData(res.data.result)
        setLoading(false);
    
    }

    useEffect(() => {
        handleFetch()
    }, [submitted])


    // useEffect(() => {
    //     setEditData()

    // }, [categoryName])

    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data?.groupIcon} />
    }

    //function to set data to the subnested grid:
    const SubRowExpansionTemplate = (data) => {
        return <SubRowExpansionGrid id={data._id}/>
    }

    const Actions  = (product) => {
        return (
            <div>
                <i className="pi pi-pencil cursor-pointer"  onClick={() => editProduct(product)}></i>
           </div>
        )
    }

    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    //Add product
    const openNew = () => {
        setSubmitted(false);
    };


    const hideDialog = () => {
        setEditDialog(false);
    };

  


    return ( 
        <SubGridStyles>
            <span className="subgrid-title" >Groups:</span>
            <div className="data-table">
                <DataTable
                    loading={loading}
                    value={data}
                    paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                    srollable
                    dataKey="_id"
                    rowExpansionTemplate={SubRowExpansionTemplate}
                    expandedRows={expanded}
                    onRowToggle={(e) => setExpanded(e.data)}
                >
                    <Column bodyStyle={{ textAlign: 'center' }} expander={(data) => SubRowExpansionTemplate(data)} style={{ width: '20px' }} />
                    <Column field="groupIcon" body={logoTemplate} header="Λογότυπο" style={{ width: '50px' }}></Column>
                    <Column field="groupName" header="'Ονομα"></Column>
                    <Column field="updatedFrom"  header="updatedFrom" tableStyle={{ width: '5rem' }} body={UpdatedFromTemplate}></Column>
                    <Column field="englishName"  header="Μετάφραση"></Column>
                    {user?.role === 'admin' ? (
                   <Column body={Actions} exportable={false}  bodyStyle={{ textAlign: 'center' }} style={{ width: '100px' }} ></Column>
                ) : null}
                </DataTable>
            </div>
            <GroupEdit
                data={editData}
                setData={setEditData}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            /> 
           
        </SubGridStyles>
    );
};

const SubRowExpansionGrid = ({ id }) => {
    const dispatch = useDispatch()
    const { data: session } =  useSession()
    let user = session?.user?.user;
    const [editDialog, setEditDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);

    
    const handleFetch = async () => {
        setLoading(true);
        let res = await axios.post('/api/product/apiCategories', { action: 'findSubGroups', groupId: id })
        setData(res.data.result)
        setLoading(false);
    }

    useEffect(() => {
        handleFetch()
    }, [submitted])

    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data.subGroupIcon} />
    }

    const editProduct = async (product) => {
        setEditDialog(true)
        setSubmitted(false);
        dispatch(setGridRowData(product))
    };

   


    const hideDialog = () => {
        setEditDialog(false);
    };

    
    const Actions  = (product) => {
        return (
            <div>
                <i className="pi pi-pencil cursor-pointer"  onClick={() => editProduct(product)}></i>
           </div>
        )
    }


    return (
       <>
         < SubGridStyles>
            <span className="subgrid-title" >SubGroups:</span>
            <DataTable
                value={data}
                loading={loading}
                showGridlines
                dataKey="_id"
                removableSort
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginator
            >
                <Column field="subGroupIcon" body={logoTemplate} header="Λογότυπο" style={{ width: '50px' }}></Column>
                <Column field="subGroupName" header="Softone Όνομα"></Column>
                <Column field="englishName" header="Μετάφραση"></Column>
                <Column field="updatedFrom" sortable header="updatedFrom" tableStyle={{ width: '5rem' }} body={UpdatedFromTemplate}></Column>
                {user?.role === 'admin' ? (
                   <Column body={Actions} exportable={false}  bodyStyle={{ textAlign: 'center' }} style={{ width: '100px' }} ></Column>
                ) : null}
            </DataTable>
        </ SubGridStyles>
            < SubGroupEdit
            dialog={editDialog}
            setDialog={setEditDialog}
            hideDialog={hideDialog}
            setSubmitted={setSubmitted}

        />
       </>
    )

}














