'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/router';
import { Dropdown } from "primereact/dropdown";
import {
    setCategory,
    setGroup,
    setSubgroup,
    setFilters,
    setLazyState,
    setLoading,
    resetSelectedFilters,
    setSearchTerm,
    setSort,
    setSelectedProducts
} from "@/features/productsSlice";


const ProductSearchGrid = () => {
    const dispatch = useDispatch()
    const { filters, category, group, subgroup, lazyState, loading, searchTerm, sort, selectedProducts } = useSelector(store => store.products)
    const { selectedMarkes, mtrLines, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState([])

  
    const fetch = async () => {
        if (!searchTerm) {
            dispatch(setLoading(true))
        }
        try {
            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'productSearchGrid',
                searchTerm: searchTerm,
                skip: lazyState.first,
                limit: lazyState.rows,
                categoryID: category?.softOne.MTRCATEGORY,
                groupID: group?.softOne.MTRGROUP,
                subgroupID: subgroup?.softOne.cccSubgroup2,
                mtrmark: selectedMarkes?.mtrmark,
                sort: sort
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
    }, [selectedMarkes, lazyState.rows, lazyState.first, searchTerm, category, group, subgroup, sort])

    useEffect(() => {
        dispatch(setLazyState({ ...lazyState, first: 0 }))

    }, [selectedMarkes])

    const onSelectionChange = (e) => {
        dispatch(setSelectedProducts(e.value))
    }

    const onPage = (event) => {
        dispatch(setLazyState({ ...lazyState, first: event.first, rows: event.rows }))
    };



    const onFilterCategoryChange = (e) => {
        dispatch(setCategory(e.value))

    }
    const onFilterGroupChange = (e) => {
        dispatch(setGroup(e.value))
    }
    const onFilterSubGroupChange = (e) => {
        dispatch(setSubgroup(e.value))
    }


    const Search = () => {
        const onSort = () => {

            dispatch(setSort())

        }
        return (
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
        )
    }


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


    const MarkesFilterTemplate = (options) => {
        // useEffect(() => {
        //     const handleCategories = async () => {
        //         let { data } = await axios.post('/api/product/apiProductFilters', {
        //             action: 'findMarkes',
        //             markes: mtrmark
        //         })
        //         dispatch(setFilters({ action: 'subgroup', value: data.result }))

        //     }
        //     handleCategories()
        // }, [group])

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

    return (
        <DataTable
            value={data}
            paginator
            loading={loading}
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
            first={lazyState.first}
            lazy
            totalRecords={totalRecords}
            onPage={onPage}
            selectionMode={'checkbox'}
            selection={selectedProducts}
            onSelectionChange={onSelectionChange}
            className='border-1 border-round-sm	border-50'
            size="small"
            filterDisplay="row"
            id={'_id'}

        >
            <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
            <Column field="MTRMARK_NAME" header="Όνομα Μάρκας" showFilterMenu={false} filterElement={MarkesFilterTemplate}></Column>
            <Column field="NAME" filter showFilterMenu={false} filterElement={Search} body={NameTemplate} header="Προϊόν"></Column>
            <Column field="CATEGORY_NAME" header="Εμπορική Κατηγορία" filter filterElement={CategoriesRowFilterTemplate} showFilterMenu={false}></Column>
            <Column field="GROUP_NAME" showFilterMenu={false} filter filterElement={GroupRowFilterTemplate} header="Ομάδα" ></Column>
            <Column field="SUBGROUP_NAME" header="Υποομάδα" filter showFilterMenu={false} filterElement={SubGroupsRowFilterTemplate}></Column>
            <Column field="availability.DIATHESIMA" header="Διαθέσιμα"></Column>

        </DataTable>
    )
}


const NameTemplate = ({ NAME, SOFTONESTATUS }) => {
   
    return (
        <div>
            <p className='font-bold'>{NAME}</p>
            <div className='flex align-items-center'>
                <div style={{ width: '5px', height: '5px' }} className={`${SOFTONESTATUS === true ? "bg-green-500" : "bg-red-500"} border-circle mr-1 mt-1`}></div>
                <p>softone</p>
            </div>
        </div>
    )
}


export default ProductSearchGrid;