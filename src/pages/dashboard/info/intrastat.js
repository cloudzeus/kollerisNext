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


    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });


    const handleFetch = async () => {
        let res = await axios.post('/api/product/apiHelperInfo', { action: 'findIntrastats' })
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


    


    return (
        <AdminLayout >
            <Toast ref={toast} />
            
            <DataTable
                loading={data.length == 0 ? true : false}
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
                editMode="row"
                selectOnEdit
            >   
                <Column field="CODE" header="Κωδικός"  sortable></Column>
                <Column field="NAME" header="Όνομα"   sortable></Column>
                <Column field="NAME1" header="Όνομα 1"  sortable></Column>
         
            </DataTable>
           
        </AdminLayout >
    );
}























