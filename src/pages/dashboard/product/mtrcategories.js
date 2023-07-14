import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Image from 'next/image';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { AddDialog, EditDialog } from '@/GridDialogs/mtrcategoriesDialog';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import { ImageDiv, ActionDiv, SubGridStyles } from '@/componentsStyles/grid';

import DeletePopup from '@/components/deletePopup';
import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';

import GridLogoTemplate from '@/components/grid/gridLogoTemplate';
import GridLanguageTemplate from '@/components/grid/GridLanguageTemplate';
import TranslateField from '@/components/grid/GridTranslate';





const initialTranslateState = 
[
    {
        fieldName: 'categoryName',
        translations: [
            {
                locale: 'Aγγλικά',
                code: 'GB',
                translation: ''
            },
            {
                locale: 'Γαλλικά',
                code: 'FR',
                translation: ''
            },
            {
                locale: 'Γερμανικά',
                code: 'GE',
                translation: ''
            },
        ]
    }
]



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
    
    const [translateState, setTranslateState] = useState(initialTranslateState)

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });
    //Set the toggled columns


    const handleFetch = async () => {
        let res = await axios.post('/api/product/apiCategories', { action: 'findAll' })
        setData(res.data.result)

    }

    useEffect(() => {

        handleFetch()
    }, [])



    //Refetch on add edit:
    useEffect(() => {
        console.log('submitted: ' + submitted)
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

    const rightToolbarTemplate = () => {
        return (
            <>
                {/* <SyncBrand 
                refreshGrid={handleFetch}  
                addToDatabaseURL= '/api/product/apiMarkes'
            /> */}
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => console.log('export pdf')} /> */}
            </>
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
            <ActionDiv>
                <Button disabled={!rowData.status} style={{ width: '40px', height: '40px' }} icon="pi pi-pencil" onClick={() => editProduct(rowData)} />
                <DeletePopup onDelete={() => onDelete(rowData._id)} status={rowData.status} />
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


    const RowExpansionTemplate = (data) => {
        return <RowExpansionGrid groups={data.groups} />
    }


   
    const translateName = ({_id, categoryName}) => {
        
        
        const handeTranslateApi = () => {
            console.log('hit translate button')
            let res = axios.post('/api/product/apiCategories', { action: 'translate', data: translateState, id: _id})
            console.log(res)
        }
        return (
            <TranslateField 
                fieldName={'Ονομα'} 
                value={categoryName}
                id={_id}
                handleApi={handeTranslateApi}
                data={translateState}
                setData={setTranslateState}
                />
        )
    }
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
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
                <Column field="categoryName" body={translateName} header="Ονομα Κατηγορίας" sortable></Column>
                <Column field="updatedFrom" sortable header="updatedFrom"  body={UpdatedFromTemplate} style={{ width: '90px' }}></Column>
                <Column field="createdFrom" sortable header="createdFrom"  body={CreatedFromTemplate} style={{ width: '90px' }}></Column>
                <Column field="status" sortable header="Status"  body={ActiveTempate}  bodyStyle={{ textAlign: 'center' }}  style={{ width: '90px' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} style={{ width: '100px' }} filterMenuStyle={{ width: '5rem' }}></Column>

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


const LocaleTemplate = ({ localized }) => {
    return (
        <GridLanguageTemplate localized={localized} />
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



//The component for the nested grid:
const RowExpansionGrid = ({ groups }) => {
    // console.log('GROUPS: ' + JSON.stringify(groups))
    const [expanded, setExpanded] = useState(null);



    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data?.groupIcon} />
    }

    //function to set data to the subnested grid:
    const SubRowExpansionTemplate = (data) => {
        return <SubRowExpansionGrid subGroups={data.subGroups} />
    }
    return (
        <SubGridStyles>
            <span className="subgrid-title" >Groups:</span>
            <div className="data-table">
                <DataTable
                    value={groups}
                    rows={8}
                    srollable
                    showGridlines
                    dataKey="_id"
                    rowExpansionTemplate={SubRowExpansionTemplate}
                    expandedRows={expanded}
                    onRowToggle={(e) => setExpanded(e.data)}
                >
                    <Column bodyStyle={{ textAlign: 'center' }} expander={(data) => SubRowExpansionTemplate(data)} style={{ width: '20px' }} />
                    <Column field="groupIcon" body={logoTemplate} header="Λογότυπο" style={{ width: '50px' }}></Column>
                    <Column field="groupName" header="'Ονομα"></Column>
                    <Column field="status" header="Status" body={ActiveTempate} style={{ width: '90px' }}></Column>

                    {/* <Column field="status" sortable header="Status" tableStyle={{ width: '5rem' }} body={ActiveTempate}></Column>
            <Column field="updatedFrom" sortable header="updatedFrom" tableStyle={{ width: '5rem' }} body={UpdatedFromTemplate}></Column>
            <Column field="createdFrom" sortable header="createdFrom" tableStyle={{ width: '5rem' }} body={CreatedFromTemplate}></Column> */}
                </DataTable>
            </div>
        </SubGridStyles>
    );
};

const SubRowExpansionGrid = ({ subGroups }) => {
    console.log('SUBGROUPS: ' + JSON.stringify(subGroups))
    const logoTemplate = (data) => {
        return <GridLogoTemplate logo={data.subGroupIcon} />
    }
    return (
        < SubGridStyles>
            <span className="subgrid-title" >SubGroups:</span>
            <DataTable
                value={subGroups}
                showGridlines
                dataKey="_id"
                removableSort
            >
                <Column field="subGroupIcon" body={logoTemplate} header="Λογότυπο" style={{ width: '50px' }}></Column>
                <Column field="subGroupName" header="Softone Όνομα"></Column>
                <Column field="status" header="Status" body={ActiveTempate} ></Column>
                {/* <Column field="status" sortable header="Status" tableStyle={{ width: '5rem' }} body={ActiveTempate}></Column>
            <Column field="updatedFrom" sortable header="updatedFrom" tableStyle={{ width: '5rem' }} body={UpdatedFromTemplate}></Column>
            <Column field="createdFrom" sortable header="createdFrom" tableStyle={{ width: '5rem' }} body={CreatedFromTemplate}></Column> */}
            </DataTable>
        </ SubGridStyles>
    )

}














