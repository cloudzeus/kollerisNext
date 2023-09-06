import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { MultiSelect } from 'primereact/multiselect';
import Fuse from 'fuse.js';
import { TabView, TabPanel } from 'primereact/tabview';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import TranslateField from '@/components/grid/GridTranslate';
import ProductActions from '@/components/grid/Product/ProductActions';
import { EditDialog } from '@/GridDialogs/ProductDialog';
import ClassificationDialog from '@/GridDialogs/product/ClassificationDialog';
import GridPriceTemplate from '@/components/grid/GridPriceTemplate';
import { Badge } from 'primereact/badge';
import ProductHeader from '@/components/grid/Product/ProductHeader';
import ProductToolbar from '@/components/grid/Product/ProductToolbar';
import { Button } from 'primereact/button';
import {ProductAvailability, ProductOrdered, ProductReserved}  from '@/components/grid/Product/ProductAvailability';




const dialogStyle = {
    marginTop: '10vh', // Adjust the top margin as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

};


export default function MyComponent() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredData, setFilteredData] = useState([])

    const memoizedCallback = useCallback(
        async () => {
            // Do something
            const fetch = async () => {
                setLoading(true)
                let res = await axios.post('/api/product/apiProduct', { action: 'findSoftoneProducts' })
                setData(res.data.result);
                setFilteredData(res.data.result);
                setLoading(false)
            }
            fetch()
        },
        [data]
    );

    return (
        <div>
            <Product onLoad={memoizedCallback} data={data} loading={loading} filteredData={filteredData} setFilteredData={setFilteredData} />
        </div>
    );
};


const initialColumns = [
    {
        header: 'Availability',
        id: 2,
    },
    {
        header: 'Ordered',
        id: 3,
    },
    {
        header: 'Reserved',
        id: 4,
    },
  
    {
        header: 'Υποομάδα',
        id: 7
    },

]

const columns = [
    ...initialColumns,
    
    {
        header: 'CategoryName',
        id: 5
    },
    {
        header: 'CategoryName',
        id: 6
    },
  

]


