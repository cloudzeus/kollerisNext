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
import MassiveImageUpload from '@/components/MassiveImageUpload';
import format from 'date-fns/format';
import { el } from 'date-fns/locale';
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
    setSubmitted,
    setMarka,
    setSortPrice,
    setSelectedProducts
} from "@/features/productsSlice";
import Image from 'next/image';
import styled from 'styled-components';
import ProductImagesComp from '@/components/grid/Product/ProductImageComp';


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
    {
        header: 'Όνομα',
        id: 14
    },
]

const columns = [
    ...initialColumns,
    {
        header: 'UpdatedFrom',
        id: 1
    },

    {
        header: 'Δεσμευμένα',
        id: 2,
    },
    
    {
        header: 'Μάρκα',
        id: 4,
    },
    {
        header: 'EAN/Barcode',
        id: 5,
    },
    {
        header: 'Κωδ. ΙMPA',
        id: 6,
    },
    {
        header: 'Τιμη Scroutz',
        id: 7,
    },
    {
        header: 'Τιμή Κόστους',
        id: 13,
    },
    {
        header: 'Minimized',
        id: 15,
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
    const [data, setData] = useState([]);
    const { selectedProducts, submitted, filters, category, group, subgroup, lazyState2, loading, searchTerm, sort, softoneFilter, sortAvailability, marka, sortPrice } = useSelector(store => store.products)
    const [totalRecords, setTotalRecords] = useState(0);
    const [editDialog, setEditDialog] = useState(false);
    const [classDialog, setClassDialog] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(initialColumns)
    const [expandedRows, setExpandedRows] = useState(null);
    const [addDialog, setAddDialog] = useState(false);
    const [stateFilters, setStateFilters] = useState({
        impa: 0,
        images: null,
        codeSearch: '',
        skroutz: null,
        active: true,
    })
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchTerm(''))
    }, [])

    useEffect(() => {
         fetch()
    }, [submitted])


    const fetch = async () => {
        if (!searchTerm && !stateFilters.codeSearch) {
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
                sortPrice: sortPrice,
                stateFilters: stateFilters,
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
        submitted,
        stateFilters,
        sortPrice,
      
    ])


    //Define filter actions:
    const onFilterCategoryChange = (e) => {
        dispatch(setCategory(e.value))

    }
    const onFilterImpa = (e) => {
        setStateFilters(prev => ({ ...prev, impa: e.value }))

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
        dispatch(setSubmitted())
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
        //change the visible columns
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.id === col.id));
        setVisibleColumns(orderedSelectedColumns);
    }


    

    const RenderHeader = () => {
        const op2 = useRef(null);
        const optionsSoft = [
            { name: 'IN softone', value: true },
            { name: 'NOT IN softone', value: false },
            { name: 'Χωρίς Φίλτρο', value: null }
        ]
        const onOptionChange = (e) => {
            dispatch(setSoftoneFilter(e.value))
        }

        const clearAllFilters = () => {
            dispatch(resetSelectedFilters())
            setStateFilters(prev => ({ ...prev, impa: 0, images: null, codeSearch: '', active: true}))
        }

        const makeMinimalGrid = () => {
            if(visibleColumns.some(column => column.id === 15)) setVisibleColumns(initialColumns)
            else   setVisibleColumns([
                {
                    header: 'Minimized',
                    id: 15,
                },
                {
                    header: 'Κόστος',
                    id: 13,
                },
                {
                    header: 'Διαθέσιμα',
                    id: 12,
                }
            ])
        }
        return (
            <div className="flex lg:no-wrap  sm:flex-wrap justify-content-between">

                <div className='flex'>
                    <div>
                        <Button type="button" size="small" className='mr-2' severity="secondary" label="Minimal Grid" onClick={makeMinimalGrid} />
                    </div>
                    <div className="card flex flex-column align-items-center gap-3">
                        <span className="p-buttonset">
                            <Button type="button" size="small" icon="pi pi-filter" onClick={(e) => op2.current.toggle(e)} />
                            <Button type="button" size="small" className='bg-primary-400' onClick={clearAllFilters} icon="pi pi-filter-slash" />
                        </span>
                        <OverlayPanel ref={op2} >
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-1'>Κατηγορία:</span>
                                <CategoriesRowFilterTemplate value={category} options={filters.category} onChange={onFilterCategoryChange} />
                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-1'>Oμάδα:</span>
                                <GroupRowFilterTemplate value={group} options={filters.group} onChange={onFilterGroupChange} category={category} />
                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-1'>Yποομάδα:</span>
                                <SubGroupsRowFilterTemplate value={subgroup} options={filters.subgroup} onChange={onFilterSubGroupChange} group={group} />
                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-1'>Mάρκα:</span>
                                <MarkesFilter value={marka} options={filters.marka} onChange={onFilterMarkChange} />
                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-2'>SoftOne status:</span>
                                <div className='mr-2'>
                                    <Dropdown
                                        size="small"
                                        value={softoneFilter}
                                        options={optionsSoft}
                                        onChange={onOptionChange}
                                        optionLabel="name"
                                        placeholder="Φίλτρο Softone"
                                        className="p-column-filter grid-filter"
                                        style={{ minWidth: '14rem', fontSize: '12px' }}
                                    />
                                    <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  dispatch(setSoftoneFilter( { name: 'Χωρίς Φίλτρο', value: null }))} ></i>

                                </div>

                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-2'>Φίλτρο Εικόνας:</span>
                                <WithImages value={stateFilters.images} setState={setStateFilters} />
                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-2'>Φίλτρο Skroutz:</span>
                                <IsSkroutz value={stateFilters.skroutz} setState={setStateFilters} />
                            </div>
                            <div className='mb-2 ' >
                                <span className='font-bold block mb-2'>Φίλτρο Ενεργού Προϊόντος:</span>
                                <IsActive value={stateFilters.active} setState={setStateFilters} />
                            </div>

                        </OverlayPanel>
                    </div>
                    <div className="ml-2">
                        <MultiSelect className="w-15rem" value={visibleColumns} options={columns} onChange={onColumnToggle} optionLabel="header" display="chip" />
                    </div>

                </div>
                <div>
                    <XLSXDownloadButton products={selectedProducts} />
                </div>
            </div>

        );
    };


    const header = RenderHeader();


    const addProduct = async (product) => {
        dispatch(setSubmitted())
        // setSubmitted(false);
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
            <div className="card p-20" style={{maxWidth: '1000px'}}>
                <TabView>
                    <TabPanel header="Φωτογραφίες">
                        <ProductImagesComp id={data._id}/>
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
        dispatch(setSelectedProducts(e.value))
    }



    const onPage = (event) => {
        dispatch(setLazyState2({ ...lazyState2, first: event.first, rows: event.rows }))
    };


    const HasImpa = () => {
        let options = [
            { name: 'Με Impa', value: 1 },
            { name: 'Όλα', value: 0 },
        ]

        return (
            <div className="flex align-items-center">
                <Dropdown
                    size="small"
                    value={stateFilters.filterImpa}
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



    const SearchEAN = () => {
        const onSort = () => {

            dispatch(setSort())

        }
        return (
            <div className="flex align-items-center justify-content-start w-20rem ">
                <div className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText value={stateFilters.codeSearch} placeholder='Αναζήτηση Kωδικού' onChange={(e) => setStateFilters(prev => ({...prev, codeSearch: e.target.value}))} />
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


    const OnFilterCategory = () => {
        return (
            <CategoriesRowFilterTemplate value={category} options={filters.category} onChange={onFilterCategoryChange} />
        )
    }
    const OnFilterGroup = () => {
        return <GroupRowFilterTemplate value={group} options={filters.group} onChange={onFilterGroupChange} category={category} />
    }

    const OnFilterSubgroup = () => {
        return <SubGroupsRowFilterTemplate value={subgroup} options={filters.subgroup} onChange={onFilterSubGroupChange} group={group} />
    }

    const OnFilterMarka = () => {
        return <MarkesFilter value={marka} options={filters.marka} onChange={onFilterMarkChange} />
    }


    
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <div>
                <StepHeader text="Προϊόντα" />
            </div>
            <Button type="button" className='mb-3' severity="secondary" icon="pi pi-bars" label="Menu" onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op}>
                <div className='flex flex-column'>
                    <Button label="Προσφορές πολλαπλών επιλογών" outlined severity='secondary' className='mt-2 w-20rem' onClick={() => router.push("/dashboard/multi-offer")} />
                    <Button label="Προσφορές σε πελάτη" outlined severity='secondary' className='mb-3 mt-1 w-20rem' onClick={() => router.push("/dashboard/offer")} />
                    < MassiveImageUpload />

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
                dataKey="_id"
                filterDisplay="row"
                loading={loading}
                removableSort
                editMode="row"
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
            >

                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '40px' }} />
                <Column selectionMode="multiple" style={{ width: '30px' }} headerStyle={{ width: '30px' }}></Column>
                {user?.role == "admin" ? <Column style={{ width: '60px' }} body={AddToCartTemplate} frozen={true} alignFrozen="right"></Column>
                    : null}
                <Column body={ImagesTemplate} style={{ width: '30px' }}></Column>

                {visibleColumns.some(column => column.id === 14) && (
                    <Column
                        field="NAME"
                        style={{ minWidth: '400px' }}
                        header="Όνομα"
                        filter
                        showFilterMenu={false}
                        filterElement={onSearchName}
                        body={NameTemplate} >
                    </Column>
                )}
                {visibleColumns.some(column => column.id === 15) && (
                    <Column
                        field="NAME"
                        style={{ minWidth: '400px' }}
                        header="Όνομα"
                        filter
                        showFilterMenu={false}
                        filterElement={onSearchName}
                        body={MinimalTemplate} >
                    </Column>
                )}
                {visibleColumns.some(column => column.id === 6) && (
                    <Column
                        field="impas.code"
                        header="Κωδικός Impa"
                        body={ImpaCode}
                        filter
                        filterElement={HasImpa}
                        showFilterMenu={false}>
                    </Column>
                )}
                {visibleColumns.some(column => column.id === 9) && (
                    <Column
                        field="CATEGORY_NAME"
                        header="Εμπορική Κατηγορία"
                        filter
                        filterElement={OnFilterCategory}
                        showFilterMenu={false}>
                    </Column>
                )}
                {visibleColumns.some(column => column.id === 10) && (
                    <Column
                        field="GROUP_NAME"
                        showFilterMenu={false}
                        filter
                        filterElement={OnFilterGroup}
                        header="Ομάδα" >
                    </Column>
                )}
                {visibleColumns.some(column => column.id === 11) && (
                    <Column
                        field="SUBGROUP_NAME"
                        header="Υποομάδα"
                        filter
                        showFilterMenu={false}
                        filterElement={OnFilterSubgroup}>
                    </Column>
                )}
                {visibleColumns.some(column => column.id === 12) && (
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
                {visibleColumns.some(column => column.id === 4) && (
                    <Column
                        field="MTRMARK_NAME"
                        style={{ width: '300px' }}
                        header="Όνομα Μάρκας"
                        filter
                        showFilterMenu={false}
                        filterElement={OnFilterMarka}>
                    </Column>)}
                {visibleColumns.some(column => column.id === 5) && (<Column field="CODE1" header="EAN" filter showFilterMenu={false} filterElement={SearchEAN}></Column>)}
                {visibleColumns.some(column => column.id === 13) && <Column field="COST" header="Τιμή Κόστους" body={Cost} ></Column>}
                <Column  style={{ width: '40px' }} field="PRICER" header="Τιμή λιανικής" body={PriceTemplate} filter showFilterMenu={false} filterElement={SortPrice} ></Column>
                {visibleColumns.some(column => column.id === 7) && <Column field="PRICER01" header="Τιμή Scroutz"></Column>}
                {/* <Column style={{ width: '40px' }} field="PRICER01" header="Τιμή Scroutz"></Column> */}
            </DataTable>
            <EditDialog
                style={dialogStyle}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                // setSubmitted={setSubmitted}

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


const ImagesTemplate = ({ _id, images }) => {
    const router = useRouter();
    const imageOp = useRef(null)
    const [isLoading, setIsLoading] = useState(true);

    const onImageLoad = () => {
        setIsLoading(false);
    };
    let image = images[0]?.name;
    const onClick = () => {
        router.push(`/dashboard/images/product/${_id}`)
    }
    return (
        <div className="flex justify-content-center cursor-pointer" onClick={onClick} >
            {image ? (
                <div onMouseEnter={(e) => imageOp.current.toggle(e)} onMouseLeave={(e) => imageOp.current.toggle(e)}>
                    <ImageDiv  >
                        <Image
                            alt="product-images"
                            src={`https://kolleris.b-cdn.net/images/${image}`}
                            fill={true}
                            sizes="50px"
                            onLoad={onImageLoad}
                        />
                    </ImageDiv>

                </div>

            ) : (
                <i className="pi pi-image text-400" style={{ fontSize: '1rem' }}></i>
            )}
            <OverlayPanel style={{ width: '200px' }} ref={imageOp}>
                <ImageOverlay>
                    <Image
                        alt="product-images"
                        src={`https://kolleris.b-cdn.net/images/${image}`}
                        fill={true}
                        sizes="100vw"
                        loading="lazy"
                    />
                </ImageOverlay>
            </OverlayPanel>
            {/* <i className={`pi pi-image cursor-pointer ${hasImage ? "text-primary font-md" : "text-400"}`} style={{ fontSize: '1rem' }} onClick={onClick}></i> */}
        </div>
    )

}


const MinimalTemplate = ({ NAME, CATEGORY_NAME, GROUP_NAME, SUBGROUP_NAME, SOFTONESTATUS, availability, updatedAt }) => {

    const yourDate = new Date(updatedAt);
    const formattedDate = format(yourDate, 'dd-MM-yyyy:HH:mm', { locale: el });
    return (
        <div className='flex flex-column'>
            <span className='font-semibold '>{NAME} </span>
            <span className='mb-2 text-xs' >
               Ημ. ενημέρωσης: 
                <span className='font-semibold text-primary'>{ ` ${formattedDate}`}</span>
            </span>
            <div>
                <div className='flex align-items-center'>
                    <i className="pi pi-tag mr-1 mt-1 text-600" style={{ fontSize: '10px' }}></i>
                    <span className='text-600' style={{ fontSize: '11px' }}>{CATEGORY_NAME}</span>
                    <i className="pi pi-tag mr-1 ml-2 mt-1 text-600" style={{ fontSize: '10px' }}></i>
                    <span className='text-600' style={{ fontSize: '11px' }}>{GROUP_NAME}</span>
                </div>
                <div>
                    <div className='flex align-items-center'></div>
                    <i className="pi pi-tag mr-1 mt-1 text-600" style={{ fontSize: '10px' }}></i>
                    <span className='text-600' style={{ fontSize: '11px' }}>{SUBGROUP_NAME ? SUBGROUP_NAME : '-----'}</span>
                </div>
                <div className='flex align-items-center'>
                    <div style={{ width: '5px', height: '5px' }} className={`${SOFTONESTATUS === true ? "bg-green-500" : "bg-red-500"} border-circle mr-1 mt-1`}></div>
                    <p className='text-500'>softone</p>
                </div>
                {availability?.DIATHESIMA === '0' ? (
                     <div className=' bg-red-500 text-white p-1 flex align-items-center justify-content-center  mt-1' 
                     style={{padding: '2px 4px', borderRadius: '3px', height: '18px', fontSize:'10px', maxWidth: '70px'}}>
                        <p style={{marginBottom: '2px'}}>not available</p>
                     </div>
                ) : null}
               
            </div>
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
    const [vat, setVat] = useState('');
    const handleVat = async () => {
        const res = await axios.post('/api/vat', {
            action: 'findVatName',
            VAT: data?.VAT
        })
        console.log('vat')
        console.log(res.data.result)
        setVat(res.data.result)
    }
    useEffect(() => {
        handleVat()

    }, [])

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
                <InputText disabled value={data?.MTRMARK_NAME
} />
            </div>
            <div className="disabled-card">
                <label>
                    Kατασκευαστής
                </label>
                <InputText disabled value={data?.MMTRMANFCTR_NAME} />
            </div>
            <div className="disabled-card">
                <label>
                    ΕΑΝ
                </label>
                <InputText disabled value={data?.CODE1} />
            </div>
            <div className="disabled-card">
                <label>
                    ΦΠΑ
                </label>
                <InputText onChange={handleVat} disabled value={vat} />
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

const Cost = ({ COST }) => {
    return (
        <div>
            <p className='font-bold'>{`${COST}€`}</p>
        </div>
    )
}


const NameTemplate = ({ NAME, SOFTONESTATUS, isSkroutz, ISACTIVE, availability }) => {
    return (
        <div>
            <p className='font-medium'>{NAME}</p>
            <div className='flex border-round'>

                <div className='flex align-items-center'>
                    <div style={{ width: '5px', height: '5px' }} className={`${SOFTONESTATUS === true ? "bg-green-500" : "bg-red-500"} border-circle mr-1 mt-1`}></div>
                    <p className='text-500'>softone</p>
                </div>
                <div className='flex align-items-center ml-2'>
                    <div style={{ width: '5px', height: '5px' }} className={`${ISACTIVE ? "bg-green-500" : "bg-red-500"} border-circle mr-1 mt-1`}></div>
                    <p className='text-500'>active</p>
                </div>
                {isSkroutz ? (
                    <div className='flex align-items-center ml-2'>
                        <div style={{ width: '5px', height: '5px' }} className={`bg-orange-500 border-circle mr-1 mt-1`}></div>
                        <p className='text-500'>skroutz</p>
                    </div>
                ) : null}
                {availability?.DIATHESIMA === '0' ? (
                     <div className=' bg-red-500 text-white p-1 flex align-items-center justify-content-center ml-2 mt-1' 
                     style={{padding: '2px 4px', borderRadius: '3px', height: '18px', fontSize:'10px',  maxWidth: '70px'}}>
                        <p style={{marginBottom: '2px'}}>not available</p>
                     </div>
                ) : null}
               
            </div>

        </div>
    )
}

const ImpaCode = ({ impas }) => {
    return (
        <div>
            <p className='font-bold'>{impas?.code}</p>
            <p>{impas?.englishDescription || impas?.greekDescription}</p>

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


const CategoriesRowFilterTemplate = ({ value, options, onChange }) => {
    const dispatch = useDispatch();
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
            <Dropdown
                emptyMessage="Δεν υπάρχουν κατηγορίες"
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="categoryName"
                placeholder="Φίλτρο Κατηγορίας"
                className="p-column-filter  grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}

            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
        </div>

    )
};



const GroupRowFilterTemplate = ({ category, options, onChange, value }) => {
    
    const dispatch = useDispatch()
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
                disabled={!category ? true : false}
                emptyMessage="Δεν υπάρχουν ομάδες"
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="groupName"
                placeholder="Φίλτρο Ομάδας"
                className="p-column-filter  grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch(setGroup(null))} ></i>
        </div>

    )
};



const SubGroupsRowFilterTemplate = ({ value, options, group, onChange }) => {
   
    const dispatch = useDispatch()
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
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="subGroupName"
                placeholder="Φίλτρο Υποομάδας"
                className="p-column-filter grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch(setSubgroup(null))} ></i>
        </div>
    )
};



const WithImages = ({ value, setState }) => {
    const options = [
        { name: 'Με φωτογραφία', value: true },
        { name: 'Χωρίς φωτογραφία', value: false },
        { name: 'Χωρίς φίλτρο', value: null }
    ]

    const onChange = (e) => {
        setState(prev => ({ ...prev, images: e.value }))
    }

    const onClear = () => {
        setState(prev => ({ ...prev, images: null }))
    }
    return (
        <div className='flex align-items-center'>
            <Dropdown
                size="small"
                filter
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="name"
                placeholder="Φίλτρο Φωτογραφίας"
                className="p-column-filter grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onClear} ></i>
        </div>
    )
}

const IsActive= ({setState, value}) => {
    const options = [
        { name: 'Ενεργό', value: true },
        { name: 'Ανενεργό', value: false },
        { name: 'Όλα', value: null }
    ]

    const onChange = (e) => {
        setState(prev => ({ ...prev, active: e.value }))
    }

    const onClear = () => {
        setState(prev => ({ ...prev, active: null }))
    }
    return (
        <div className='flex align-items-center'>
            <Dropdown
                size="small"
                filter
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="name"
                placeholder="Φίλτρο ενεργού προϊόντος"
                className="p-column-filter grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onClear} ></i>
        </div>
    )
}
const IsSkroutz = ({setState, value}) => {
    const options = [
        { name: 'Είναι στο Skroutz', value: true },
        { name: 'Δεν είναι στο Skroutz', value: false },
        { name: 'Όλα', value: null }
    ]

    const onChange = (e) => {
        setState(prev => ({ ...prev, skroutz: e.value }))
    }

    const onClear = () => {
        setState(prev => ({ ...prev, skroutz: null }))
    }
    return (
        <div className='flex align-items-center'>
            <Dropdown
                size="small"
                filter
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="name"
                placeholder="Φίλτρο Skroutz"
                className="p-column-filter grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onClear} ></i>
        </div>
    )
}
const MarkesFilter = ({ value, options, onChange }) => {
    const dispatch = useDispatch();
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
                emptyMessage="Δεν υπάρχουν Μάρκες"
                size="small"
                filter
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="softOne.NAME"
                placeholder="Φίλτρο Mάρκας"
                className="p-column-filter grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch(setMarka(null))} ></i>
        </div>
    )
}


const ImageDiv = styled.div`
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #d9d9d8;
    position: relative;
    width: 50px;
    height: 30px;
    img {
        object-fit: cover;
    }
`
const ImageOverlay = styled.div`
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    position: unset !important;
    width: 100%;
    height: 100%;
    img {
        object-fit: contain;
        width: 100% !important;
        position: relative !important;
        height: unset !important;
    }
`