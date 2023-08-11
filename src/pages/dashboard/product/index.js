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
import { AddDialog, EditDialog } from '@/GridDialogs/manufacturersDialog';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import {ActionDiv } from '@/componentsStyles/grid';
import DeletePopup from '@/components/deletePopup';
import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { Skeleton } from 'primereact/skeleton';



export default function Product() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    let loadLazyTimeout = null;
    const [lazyLoading, setLazyLoading] = useState(false);

    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [offset, setOffset] = useState(0);
    const limit = 100;
    console.log('offset is ' + offset)
    const onVirtualScroll = (event) => {
 
        console.log('event')
        console.log(event.first, event.last)
        if(event.last > offset - 2) {
           console.log('yes')
           if(offset > 0) {
                handleFetch()

            // setOffset(prevOffset => prevOffset + limit);
           }
          
        }
        // if(event.last === offset) {
        //     handleFetch()
        // }
    }

    const handleFetch = async () => {
        console.log('now')
        let res = await axios.post('/api/product/apiProduct', { action: 'findSoftoneProducts', offset: offset, limit: limit})
        console.log(res.data.result)
        setData(prev => [...prev, ...res.data.result]);
        setOffset(prevOffset => prevOffset + limit);
        console.log('offset is ' + offset)
    
    }

    const loadingTemplate = (options) => {
        return (
            <div className="flex align-items-center" style={{ height: '17px', flexGrow: '1', overflow: 'hidden' }}>
                <Skeleton width={options.cellEven ? (options.field === 'year' ? '30%' : '40%') : '60%'} height="1rem" />
            </div>
        );
    };
  
    useEffect(() => {
        console.log('use effect --')
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
        // setPage(1)
        // const value = event.target.value;
        // console.log('value')
        // console.log(value)
        // setSearch(value)
        // let _filters = { ...filters };
        // _filters['global'].value = value;

        // setFilters(_filters);
    };

    // useEffect(() => {
        
    //     const searchFetch = async (value, page, limit) => {
    //         let res = await axios.post('/api/product/apiProduct', { action: 'search', query: value, page: page, limit: limit})
    //         setData(res.data.result)
    //     }

    //     searchFetch(search,limit)
        
    // }, [search, limit])
 



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
                {/* <SyncManufacturers
                refreshGrid={handleFetch}  
                addToDatabaseURL= '/api/product/apiManufacturers'
                />  */}
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => console.log('export pdf')} /> */}
            </>
        );

    };


    //Edit:
    const editProduct = async (product) => {
        // console.log('edit product: ' + JSON.stringify(product))
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

    // const onDelete = async (id) => {

    //     let res = await axios.post('/api/product/apiManufacturers', { action: 'delete', id: id })
    //     if (!res.data.success) return showError()
    //     handleFetch()
    //     showSuccess()
    // }

    // CUSTOM TEMPLATES FOR COLUMNS
  
    const actionBodyTemplate = (rowData) => {
        return (
            <ActionDiv>
                <Button disabled={!rowData.status} style={{ width: '40px', height: '40px' }} icon="pi pi-pencil" onClick={() => editProduct(rowData)} />
                <DeletePopup onDelete={() => onDelete(rowData._id)} status={rowData.status} />
            </ActionDiv>
        );
    };

 

  

  

  
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
             value={data}
            //  size='small'
                scrollHeight='550px'
                 scrollable 
                 virtualScrollerOptions={{lazy: true, onLazyLoad: onVirtualScroll, itemSize:  50, showLoader: true, loading: lazyLoading, loadingTemplate }}
                header={header}
                showGridlines
                dataKey="_id"
                filters={filters}
                removableSort
                onFilter={(e) => setFilters(e.filters)}
                editMode="row"
                selectOnEdit
            >
                <Column field="name" header="Όνομα"></Column>
                <Column field="categoryName" header="Όνομα Προϊόντος" sortable></Column>
                <Column field="mtrgroups" header="Groups" sortable></Column>
              
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



//The component for the nested grid:

















