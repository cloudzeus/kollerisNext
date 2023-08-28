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
import { ToggleButton } from 'primereact/togglebutton';
import { ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';
import { CartDiv } from '@/componentsStyles/grid';
import { TabView, TabPanel } from 'primereact/tabview';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import TranslateField from '@/components/grid/GridTranslate';



export default function Product() {
   
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const toast = useRef(null);
    const [frozen, setFrozen] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);

    const [rowClick, setRowClick] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState(null);

    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    const columns = [
        { field: 'CODE', header: 'code', style: null },
        { field: 'CODE1', header: 'code1', style: null },
        { field: 'mrtmark', header: 'Μάρκα', style: null },
        { field: 'PRICER', header: 'Τιμή Λιανικής',  style: {width: '100px', fontWeight: 700} },
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
        console.log(res.data.result)
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





    const allowExpansion = (rowData) => {
        return rowData

    };



    const renderHeader = () => {

        return (
            <div>
            
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={searchTerm} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
                </span>
                <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-20rem" display="chip" />
                <ToggleButton checked={frozen} onChange={(e) => {
                    setFrozen(e.value)
                }} onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Balance" offLabel="Balance" />

            </div>
        );
    };


    
    const header = renderHeader();



    const onGlobalFilterChange =  (event) => {
        const value = event.target.value;
        setSearchTerm(value)
    };






  



 

    const AddToCartTemplate = (rowData) => {
        return (
            <CartDiv >
                <Button disabled={!rowData.status} style={{ width: '30px', height: '30px', fontSize: '3px' }} icon="pi pi-shopping-cart"  />
            </CartDiv >
        )
    }

    const rowExpansionTemplate = (data) => {
        console.log(data)
        return (
                <div className="card p-20">
                    <TabView>
                        <TabPanel header="Φωτογραφίες">
                        </TabPanel>
                        <TabPanel header="Λεπτομέριες">
                            <ExpansionDetails data={data} />
                        </TabPanel>

                    </TabView>
                </div>
        );
    };

    const TranslateName = ({_id, name, localized}) => {
        return (
            <TranslateField
                url="/api/product/apiProduct"
                id={_id}
                value={name}
                fieldName="Όνομα"
                translations={localized[0]?.translations}
                index={0}
                />
        )
    }

 
    return (
        <AdminLayout >
            {/* <Toast ref={toast} /> */}

            {/* <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}
            <DataTable
                className='product-datatable'
                selectionMode={rowClick ? null : 'checkbox'} 
                selection={selectedProducts}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                paginator 
                rows={50} 
                // rowsPerPageOptions={[50, 100, 200, 500]}
                rowsPerPageOptions={[10, 20, 50, 100, 200]}
                value={filteredData}
                header={header}
                showGridlines
                dataKey="MTRL"
                loading={loading}
                removableSort
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                editMode="row"
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
            >   
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column selectionMode="multiple" headerStyle={{ width: '2rem' }}></Column>
                 <Column field="name" body={TranslateName} style={{width: '400px'}} header="Όνομα" ></Column>
                <Column field="categoryName"   header="Εμπορική Κατηγορία" sortable></Column>
                <Column field="mtrgroups" header="Ομάδα" sortable></Column>
                {visibleColumns.map((col, index) => {
                    return (
                        <Column key={index} field={col.field} header={col.header} style={col.style}/>
                    )
                }
                )}
                <Column style={{width: '60px'}} frozen={true} alignFrozen="right"  body={AddToCartTemplate}></Column>

            </DataTable>
          
        </AdminLayout >
    );
}




const ExpansionDetails = ({data}) => {
    console.log(data)
    return (
        < DisabledDisplay  >
        <div className="disabled-card">
            <label>
                Περιγραφή
            </label>
            <InputTextarea autoResize disabled value={data.description} />
        </div>
        <div className="disabled-card">
            <label>
                Όνομα
            </label>
            <InputText disabled value={data?.name} />
        </div>
     


    </DisabledDisplay>
    )
}

















