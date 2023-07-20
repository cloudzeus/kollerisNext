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
import {ActionDiv } from '@/componentsStyles/grid';
import DeletePopup from '@/components/deletePopup';
import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import Image from 'next/image';
import Flag from 'react-world-flags'
import styled from 'styled-components';


export default function Manufacturers() {
   
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const [stat, setStat] = useState()
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);


    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });


    const handleFetch = async () => {
        let res = await axios.post('/api/product/apiHelperInfo', { action: 'findUnits' })
        console.log(res.data.result)
        setData(res.data.result)
    }

    useEffect(() => {
        handleFetch()
    }, [])




    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
                </span>
            </>
        );
    };
    const header = renderHeader();

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };



    

    const dialogStyle = {
        marginTop: '10vh', // Adjust the top margin as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',

    };


    const CountryIcon = (props) => {
        return (
            <div className="flex align-content-center justify-content-start">
                <Flag code={ props.INTERCODE} style={{width: '40px', height: '15px'}} />
                <span className="ml-2">{props.NAME}</span>
            </div>
        )
    }

 
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <CountriesDetailCard stat={data?.length} />
            <DataTable
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                dataKey="_id"
                filters={filters}
                paginatorRight={true}
                removableSort
                onFilter={(e) => setFilters(e.filters)}
                loading={loading}
                editMode="row"
                selectOnEdit
            >   
                <Column field="NAME" header="'Ονομα"  sortable></Column>
                <Column field="SHORTCUT" header="SHORTCUT"  sortable></Column>
         
            </DataTable>
           
        </AdminLayout >
    );
}








const CountriesDetailCard = ({stat}) => {
    return (
        <div className="mb-3 surface-0 shadow-1 p-3 border-1 border-50 border-round">
        <div className="flex justify-content-between ">
            <div>
                <span className="block text-500 font-medium mb-3">Units</span>
                <div className="text-900 font-medium text-xl">{stat}</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-tag text-orange-500 text-xl"></i>
            </div>
        </div>
        {/* <span className="text-green-500 font-medium">%52+ </span>
        <span className="text-500">since last week</span> */}
    </div>
    )
}
















