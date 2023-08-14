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
import { ActionDiv } from '@/componentsStyles/grid';
import DeletePopup from '@/components/deletePopup';
import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { set } from 'mongoose';



export default function Product() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const toast = useRef(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [loading, setLoading] = useState(false)
    const [first, setFirst] = useState(1);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [lastMTRLId, setLastMTRLId] = useState(null)
    const [firstMTRLId, setFirstMTRLId] = useState(null)

    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });





    const handleFetch = async (sign) => {
        setLoading(true)
        let res = await axios.post('/api/product/apiProduct', { action: 'findSoftoneProducts', rows: rows, lastMTRLId: lastMTRLId, firstMTRLId:firstMTRLId, sign: sign })
        setData(res.data.result);
        setLastMTRLId(res.data.lastMTRLId)
        setFirstMTRLId(res.data.firstMTRLId)
        setTotalRecords(Math.floor(res.data.count / rows))
        setLoading(false)
    }





    useEffect(() => {
        console.log('use effect --')
        handleFetch()
    }, [])



    //Refetch on add edit:
    // useEffect(() => {
    //     console.log('submitted: ' + submitted)
    //     if (submitted) handleFetch()
    // }, [submitted])




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
                {/* <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} /> */}
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



    const actionBodyTemplate = (rowData) => {
        return (
            <ActionDiv>
                <Button disabled={!rowData.status} style={{ width: '40px', height: '40px' }} icon="pi pi-pencil" onClick={() => editProduct(rowData)} />
                <DeletePopup onDelete={() => onDelete(rowData._id)} status={rowData.status} />
            </ActionDiv>
        );
    };

    const handleFooter = (event) => {
        console.log(event)
        if(event.page + 1 > page)  {
            setPage(event.page);
            console.log('page greater' + page)
        }
        if(event.page + 1 < page)  {
            setPage(event.page);
            console.log('first less ' + page)

        }
       
       
       
    }


    const handleNext = () => {
      
        if(page != totalRecords) {
            setPage(prev => prev + 1)
              handleFetch('next')
        } 
   
    }
    const handlePrev = () => {
  
        if(page !== 1) {
            setPage(prev => prev - 1)
            handleFetch('prev')
    }
}

    const footer = () => {
        return (
            // <Paginator
            //     first={first}
            //     rows={rows}
            //     totalRecords={totalRecords}
            //     rowsPerPageOptions={[10, 20, 30]}
            //     onPageChange={handleFooter}
            //     template="PrevPageLink CurrentPageReport NextPageLink "
            // />
            <div className='flex align-content-center justify-content-center'>
                  <Button style={{ width: '40px', height: '40px', marginRight: '5px' }} icon="pi pi-angle-left" onClick={handlePrev}   />
                  <span> {page + " of " + totalRecords }</span>
            <Button style={{ width: '40px', height: '40px', marginLeft: '5px' }} icon="pi pi-angle-right" onClick={handleNext}  />
            </div>

        )
    }

    return (
        <AdminLayout >
            {/* <Toast ref={toast} /> */}
            <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
                footer={footer}
                value={data}
                header={header}
                showGridlines
                dataKey="_id"
                // filters={filters}
                loading={loading}
                removableSort
                // onFilter={(e) => setFilters(e.filters)}
                editMode="row"
                selectOnEdit
            >
                <Column field="name" header="Όνομα"></Column>
                <Column field="MTRL" header="Όνομα"></Column>
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

















