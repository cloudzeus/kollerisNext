import React, { useState, useEffect, useRef, useContext, lazy } from 'react';
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
import { TabView, TabPanel } from 'primereact/tabview';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import TranslateField from '@/components/grid/GridTranslate';
import ProductActions from '@/components/grid/Product/ProductActions';
import { EditDialog } from '@/GridDialogs/ProductDialog';
import ClassificationDialog from '@/GridDialogs/product/ClassificationDialog';
import GridPriceTemplate from '@/components/grid/GridPriceTemplate';
import ProductToolbar from '@/components/grid/Product/ProductToolbar';
import { ProductAvailability, ProductOrdered, ProductReserved } from '@/components/grid/Product/ProductAvailability';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'
import { ProductQuantityProvider, ProductQuantityContext } from '@/_context/ProductGridContext';
import SoftoneStatusTemplate from '@/components/grid/Product/SoftoneStatus';
import { useSession } from 'next-auth/react';
import { set } from 'mongoose';
import { Button } from 'primereact/button';
import Link from 'next/link';



const dialogStyle = {
    marginTop: '10vh', // Adjust the top margin as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

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

  

]

const columns = [
    ...initialColumns,
 
    {
        header: 'Κατηγορία',
        id: 5
    },
    {
        header: 'Ομάδα',
        id: 6
    },
    {
        header: 'Υποομάδα',
        id: 7
    },
      
    {
        header: 'UpdatedFrom',
        id: 8
    },
    {
        header: 'SoftoneStatus',
        id: 9
    },
    {
        header: 'Description',
        id: 10
    },
    {
        header: 'Impas',
        id: 11
    },

    // {
    //     header: 'CategoryName',
    //     id: 6
    // },

]


async function intervalInventory() {
    let result = await axios.post('/api/product/apiProduct', { action: 'intervalInventory' })
}






export default function ProductLayout() {
    return (
        <ProductQuantityProvider>
            <Product/>
        </ProductQuantityProvider>
    )
}

