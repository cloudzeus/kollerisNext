'use client'
import React, { useState, useEffect, useRef, useContext, lazy } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { useDispatch } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { MultiSelect } from 'primereact/multiselect';
import { TabView, TabPanel } from 'primereact/tabview';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import ProductActions from '@/components/grid/Product/ProductActions';
import { EditDialog, AddDialog } from '@/GridDialogs/ProductDialog';
import ClassificationDialog from '@/GridDialogs/product/ClassificationDialog';
import ProductToolbar from '@/components/grid/Product/ProductToolbar';
import { ProductAvailability, ProductOrdered, ProductReserved } from '@/components/grid/Product/ProductAvailability';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'
import { ProductQuantityProvider, ProductQuantityContext } from '@/_context/ProductGridContext';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import StepHeader from '@/components/StepHeader';
import { OverlayPanel } from 'primereact/overlaypanel';
import XLSXDownloadButton from '@/components/exportCSV/Product';
import { useSelector } from 'react-redux';
import {
    setCategory,
    setGroup,
    setSubgroup,
    setFilters,
    setLazyState2,
    setLoading,
    resetSelectedFilters,
    setSearchTerm,
    setSort,
    setSoftoneFilter,
    setSortAvailability,
    setMarka,
    setSortPrice,
} from "@/features/productsSlice";

const dialogStyle = {
    marginTop: '10vh', // Adjust the top margin as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

};



const initialColumns = [
    {
        header: 'Εμπορική Κατηγορία',
        id: 9
    },
    {
        header: 'Ομάδα',
        id: 10
    },
    {
        header: 'Υποομάδα',
        id: 11
    },
    {
        header: 'Διαθέσιμα',
        id: 12
    },


]

const columns = [
    ...initialColumns,
    {
        header: 'UpdatedFrom',
        id: 1
    },
   
    {
        header: 'Ordered',
        id: 2,
    },
    {
        header: 'Reserved',
        id: 3,
    },
    {
        header: 'Brands',
        id: 4,
    },
    {
        header: 'EAN Code',
        id: 5,
    },
    {
        header: 'Ιmpa Code',
        id: 6,
    },


]







export default function ProductLayout() {
    return (
        <ProductQuantityProvider>
            <Product />
        </ProductQuantityProvider>
    )
}

