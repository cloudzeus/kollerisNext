
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SelectImpa from '@/components/ImpaOffer/SelectImpas';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedImpa, setSelectedProducts } from '@/features/impaofferSlice';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';


const ImpaDataTable = () => {
    const [data, setData] = useState([])
    const { selectedImpa, selectedProducts } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch()

    const handleFetch = async () => {
        let { data } = await axios.post('/api/createOffer', { action: 'findImpaProducts', code: selectedImpa?.code })
        setData(data.result)
    }

    useEffect(() => {
        handleFetch()
    }, [])

    const onSelectionChange = (e) => {
        dispatch(setSelectedProducts(e.value))
    }

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.NAME}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.CODE}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item.PRICER}</span>
            </div>
        );
    };


    return (
        <DataTable
        selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={onSelectionChange}
        value={data} className='border-1 border-round-sm	border-50' size="small" >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="Προϊόν" header="Προϊόν" body={itemTemplate}></Column>
    </DataTable>
    )
}

export default ImpaDataTable;