
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import axios from 'axios';

export default function PickListProduct() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);

    
    const handleFetch = async () => {
        let res = await axios.post('/api/product/apiManufacturers', { action: 'findAll' })
        setSource(res.data.result)
        console.log(res.data.result)
    }
    useEffect(() => {
        handleFetch()
    }, []);

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.softOne.NAME}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.softOne.MTRMANFCTR}</span>
                    </div>
                </div>
                {/* <span className="font-bold text-900">${item.price}</span> */}
            </div>
        );
    };

    return (
        <div className="card">
            <PickList source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} filter filterBy="name" breakpoint="1400px"
                sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '30rem' }} targetStyle={{ height: '30rem' }}
                sourceFilterPlaceholder="Search by name" targetFilterPlaceholder="Search by name" />
        </div>
    );
}