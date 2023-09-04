import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';


const SelectImpas = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState([])
    const [selectedImpa, setSelectedImpa] = useState(null)
    const [visible, setVisible] = useState(false);

    console.log(options)
    useEffect(() => {
        setLoading(true)
        const fetch = async () => {
            const res = await axios.post('/api/product/apiImpa', { action: 'find' })
            setData(res.data.data)
            setLoading(false)
        }
        fetch()
       
    }, [])



    const footer = () => {
        return (
            <Button  label={"Επιλογή" }   className={'w-full'}  onClick={(e) => setVisible(false)} />
        )
    }
    return (
        <div className="card flex justify-content-center">
            <Button  label={ "Επιλογή Impa" }   onClick={(e) => setVisible(prev => !prev)} />
            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <DataTable 
                    loading={loading} 
                    value={data}  
                    selectionMode="single" 
                    scrollable
                    scrollHeight='400px' 
                    selection={selectedImpa} 
                    onSelectionChange={(e) =>  setSelectedImpa(e.value)}
                    className='w-full'
                    footer={footer}
                    >
                    <Column field="code" header="Code" sortable style={{minWidth: '12rem'}} />
                    <Column field="englishDescription" header="Περιγραφή" sortable style={{minWidth: '12rem'}} />
                </DataTable>
            </Dialog>
            {/* <OverlayPanel ref={op} showCloseIcon >
                <DataTable 
                    loading={loading} 
                    dataKey="code" 
                    value={data}  
                    selectionMode="single" 
                    scrollable 
                    scrollHeight='200px' 
                    selection={selectedProduct} 
                    onSelectionChange={(e) => setSelectedProduct(e.value)}
                    className='w-full'
                    >
                    <Column field="code" header="Code" sortable style={{minWidth: '12rem'}} />
                </DataTable>
            </OverlayPanel> */}
        </div>
    )
}

export default SelectImpas