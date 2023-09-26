

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


export default function impaOffers() {


    const { selectedImpa } = useSelector(state => state.impaoffer)
    const [chooseImpa, setChooseImpa] = useState(true)


    useEffect(() => {
        console.log(selectedImpa)
        if (selectedImpa) {
            setChooseImpa(false)
        }
    }, [selectedImpa])


    return (
        <AdminLayout>
            <Button label="Επιλογή Impa" className='mb-3' onClick={() => { setChooseImpa(true) }} />
            {chooseImpa ? (<SelectImpa />) : (<PickListComp />)}
        </AdminLayout>

    );
}


const PickListComp = () => {
    const [data, setData] = useState([])
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch()
    console.log('data')
    console.log(data)
    const handleFetch = async () => {
        let {data} = await  axios.post('/api/product/apiImpa', { action: 'findImpaProducts', code: selectedImpa.code })
       
        setData(data.result)
    }
    useEffect(() => {
        handleFetch()
    }, [])



    const renderHeader = () => {
        return (
            <div className="flex lg:no-wrap  sm:flex-wrap">
                <div className="">
                    <span className="p-input-icon-left mr-3 sm:w-full">
                        <i className="pi pi-search" />
                        <InputText  type="search" placeholder="Αναζήτηση" />
                    </span>
                </div>
              
            </div>

        );
    };
  

    const header = renderHeader();
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
                <span className="font-bold text-900">${item.price}</span>
            </div>
        );
    };



    return (
        <div >
            <DataTable header={header} value={data} className='border-1 border-round-sm	border-50' size="small"     >
                <Column field="Προϊόν" header="Προϊόν" body={itemTemplate}></Column>
            </DataTable>
        </div>
    )

}