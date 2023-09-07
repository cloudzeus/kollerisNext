import React from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

const MyComponent = ({ gridData }) => {
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
            <SelectImpas onLoad={memoizedCallback} data={data} loading={loading} gridData={gridData} />
        </div>
    );
};


const SelectImpas = ({ onLoad, data, loading, gridData, setSubmitted }) => {
    const [selectedImpa, setSelectedImpa] = useState(null)
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        englishDescription: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

    });

    useEffect(() => {
        onLoad();
    }, [])



    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


   

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Αναζήτηση" />
                </span>
            </div>
        );
    };

    const header = renderHeader();


    const handleImpaSubmit = async () => {
        console.log(gridData)
        let response = await axios.post('/api/product/apiImpa', { action: 'correlateImpa', id: selectedImpa._id, dataToUpdate: gridData })
        // setVisible(false)
    }
    return (
        <div className="">
            {selectedImpa ? (
                <>  
                    <div>
                        <Button label="Επίλεξε ξανά" onClick={() => setSelectedImpa(null)}/>
                    </div>
                    <div className='surface-100	 p-3 mt-2'>

                        <p className='font-bold  mb-1'>Στοιχεία Αλλαγής:</p>
                        <div>
                            <p className='font-semibold mt-2 '>Περιγραφή:</p>
                            <p>{selectedImpa?.englishDescription}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='font-semibold mt-2 '>Κωδικός:</p>
                            <p>{selectedImpa?.code}</p>
                        </div>
                        <Button severity='warning' label="Αλλαγή Impa" onClick={handleImpaSubmit} />
                    </div>
                </>

            ) : (
                <DataTable
                header={header}
                globalFilterFields={['code', 'englishDescription']}
                loading={loading}
                value={data}
                selectionMode="single"
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 30]}
                selection={selectedImpa}
                onSelectionChange={(e) => setSelectedImpa(e.value)}
                className='w-full'
                filters={filters}
            >
                <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }} />
                <Column field="englishDescription" header="Περιγραφή" sortable style={{ minWidth: '12rem' }} />
            </DataTable>
            )}

          


        </div>
    )
}

export default MyComponent