function Product() {
    const op = useRef(null);
    const toast = useRef(null);
    const router = useRouter();
    const { data: session } = useSession()
    let user = session?.user?.user;

    const { selectedProducts, setSelectedProducts, submitted, setSubmitted } = useContext(ProductQuantityContext)
    const [data, setData] = useState([]);
    const [editDialog, setEditDialog] = useState(false);
    const [classDialog, setClassDialog] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(initialColumns)
    const [expandedRows, setExpandedRows] = useState(null);
    const [addDialog, setAddDialog] = useState(false);
    const [codeSearch, setCodeSearch] = useState('');
    const [filterImpa, setFilterImpa] = useState(0)
    const { filters, category, group, subgroup, lazyState2, loading, searchTerm, sort,  softoneFilter, sortAvailability, marka, sortPrice} = useSelector(store => store.products)
    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchTerm(''))
    }, [])


    useEffect(() => {
        if (submitted) fetch()
    }, [submitted])


    const fetch = async () => {
        if (!searchTerm && !codeSearch) {
            dispatch(setLoading(true))
        }
        try {
            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'productSearchGrid',
                searchTerm: searchTerm,
                skip: lazyState2.first,
                limit: lazyState2.rows,
                categoryID: category?.softOne.MTRCATEGORY,
                groupID: group?.softOne.MTRGROUP,
                subgroupID: subgroup?.softOne.cccSubgroup2,
                sort: sort,
                softoneFilter: softoneFilter,
                marka: marka,
                codeSearch: codeSearch,
                filterImpa: filterImpa,
                sortPrice: sortPrice,
            },
            )
            setData(data.result);
            setTotalRecords(data.totalRecords)
            dispatch(setLoading(false))

        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        fetch();
    }, [
        lazyState2.rows, 
        lazyState2.first, 
        searchTerm, 
        category, 
        group, 
        subgroup, 
        sort, 
        marka,
        softoneFilter, 
        sortAvailability, 
        setSubmitted,
        codeSearch,
        filterImpa,
        sortPrice,
    ])


    //Define filter actions:
    const onFilterCategoryChange = (e) => {
        dispatch(setCategory(e.value))

    }
    const onFilterImpa = (e) => {
        setFilterImpa(e.value)

    }
    const onFilterGroupChange = (e) => {
        dispatch(setGroup(e.value))
    }
    const onFilterSubGroupChange = (e) => {
        dispatch(setSubgroup(e.value))
    }

    const onFilterMarkChange = (e) => {
        dispatch(setMarka(e.value))
    }


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


    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.id === col.id));
        setVisibleColumns(orderedSelectedColumns);
    }

    const renderHeader = () => {
        const optionsSoft = [
            {name: 'IN softone', value: true},
            {name: 'NOT IN softone', value: false},
            {name: 'Χωρίς Φίλτρο', value: null}
        ]
        const onOptionChange = (e) => {
            dispatch( setSoftoneFilter(e.value))
        }

        return (
            <div className="flex lg:no-wrap  sm:flex-wrap justify-content-between">
                <div className='flex'>
                <div className='mr-2'>
                <Dropdown
                    emptyMessage="Δεν υπάρχουν υποομάδες"
                    size="small"
                    value={softoneFilter}
                    options={optionsSoft}
                    onChange={onOptionChange}
                    optionLabel="name"
                    placeholder="Φίλτρο Softone"
                    className="p-column-filter grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                </div>
                <div className="sm:mt-1  lg:mt-0">
                    <MultiSelect className="w-20rem" value={visibleColumns} options={columns} onChange={onColumnToggle} optionLabel="header" display="chip" />
                </div>
                </div>
                <div>
                    <XLSXDownloadButton products={selectedProducts} />
                </div>
            </div>

        );
    };


    const header = renderHeader();


    const addProduct = async (product) => {
        setSubmitted(false);
        setAddDialog(true)
    }
    const AddToCartTemplate = (rowData) => {

        return (
            <ProductActions
                rowData={rowData}
                onEdit={editProduct}
                onAdd={addProduct}
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
        setAddDialog(false)
        setClassDialog(false)
    };
    const onSelection = (e) => {
        setSelectedProducts(e.value)
    }



    const onPage = (event) => {
        dispatch(setLazyState2({ ...lazyState2, first: event.first, rows: event.rows }))
    };

    const CategoriesRowFilterTemplate = (options) => {
        useEffect(() => {
            const handleCategories = async () => {
                let { data } = await axios.post('/api/product/apiProductFilters', {
                    action: 'findCategories',
                })
                dispatch(setFilters({ action: 'category', value: data.result }))
            }
            handleCategories()

        }, [])

        const onDelete = () => {
            dispatch(resetSelectedFilters())

        }
        return (
            <div className="flex align-items-center">
                <div className='flex align-items-center'>
                    <Dropdown
                        emptyMessage="Δεν υπάρχουν κατηγορίες"
                        value={category}
                        options={filters.category}
                        onChange={onFilterCategoryChange}
                        optionLabel="categoryName"
                        placeholder="Φίλτρο Κατηγορίας"
                        className="p-column-filter  grid-filter w-14rem"

                    />
                    <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
                </div>

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
                dispatch(setFilters({ action: 'group', value: data.result }))
            }
            handleCategories()
        }, [category])


        return (
            <div className='flex align-items-center'>
                <Dropdown
                    emptyMessage="Δεν υπάρχουν ομάδες"
                    disabled={!category ? true : false}
                    value={group}
                    options={filters.group}
                    onChange={onFilterGroupChange}
                    optionLabel="groupName"
                    placeholder="Φίλτρο Κατηγορίας"
                    className="p-column-filter  grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch(setGroup(null))} ></i>
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
                dispatch(setFilters({ action: 'subgroup', value: data.result }))

            }
            handleCategories()
        }, [group])

        return (
            <div className="flex align-items-center">
                <Dropdown
                    emptyMessage="Δεν υπάρχουν υποομάδες"
                    size="small"
                    disabled={!group ? true : false}
                    value={subgroup}
                    options={filters.subgroup}
                    onChange={onFilterSubGroupChange}
                    optionLabel="subGroupName"
                    placeholder="Φίλτρο Υποομάδας"
                    className="p-column-filter grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch(setSubgroup(null))} ></i>
            </div>
        )
    };
    const HasImpa = () => {
        let options = [
            {name: 'Με Impa', value: 1},
            {name: 'Όλα', value: 0},
        ]
      
        return (
            <div className="flex align-items-center">
                <Dropdown
                    size="small"
                    value={filterImpa}
                    options={options}
                    onChange={onFilterImpa}
                    optionLabel="name"
                    placeholder="Φίλτρο Impa"
                    className="p-column-filter grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
            </div>
        )
    };

 

    const onSearchName = () => {
        const onSort = () => {
            dispatch(setSort())

        }
        return (
            <div>
            <div className="flex align-items-center justify-content-start w-20rem ">
                <div className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm} placeholder='Αναζήτηση Προϊόντος' onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
                </div>
                <div className='ml-3'>
                    {sort === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
                    {sort === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
                    {sort === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
                </div>
            </div>
        </div> 
        )
    }

    const MarkesFilter = () => {
        useEffect(() => {
            const handleCategories = async () => {
                let { data } = await axios.post('/api/product/apiProductFilters', {
                    action: 'findBrands',
                })
                dispatch(setFilters({ action: 'marka', value: data.result }))

            }
            handleCategories()

        }, [])
        return (
            <div className='flex align-items-center'>
                <Dropdown
                    emptyMessage="Δεν υπάρχουν υποομάδες"
                    size="small"
                    filter
                    value={marka}
                    options={filters.marka}
                    onChange={onFilterMarkChange}
                    optionLabel="softOne.NAME"
                    placeholder="Φίλτρο Υποομάδας"
                    className="p-column-filter grid-filter"
                    style={{ minWidth: '14rem', fontSize: '12px' }}
                />
                <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch(setMarka(null))} ></i>
            </div>
        )
    }

    const SearchEAN = () => {
        const onSort = () => {

            dispatch(setSort())

        }
        return (
            <div className="flex align-items-center justify-content-start w-20rem ">
                <div className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText value={codeSearch} placeholder='Αναζήτηση Kωδικού' onChange={(e) => setCodeSearch(e.target.value)} />
                </div>
                <div className='ml-3'>
                    {sort === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
                    {sort === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
                    {sort === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
                </div>
            </div>
        )
    }

    const SortPrice = () => {
        const onSort = () => {
            dispatch(setSortPrice())
        }
        return (
                  <div className='ml-3'>
                    {sortPrice === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
                    {sortPrice === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
                    {sortPrice === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
                </div>
        )
    }

    return (
        <AdminLayout >
            <Toast ref={toast} />
            <div>
                <StepHeader text="Προϊόντα" />
            </div>
            <Button className='mb-3' type="button" severity="secondary" icon="pi pi-bars" label="Προσφορές" onClick={(e) => op.current.toggle(e)} />

            <OverlayPanel ref={op}>
            <div className='flex flex-column'>
                <Button label="Προσφορές πολλαπλών επιλογών" outlined severity='secondary' className='mt-2 w-20rem' onClick={() => router.push("/dashboard/multi-offer")} />
                <Button label="Προσφορές σε πελάτη" outlined severity='secondary'  className='mb-3 mt-1 w-20rem' onClick={() => router.push("/dashboard/offer")} />
            </div>
            </OverlayPanel>
           

            <ProductToolbar
                setSubmitted={setSubmitted}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts} />
            <DataTable
                header={header}
                first={lazyState2.first}
                lazy
                totalRecords={totalRecords}
                onPage={onPage}
                className='product-datatable'
                selectionMode={'checkbox'}
                selection={selectedProducts}
                onSelectionChange={onSelection}
                paginator
                rows={lazyState2.rows}
                rowsPerPageOptions={[50, 100, 200, 500]}
                value={data}
                showGridlines
                dataKey="MTRL"
                filterDisplay="row"
                loading={loading}
                removableSort
                editMode="row"
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
            // paginatorTemplate="RowsPerPageDropdown  PrevPageLink CurrentPageReport NextPageLink "
            >
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '40px' }} />
                <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
                {user?.role == "admin" ? <Column style={{ width: '60px' }} body={AddToCartTemplate} frozen={true} alignFrozen="right"></Column>
                    : null}
                <Column field="NAME" style={{ width: '400px' }} header="Όνομα" filter showFilterMenu={false} filterElement={ onSearchName} body={NameTemplate} ></Column>
                {visibleColumns.some(column => column.id === 6) && ( <Column field="impas.code" header="Κωδικός Impa" body={ImpaCode} filter filterElement={HasImpa} showFilterMenu={false}></Column>)}
                {visibleColumns.some(column => column.id === 9) && ( <Column field="CATEGORY_NAME"   header="Εμπορική Κατηγορία" filter filterElement={CategoriesRowFilterTemplate} showFilterMenu={false}></Column>)}
                {visibleColumns.some(column => column.id === 10) && (<Column field="GROUP_NAME" showFilterMenu={false} filter filterElement={GroupRowFilterTemplate} header="Ομάδα" ></Column>)}
                {visibleColumns.some(column => column.id === 11) && (<Column field="SUBGROUP_NAME" header="Υποομάδα" filter showFilterMenu={false} filterElement={SubGroupsRowFilterTemplate}></Column>)}
                {visibleColumns.some(column => column.id === 12) &&  ( 
                <Column 
                    field="availability.DIATHESIMA" 
                    bodyStyle={{ textAlign: 'center' }} 
                    body={productAvailabilityTemplate} 
                    style={{ width: '90px' }} 
                    header="Διαθέσιμα" 
                    ></Column>)}
                {visibleColumns.some(column => column.id === 1) && <Column field="availability.SEPARAGELIA" body={productOrderedTemplate} style={{ width: '90px' }} header="Παραγγελία" ></Column>}
                {visibleColumns.some(column => column.id === 2) && <Column field="availability.DESVMEVMENA" body={productReservedTemplate} style={{ width: '90px' }} header="Δεσμευμένα" ></Column>}
                {visibleColumns.some(column => column.id === 3) && <Column field="updatedFrom" header="updatedFrom" style={{ width: '80px' }} body={UpdatedFromTemplate}></Column>}
                {visibleColumns.some(column => column.id === 4) && <Column field="MTRMARK_NAME" style={{ width: '300px' }} header="Όνομα Μάρκας" filter showFilterMenu={false} filterElement={MarkesFilter}></Column>}
                {visibleColumns.some(column => column.id === 5) && <Column field="CODE" header="EAN" filter showFilterMenu={false} filterElement={SearchEAN}></Column>}
                <Column style={{ width: '40px' }} field="PRICER" header="Τιμή λιανικής" body={PriceTemplate}  filter showFilterMenu={false} filterElement={SortPrice} ></Column>
                <Column style={{ width: '40px' }} field="PRICER05" header="Τιμή Scroutz"></Column> 
            </DataTable>
            <EditDialog
                style={dialogStyle}
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
            <ClassificationDialog
                dialog={classDialog}
                setDialog={setClassDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
        </AdminLayout >
    );
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
                    Αγγλική Περιγραφή
                </label>
                <InputTextarea autoResize disabled value={data.descriptions?.en} />
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




const NameTemplate = ({ NAME, SOFTONESTATUS, impas}) => {
    return (
        <div>
            <p className='font-medium'>{NAME}</p>
            <div className='flex mt-1'>
            <div className='flex align-items-center'>
                <div style={{ width: '5px', height: '5px' }} className={`${SOFTONESTATUS === true ? "bg-green-500" : "bg-red-500"} border-circle mr-1 mt-1`}></div>
                <p className='text-500'>softone</p>
            </div>
            </div>
            
        </div>
    )
}


const ImpaCode = ({impas}) => {
    return (
        <div>
            <p className='font-bold'>{impas?.code}</p>
            <p>{impas?.englishDescription || impas?.greekDescription }</p>

        </div>
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


const GridPriceTemplate = ({ PRICER }) => {
    return (
        <p>{PRICER} €</p>
    )
}


const SortAvailable = () => {
    const  { sortAvailability} = useSelector(store => store.products)
    const dispatch = useDispatch();
    const onSort = () => {
        dispatch(setSortAvailability())
    }
    return (
        <div className='ml-3'>
        { sortAvailability === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
        {sortAvailability === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
        {sortAvailability === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
    </div>
    )
}