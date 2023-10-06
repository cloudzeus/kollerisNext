import React, { useState, useEffect } from "react";
import { setSelectedMarkes, setProductData } from "@/features/supplierOrderSlice";
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { useSelector, useDispatch } from 'react-redux';
export default function FilterMTRMARK() {
    const {selectedMarkes, searchTerm} = useSelector(state => state.supplierOrder)
    const [markes, setMarkes] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetch = async () => {
            let {data} = await axios.post('/api/createOrder', {
                action: 'fetchMarkes',
            })
            setMarkes(data.result)
        
            console.log(data.result)
        }
        fetch();
    }, [])

    const selectedTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.softOne.NAME}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

  

    return (
        <div className="card flex  p-2">
            <Dropdown 
                disabled={searchTerm !== '' ? true : false}
                value={selectedMarkes} 
                onChange={(e) => dispatch(setSelectedMarkes(e.value))} 
                options={markes} 
                optionLabel="softOne.NAME" 
                placeholder="Επιλογή Μάρκας" 
                filter 
                valueTemplate={selectedTemplate } 
                className="w-full md:w-14rem" 
                showClear={true}
            />
        </div>    
    )
}