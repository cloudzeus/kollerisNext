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
import fuzzy from 'fuzzy';

export default function Product() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const toast = useRef(null);

    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
    });


    const [filterValue, setFilterValue] = useState('')

    const handleFetch = async (sign) => {
        setLoading(true)
        let res = await axios.post('/api/product/apiProduct', { action: 'findSoftoneProducts' })
        setData(res.data.result);
        setFilteredData(res.data.result);
        setLoading(false)
    }


    useEffect(() => {
     
        // let list = data.map(function(el) { return el.name; });
        function searchByName(query) {
            const results = fuzzy.filter(query, data, {
              extract: el => el.name
            });
            return results.map(el => el.original);
          }
          const filteredData = searchByName(filterValue);
            setFilteredData(filteredData);
      }, [filterValue]);


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
                    <InputText type="search" value={filterValue} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
                </span>
            </>
        );
    };


    
    const header = renderHeader();



    const onGlobalFilterChange =  (event) => {
        const value = event.target.value;
        setFilterValue(value)
        // let _filters = { ...filters };
        // _filters['global'].value = value;
        // setFilters(_filters);

        // let _newValue = value.split(' ').join('')
        // const _data = data 
        // const _filteredData = _data.filter((item) => {
        //     let name = item.name.split(' ').join('');
        //     return name.toLowerCase().includes(_newValue.toLowerCase());
        // })
        // console.log(_filteredData)
        
       

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

 
    return (
        <AdminLayout >
            {/* <Toast ref={toast} /> */}
            <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
                paginator 
                rows={50} 
                rowsPerPageOptions={[50, 100, 200, 500]}
                value={filteredData}
                header={header}
                showGridlines
                dataKey="_id"
                loading={loading}
                removableSort
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                editMode="row"
                selectOnEdit
            >
                <Column field="name" header="Όνομα"></Column>
                {/* <Column field="MTRL" header="Όνομα"></Column> */}
                <Column field="categoryName" header="Κατηγορία" sortable></Column>
                <Column field="mtrgroups" header="Group" sortable></Column>

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

