function Product() {
    const toast = useRef(null);
    //Context:
    const { data: session } =  useSession()
    let user = session?.user?.user;
    const{selectedProducts, setSelectedProducts, submitted, setSubmitted} = useContext( ProductQuantityContext)
    const [categroriesFilter, setCategoriesFilter] = useState(null);
    const [subGroupsFilter, setSubGroupsFilter] = useState(null);
    const [groupFilter, setGroupFilter] = useState(null);
    const [softoneStatusFilter, setSoftoneStatusFilter] = useState(null);
    const [category, setCategory] = useState(null)
    const [group, setGroup] = useState(null)
    const [subgroup, setSubGroup] = useState(null)
    const [softOneStatus, setSoftoneStatus]  = useState(null)
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [editDialog, setEditDialog] = useState(false);
    const [classDialog, setClassDialog] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(initialColumns)
    const [triggerUpdate, setTriggerUpdate] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);


    // const [selectedProducts, setSelectedProducts] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        representative: { value: null, matchMode: FilterMatchMode.IN },

    });
    const [searchTerm, setSearchTerm] = useState('')
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
  

    useEffect(() => {
        if (submitted) fetch()
    }, [submitted])


    const fetch = async () => {
        setLoading(true)
        let res = await axios.post('/api/product/apiProductFilters', {
            action: 'filterCategories',
            searchTerm: searchTerm,
            skip: lazyState.first,
            limit: lazyState.rows,
            categoryID: category?.softOne.MTRCATEGORY,
            groupID: group?.softOne.MTRGROUP,
            subgroupID: subgroup?.softOne.cccSubgroup2,
            softoneStatusFilter: softoneStatusFilter
        })
        console.log(res.data.result[0])
        setFilteredData(res.data.result);
        setTotalRecords(prev => {
            if (prev === res.data.totalRecords) {
                return prev;
            } else {
                return res.data.totalRecords
            }
        })
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [triggerUpdate, lazyState.first, lazyState.rows, searchTerm, category, group, subgroup, softoneStatusFilter, ])


    
   
    const editProduct = async (product) => {
        console.log('product')
        console.log(product)
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
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.id === col.id));
        setVisibleColumns(orderedSelectedColumns);
    }

    const renderHeader = () => {
        return (
            <div className="flex lg:no-wrap  sm:flex-wrap">
                <div className="">
                    <span className="p-input-icon-left mr-3 sm:w-full">
                        <i className="pi pi-search" />
                        <InputText  type="search" value={searchTerm} onChange={onSearch} placeholder="Αναζήτηση" />
                    </span>
                </div>
                <div className="sm:mt-1  lg:mt-0">
                    <MultiSelect value={visibleColumns} options={columns} onChange={onColumnToggle} optionLabel="header" className="" display="chip" />
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

 


    const hideDialog = () => {
        setEditDialog(false);
        setClassDialog(false)
    };
    const onSelection = (e) => {
        setSelectedProducts(e.value)
    }



    const onFilterCategoryChange = (e) => {
        setCategory(e.value)
        setGroup(null)
        setSubGroup(null)
        setlazyState({ ...lazyState, first: 0 })
    }

    const onFilterGroupChange = (e) => {
        setGroup(e.value)
        setSubGroup(null)
        setlazyState({ ...lazyState, first: 0 })

    }
    const onFilterSubGroupChange = (e) => {
        setSubGroup(e.value)
        setlazyState({ ...lazyState, first: 0 })
    }
  
    const CategoriesRowFilterTemplate = (options) => {
        useEffect(() => {
            const handleCategories = async () => {
                let { data } = await axios.post('/api/product/apiProductFilters', {
                    action: 'findCategories',
                 
                })
                setCategoriesFilter(data.result)
            }

            handleCategories()
        }, [category])

        const onDelete = () => {
            setCategory(null)
            setGroup(null)
            setSubGroup(null)
        }
        return (
            <div className='flex align-items-center'>
                <Dropdown
                    value={category}
                    options={categroriesFilter}
                    onChange={onFilterCategoryChange}
                    optionLabel="categoryName"
                    placeholder="Φίλτρο Κατηγορίας"
                    className="p-column-filter  grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
            </div>

        )
    };
    
    
    const GroupRowFilterTemplate = (options) => {
        useEffect(() => {
            const handleCategories = async () => {
                let { data } = await axios.post('/api/product/apiProductFilters', {
                    action: 'findGroups',
                    categoryID: category?.softOne.MTRCATEGORY
                })
           
                setGroupFilter(data.result)
            }
            handleCategories()
        }, [category, group])

       
        return (
            <div className='flex align-items-center'>
                <Dropdown
                    disabled={!category ? true : false}
                    value={group}
                    options={groupFilter}
                    onChange={onFilterGroupChange}
                    optionLabel="groupName"
                    placeholder="Φίλτρο Κατηγορίας"
                    className="p-column-filter  grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  setGroup(null)} ></i>
            </div>

        )
    };
    const SubGroupsRowFilterTemplate = (options) => {
        useEffect(() => {
            const handleCategories = async () => {
                let { data } = await axios.post('/api/product/apiProductFilters', {
                    action: 'findSubGroups',
                    groupID: group?.softOne.MTRGROUP
                })
                setSubGroupsFilter(data.result)
            }

            handleCategories()
        }, [group ,subgroup])

        return (
            <div className="flex align-items-center">
                <Dropdown
                    size="small"
                    disabled={!group ? true : false}
                    value={subgroup}
                    options={subGroupsFilter}
                    onChange={onFilterSubGroupChange}
                    optionLabel="subGroupName"
                    placeholder="Φίλτρο Υποομάδας"
                    className="p-column-filter grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  setSubGroup(null)} ></i>
            </div>
        )
    };

    const SoftoneStatusFilter = (options) => {
        const statusOptions = [
            { label: 'Ενεργό', value: true },
            { label: 'Ανενεργό', value: false },
        ]
        return (
            <div className="flex align-items-center">
                <Dropdown
                    size="small"
                    value={softoneStatusFilter}
                    options={statusOptions}
                    onChange={(e) => setSoftoneStatusFilter(e.value)}
                    optionLabel="label"
                    placeholder="Φίλτρο Υποομάδας"
                    className="p-column-filter grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  setSoftoneStatusFilter(null)} ></i>
            </div>
        )
    }

    const softstatusTemplate = ({ SOFTONESTATUS }) => {
        return (
            <SoftoneStatusTemplate softoneStatus={SOFTONESTATUS} />
        )
    }

    const onPage = (event) => {
        setlazyState(event);
    };


    return (
        <AdminLayout >
            <Toast ref={toast} />
            <div className='bg-white p-3 border-round mb-3 flex'>
            <Link href="/dashboard/offers/impaOffers">
            <Button label="Προσφορά πολλαπλών επιλογών" className='mr-2'  />

            </Link>

            </div>
            <ProductToolbar
                setSubmitted={setSubmitted}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts} />
            <DataTable
                first={lazyState.first}
                lazy
                totalRecords={totalRecords}
                onPage={onPage}
                className='product-datatable'
                selectionMode={'checkbox'}
                selection={selectedProducts}
                onSelectionChange={onSelection}
                paginator
                rows={lazyState.rows}
                rowsPerPageOptions={[10, 20 ,50, 100, 200]}
                value={filteredData}
                header={header}
                showGridlines
                dataKey="_id"
                filterDisplay="row"
                loading={loading}
                removableSort
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                editMode="row"
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                paginatorTemplate="RowsPerPageDropdown  PrevPageLink CurrentPageReport NextPageLink "
            >
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '40px' }} />
                <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
                <Column field="NAME" style={{ width: '400px' }} header="Όνομα" ></Column>
             
                
            
                {visibleColumns.some(column => column.id === 5) && <Column field="CATEGORY_NAME" header="Εμπορική Κατηγορία" filter  filterElement={CategoriesRowFilterTemplate}    showFilterMenu={false}></Column>}
                {visibleColumns.some(column => column.id === 6) && <Column field="GROUP_NAME" showFilterMenu={false} filter  filterElement={GroupRowFilterTemplate}  header="Ομάδα" ></Column>}
                {visibleColumns.some(column => column.id === 7) && <Column field="SUBGROUP_NAME" header="Υποομάδα" filter showFilterMenu={false}   filterElement={SubGroupsRowFilterTemplate}></Column>}
                {visibleColumns.some(column => column.id === 2) && <Column field="availability.DIATHESIMA" bodyStyle={{ textAlign: 'center' }} body={productAvailabilityTemplate}  style={{ width: '90px' }} header="Διαθέσιμα" ></Column>}
                {visibleColumns.some(column => column.id === 3) && <Column field="availability.SEPARAGELIA" body={productOrderedTemplate}  style={{ width: '90px' }} header="Παραγγελία" ></Column>}
                {visibleColumns.some(column => column.id === 4) && <Column field="availability.DESVMEVMENA" body={productReservedTemplate} style={{ width: '90px' }} header="Δεσμευμένα" ></Column>}
                {visibleColumns.some(column => column.id === 9) && <Column field="SOFTONESTATUS"    style={{ width: '120px' }}  body={softstatusTemplate} header="Softone Status" filter  filterElement={SoftoneStatusFilter}   ></Column>}
                {visibleColumns.some(column => column.id === 8) &&  <Column field="updatedFrom" header="updatedFrom"   style={{ width: '80px' }} body={UpdatedFromTemplate}></Column>}
                {/* <Column field="softoneProduct.UPDDATE" header="Τελευταία Τροποποίηση Softone" body={Upddate} style={{ width: '80px', textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} sortable></Column> */}
                {/* {visibleColumns.some(column => column.id === 11) && <Column field="impas.englishDescription" style={{ width: '400px' }} header="Impas" ></Column> } */}
                <Column  style={{ width: '40px' }} field="PRICER"  header="Τιμή λιανικής" body={PriceTemplate}></Column>
                {user?.role == "admin" ? <Column style={{ width: '40px' }} body={AddToCartTemplate}></Column>
 : null }
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


const Upddate = ({ softoneProduct: { UPDDATE } }) => {
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
            <GridPriceTemplate PRICER={PRICER} />
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
                    Γερμανική Περιγραφή
                </label>
                <InputTextarea autoResize disabled value={data.descriptions.de} />
            </div>
            <div className="disabled-card">
                <label>
                    Αγγλική Περιγραφή
                </label>
                <InputTextarea autoResize disabled value={data.descriptions.de} />
            </div>
            <div className="disabled-card">
                <label>
                    Γαλλική Περιγραφή
                </label>
                <InputTextarea autoResize disabled value={data.descriptions.de} />
            </div>
            <div className="disabled-card">
                <label>
                    Ισπανική Περιγραφή
                </label>
                <InputTextarea autoResize disabled value={data.descriptions.de} />
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



