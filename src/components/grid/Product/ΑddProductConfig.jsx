'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'


// const [selectState, setSelectState] = useState({
//     category: null,
//     group: null,
//     subgroup: null,
// })


export const Categories = ({ state, setState }) => {

    const [options, setOptions] = useState([])
    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProductFilters', { action: 'findCategories' })
        setOptions(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [])

    const onChange = (e) => {
       setState((prev) => {
        return { 
            ...prev, 
            category: e.value,
            group: null,
            subgroup: null
        }
       })
    }

    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή Κατηγορίας</span>
            <div className='flex align-items-center'>
                <Dropdown 
                    value={state} 
                    onChange={onChange} 
                    options={options} 
                    optionLabel="categoryName"
                    placeholder="Κατηγορία" 
                    className="w-full" 
                    
                    />
                <i className="pi pi-times ml-3 cursor-pointer" onClick={() => setState((prev) => ({ ...prev, category: null, group:null, subgroup: null }))} ></i>
            </div>


        </div>
    )
}

export const Groups = ({ state, setState, id }) => {
   
    const [groupOptions, setGroupOptions] = useState([])

    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProductFilters', {
            action: 'findGroups',
            categoryID: id
        })
        setGroupOptions(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [id])

    const onChange = (e) => {
        setState((prev) => {
            return { 
                ...prev, 
                group: e.value, 
                subgroup: null,
            }
        })
    }

    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή Ομάδας</span>
            <div className="flex align-items-center">
                <Dropdown 
                    disabled={!id} 
                    value={state} 
                    onChange={onChange} 
                    options={groupOptions} 
                    optionLabel="groupName"
                    placeholder="Oμάδα" 
                    className="w-full" />
                <i 
                className="pi pi-times ml-3 cursor-pointer" 
                onClick={() => setState((prev) => ({ ...prev, group: null, subgroup:null }))} >
                </i>
            </div>
        </div>
    )
}

export const SubGroups = ({ state, setState, id }) => {
    const [subgroupOptions, setsubGroupOptions] = useState([])
    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProductFilters', {
            action: 'findSubGroups',
            groupID: id
        })

        setsubGroupOptions(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [id])

    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή Υποομάδας</span>
            <div className="flex align-items-center">
                <Dropdown 
                    value={state} 
                    onChange={(e) => setState(prev => ({ ...prev, subgroup: e.value }))} 
                    options={subgroupOptions} 
                    optionLabel="subGroupName"
                    placeholder="Υποομάδα" 
                    className="w-full"
                    disabled={!id}
                />

                <i className="pi pi-times ml-2 cursor-pointer" onClick={() => setState(prev => ({ ...prev, subgroup: null }))} ></i>
            </div>


        </div>
    )
}




export const Brands  = ({state, setState}) => {
    const [brands, setBrands] = useState([])
    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProductFilters', {
            action: 'findBrands',
        })
        setBrands(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [])

    const onMarkChange = (e) => {
        setState(prev => ({ ...prev, brand: e.value }))
    }
    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή Μάρκας</span>
            <div className="flex align-items-center">
                <Dropdown 
                    value={state} 
                    onChange={onMarkChange} 
                    options={brands} 
                    optionLabel="softOne.NAME"
                    placeholder="Μάρκα" 
                    className="w-full"
                    filter
                />

                <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  setState(prev => ({ ...prev, brand: null }))} ></i>
            </div>


        </div>
    )
}

export const ManufacturerSelect = ({state, setState}) => {
    const [manuf, setManuf] = useState([])


    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiManufacturers', {
            action: 'findAll',
        })
       setManuf(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [])

    const onChange = (e) => {
        setState(prev => ({ ...prev, manufacturer: e.value }))
    }
    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή Κατασκευαστή</span>
            <div className="flex align-items-center">
                <Dropdown 
                    value={state} 
                    onChange={onChange} 
                    options={manuf} 
                    optionLabel="NAME"
                    placeholder="Κατασκευαστής" 
                    className="w-full"
                />

                <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  setState(prev => ({ ...prev, manufacturer: null }))} ></i>
            </div>


        </div>
    )
}
export const VatSelect = ({state, setState}) => {
    const [vat, setVat] = useState([])


    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiHelperInfo', {
            action: 'findVat',
        })
        setVat(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [])

    const onChange = (e) => {
        setState(prev => ({ ...prev, vat: e.value }))
    }
    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή ΦΠΑ</span>
            <div className="flex align-items-center">
                <Dropdown 
                    value={state} 
                    onChange={onChange} 
                    options={vat} 
                    optionLabel="NAME"
                    placeholder="ΦΠΑ" 
                    className="w-full"
                />

                <i className="pi pi-times ml-2 cursor-pointer" onClick={() =>  setState(prev => ({ ...prev, vat: null }))} ></i>
            </div>


        </div>
    )
}