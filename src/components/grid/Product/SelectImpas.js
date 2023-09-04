import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { set } from 'mongoose';


const MyComponent = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const memoizedCallback = useCallback(
      async () => {
        // Do something
        const fetch = async () => {
            setLoading(true)
            const res = await axios.post('/api/product/apiImpa', { action: 'find' })
            console.log('dataaa')
            console.log(data)
            setData(res.data.data)
            setLoading(false)
        }
        fetch()
      },
      [data]
    );
  
    return (
      <div>
        <SelectImpas onLoad={memoizedCallback}  data={data} loading={loading}/>
      </div>
    );
  };


const SelectImpas = ({onLoad, data, loading}) => {
    const [options, setOptions] = useState([])
    const [selectedImpa, setSelectedImpa] = useState(null)
    const [visible, setVisible] = useState(false);



    const handleButton = async () => {
        onLoad();
        setVisible(prev => !prev);
    }

    const footer = () => {
        return (
            <Button  label={"Επιλογή" }   className={'w-full'}  onClick={(e) => setVisible(false)} />
        )
    }
    return (
        <div className="card flex justify-content-center">
            <Button  label={ "Επιλογή Impa" }   onClick={handleButton} />
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
           
        </div>
    )
}

export default MyComponent