

import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SelectImpa from '@/components/ImpaOffer/SelectImpas';



export default function impaOffers() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lazyLoading, setLazyLoading] = useState(false);
 
  
   


   
    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.englishDescription
                    }</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.code}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item.price}</span>
            </div>
        );
    };

    return (
        <AdminLayout>
            <Button label="Επιλογή Impa" className='mb-3' />
            <SelectImpa />

            {/* <div className="card bg-white pt-5 pb-5">
                <PickList loading={loading} source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} breakpoint="1400px"
                    sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '30rem' }} targetStyle={{ height: '30rem' }} />
            </div> */}
        </AdminLayout>

    );
}