function Product({ data, loading, onLoad, filteredData, setFilteredData }) {
    const dispatch = useDispatch();
    const [editDialog, setEditDialog] = useState(false);
    const [classDialog, setClassDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(initialColumns)

    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (submitted) handleFetch()
    }, [submitted])




    useEffect(() => {
        const options = {
            includeScore: true, // To see how well each result matched
            threshold: 0.5,
            keys: ['name', 'MTRL', 'CODE', 'CODE1', 'mrtmark', 'categoryName', 'mtrgroups']
        };
        const fuse = new Fuse(data, options);
        function fuzzySearch(query) {
            return fuse.search(query).map(result => result.item);
        }
        const results = fuzzySearch(searchTerm);
        if (results.length > 0) {
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }


    }, [searchTerm]);


    useEffect(() => {
        onLoad()
    }, [])

    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    const editClass = async (product) => {
        setClassDialog(true)
        dispatch(setGridRowData(product))
    }


    const allowExpansion = (rowData) => {
        return rowData

    };

    const onSearch = (e) => onGlobalFilterChange(e);

    const onColumnToggle = (event) => {
        console.log(event.value)
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.id === col.id));
        setVisibleColumns(orderedSelectedColumns);
    }
    const renderHeader = () => {
        return (
            <div className="flex">
                <div className="">
                    <span className="p-input-icon-left mr-3">
                        <i className="pi pi-search" />
                        <InputText type="search" value={searchTerm} onChange={onSearch} placeholder="Αναζήτηση" />
                    </span>
                    {/* <Button onClick={addAlltoBasket} icon="pi pi-shopping-cart" label="Προσθήκη Όλων" severity="warning" /> */}

                </div>
                <div className="middle-header">
                    <MultiSelect value={visibleColumns} options={columns} onChange={onColumnToggle} optionLabel="header" className="w-full sm:w-16rem" display="chip" />
                </div>
            </div>

        );
    };



    const header = renderHeader();

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value)
    };


    const AddToCartTemplate = (rowData) => {
        return (
            <ProductActions
                rowData={rowData}
                onEdit={editProduct}
                onEditClass={editClass}
            />
        )
    }


    const rowExpansionTemplate = (data) => {
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

    const TranslateName = ({ _id, name, localized }) => {
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


    const hideDialog = () => {
        setEditDialog(false);
        setClassDialog(false)
    };
    const onSelection = (e) => {
        setSelectedProducts(e.value)
    }


    const footer = () => {
        return (
            <Button icon="pi pi-replay" label="Ανανέωση διαθεσιμότητας" />
        )
    }


    return (
        <AdminLayout >
            <ProductToolbar
                setSubmitted={setSubmitted}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts} />
            <DataTable
                className='product-datatable'
                selectionMode={'checkbox'}
                selection={selectedProducts}
                onSelectionChange={onSelection}
                paginator
                rows={10}
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
                footer={footer}
            >

                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column selectionMode="multiple" headerStyle={{ width: '2rem' }}></Column>
                <Column field="name" body={TranslateName} style={{ width: '400px' }} header="Όνομα" ></Column>
                {visibleColumns.some(column => column.id === 2) && <Column field="availability.DIATHESIMA" body={productAvailabilityTemplate} header="Κωδικός" ></Column>}
                {visibleColumns.some(column => column.id === 3) && <Column field="availability.SEPARAGELIA" body={productOrderedTemplate} style={{width: '135px'}} header="Παραγγελία" ></Column>}
                {visibleColumns.some(column => column.id === 4) && <Column field="availability.DESVMEVMENA" body={productReservedTemplate} style={{width: '135px'}}  header="Δεσμευμένα" ></Column>}
                {visibleColumns.some(column => column.id === 5) && <Column field="categoryName" header="Εμπορική Κατηγορία" sortable></Column>}
                {visibleColumns.some(column => column.id === 6) && <Column field="mtrgroups" header="Ομάδα" sortable></Column>}
                {visibleColumns.some(column => column.id === 7) && <Column field="mtrsubgroup" header="Υποομάδα" sortable></Column>}
                <Column field="UPDDATE" header="Τελευταία Τροποποίηση Softone" body={Upddate} style={{ width: '80px', textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} sortable></Column>
                {/* {visibleColumns.map((col, index) => {
                    return (
                        <Column key={index} field={col.field} header={col.header} style={col.style} body={col.body} />
                    )
                }
                )} */}

                <Column field="updatedFrom" sortable header="updatedFrom" style={{ width: '90px' }} body={UpdatedFromTemplate}></Column>
                <Column field="PRICER" sortable header="Τιμή λιανικής" style={{ width: '90px' }} body={PriceTemplate}></Column>

                <Column style={{ width: '50px' }} body={AddToCartTemplate}></Column>

            </DataTable>
            <EditDialog
                style={dialogStyle}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}

            />
            <ClassificationDialog
                dialog={classDialog}
                setDialog={setClassDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />

        </AdminLayout >
    );
}


const Upddate = ({ UPDDATE }) => {
    return (
        <div className='flex align-items-center'>

            <i className="text-primary-700 pi pi-calendar text-sm mr-1"></i>

            <p className='text-600'>{UPDDATE[0].split(' ')[0]}</p>
        </div>
    )
}


const PriceTemplate = ({ PRICER }) => {
    return (
        <div>
            <GridPriceTemplate PRICER={PRICER[0]} />
        </div>
    )
}

const ExpansionDetails = ({ data }) => {
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
                    Μάρκα
                </label>
                <InputText disabled value={data?.mrtmark} />
            </div>
            <div className="disabled-card">
                <label>
                    Kατασκευαστής
                </label>
                <InputText disabled value={data?.mrtmanufact} />
            </div>
            <div className="disabled-card">
                <label>
                    ΕΑΝ
                </label>
                <InputText disabled value={data?.CODE1} />
            </div>
            <div className="disabled-card">
                <label>
                    VAT
                </label>
                <InputText disabled value={data?.VAT} />
            </div>
            <div className="disabled-card">
                <label>
                    Κωδικός Εργοστασίου
                </label>
                <InputText disabled value={data?.CODE2} />
            </div>
            <div className="disabled-card">
                <label>
                    Ημερομηνία τελευταίας τροποποίησης
                </label>
                <InputText disabled value={data?.UPDDATE} />
            </div>

        </DisabledDisplay>
    )
}



const UpdatedFromTemplate = ({ updatedFrom, updatedAt }) => {
    console.log(updatedFrom)
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




const productAvailabilityTemplate = ({ availability }) => {
    
    return (
        <ProductAvailability data={availability} />
    )
}
const productOrderedTemplate = ({ availability }) => {
    
    return (
        <ProductOrdered data={availability} />
    )
}
const productReservedTemplate = ({ availability }) => {
    
    return (
        <ProductReserved data={availability} />
    )
}



