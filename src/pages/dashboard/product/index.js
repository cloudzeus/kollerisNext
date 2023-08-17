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
import { MultiSelect } from 'primereact/multiselect';
import Fuse from 'fuse.js';


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
    const columns = [
        { field: 'CODE', header: 'code' },
        { field: 'CODE1', header: 'code1' },
        { field: 'mrtmark', header: 'Μάρκα' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [searchTerm, setSearchTerm] = useState('')



   

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };

 

    const handleFetch = async () => {
        setLoading(true)
        let res = await axios.post('/api/product/apiProduct', { action: 'findSoftoneProducts' })
        setData(res.data.result);
        setFilteredData(res.data.result);
        setLoading(false)
    }


    useEffect(() => {
        // data.map(item => {
        //     let list = Object.values(item)
        //     console.log(value)
        //     var results = fuzzy.filter(searchTerm, list)

        // })
       

        // function searchByName(query, field ) {
          
            
        //     const results = fuzzy.filter(query, data, {
        //       extract: el => el[field]
        //     });
        //     return results.map(el => el.original);
        //   }

        //   const filteredData = searchByName(searchTerm, "name");
        //   const filteredData2 = searchByName(searchTerm, "CODE");
        //   console.log('filteredData')
        //   console.log(filteredData2)
        // setFilteredData(filteredData);

        const options = {
            includeScore: true, // To see how well each result matched
            threshold: 0.1,
            keys: ['name', 'MTRL', 'CODE', 'CODE1', 'mrtmark', 'categoryName', 'mtrgroups']
          };
          const fuse = new Fuse(data, options);

            function fuzzySearch(query) {
            return fuse.search(query).map(result => result.item);
            }
            const results = fuzzySearch(searchTerm);
            console.log(results);
            if(results.length > 0) {
                setFilteredData(results);
            } else {
                setFilteredData(data);
            }
           

      }, [searchTerm]);


    useEffect(() => {
        handleFetch()
    }, [])



    //Refetch on add edit:
    // useEffect(() => {
    //     console.log('submitted: ' + submitted)
    //     if (submitted) handleFetch()
    // }, [submitted])




    const renderHeader = () => {

        return (
            <div>
            
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={searchTerm} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
                </span>
                <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-20rem" display="chip" />
            </div>
        );
    };


    
    const header = renderHeader();



    const onGlobalFilterChange =  (event) => {
        const value = event.target.value;
        setSearchTerm(value)
    };





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
                <Column field="categoryName" header="Εμπορική Κατηγορία" sortable></Column>
                <Column field="mtrgroups" header="Ομάδα" sortable></Column>
                {visibleColumns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header}/>
                ))}

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

















