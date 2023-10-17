    

import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { setCategory, setGroup, setSubgroup, setFilters, setLazyState, setFiltersLoading } from "@/features/productsSlice";
export const CategoriesRowFilterTemplate = (options) => {
    const {filters, category, group, subgroup, lazyState, loading} = useSelector(store => store.products)
  
  

    useEffect(() => {
     
    }, [category])
    const dispatch = useDispatch()
    const onFilterCategoryChange = (e) => {
        dispatch(setCategory(e.value))
        dispatch(setGroup(null))
        dispatch(setSubgroup(null))
        // setlazyState({ ...lazyState, first: 0 })
    }
    useEffect(() => {
        dispatch(setFiltersLoading(true))
        const handleCategories = async () => {
            
            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'findCategories',
             
            })
            dispatch(setFilters({action: 'category', value: data.result}))
        }
        dispatch(setFiltersLoading(false))
        if(category?.softOne.MTRCATEGORY) {
            handleCategories()
        }
    }, [])

    const onDelete = () => {
        dispatch(setCategory(null))
        dispatch(setGroup(null))
        dispatch(setSubgroup(null))
      
    }
    return (
        <div className='flex align-items-center'>
            <Dropdown
                value={category}
                options={filters.category}
                onChange={onFilterCategoryChange}
                optionLabel="categoryName"
                placeholder="Φίλτρο Κατηγορίας"
                className="p-column-filter  grid-filter w-14rem"
              
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
        </div>

    )
};


export const GroupRowFilterTemplate = (options) => {
    const {filters, category, group, lazyState} = useSelector(store => store.products)
    const dispatch = useDispatch()
    const onFilterGroupChange = (e) => {
        dispatch(setSubgroup(null))
        dispatch(setGroup(e.value))
        dispatch(setLazyState({ ...lazyState, first: 0 }))
    
    }
    
    useEffect(() => {
        const handleCategories = async () => {
            dispatch(setFiltersLoading(true))

            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'findGroups',
                categoryID: category?.softOne.MTRCATEGORY
            })
            dispatch(setFilters({action: 'group', value: data.result}))
            dispatch(setFiltersLoading(false))
        }
        handleCategories()
    }, [category])

   
    return (
        <div className='flex align-items-center'>
            <Dropdown
                disabled={!category ? true : false}
                value={group}
                options={filters.group}
                onChange={onFilterGroupChange}
                optionLabel="groupName"
                placeholder="Φίλτρο Κατηγορίας"
                className="p-column-filter  grid-filter"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={() => dispatch( setGroup(null))} ></i>
        </div>

    )
};


export const SubGroupsRowFilterTemplate = (options) => {
    const {filters, category, group, subgroup, lazyState} = useSelector(store => store.products)
    const dispatch = useDispatch()
    const onFilterSubGroupChange = (e) => {
        dispatch(setSubgroup(e.value))
        dispatch(setLazyState({ ...lazyState, first: 0 }))
   
    }
    
    useEffect(() => {
        dispatch(setFiltersLoading(true))
        const handleCategories = async () => {
            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'findSubGroups',
                groupID: group?.softOne.MTRGROUP
            })
            dispatch(setFilters({action: 'subgroup', value: data.result}))
            dispatch(setLazyState({ ...lazyState, first: 0 }))
            dispatch(setFiltersLoading(false))

        }

        handleCategories()
    }, [group])

    return (
        <div className="flex align-items-center">
            <Dropdown
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
            <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  dispatch(setSubgroup(null))} ></i>
        </div>
    )
};