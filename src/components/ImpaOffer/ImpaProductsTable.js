

'use client'
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedImpa, setSelectedProducts, setDataSource} from '@/features/impaofferSlice';



const ImpaDataTable = () => {
    const [data, setData] = useState([])
    const { selectedImpa, selectedProducts, mtrLines } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch()

    const onAllProductsClick = () => {
        dispatch(setDataSource(2))
    }

 
    const handleFetch = async () => {
        let { data } = await axios.post('/api/createOffer', { action: 'findImpaProducts', code: selectedImpa?.code })
        setData(data.result)
    }

    useEffect(() => {
        if(selectedImpa == null) return;
        handleFetch()
    }, [selectedImpa])

    const onSelectionChange = (e) => {
        dispatch(setSelectedProducts(e.value))

    }

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item?.NAME}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item?.CODE}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item?.PRICER}</span>
            </div>
        );
    };


    return (
        <>
            { data.length > 0 ? (
                <DataTable
                    selectionMode={'checkbox'}
                    selection={selectedProducts}
                    onSelectionChange={onSelectionChange}
                    value={data}
                    className='border-1 border-round-sm	border-50'
                    size="small"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="Προϊόν" header="Προϊόντα συσχετισμένα με Impa" body={itemTemplate}></Column>
                </DataTable>
            ) : (
                <div className='bg-white p-4 border-round '>
                    <div className='flex align-items-center'>
                        <i className="pi pi-info-circle" style={{ fontSize: '1.5rem', color: 'orange' }}></i>
                        <div className='ml-3'>
                            <p>Δεν υπάρχουν προϊόντα συσχετισμένα στον κωδικό Impa <span className='font-bold'>{selectedImpa?.code}</span></p>
                            <p>Αλλάξτε πηγή δεδομένων και αναζητείστε όλα τα προϊόντα</p>

                        </div>
                        

                    </div>
                    <div className='mt-3 ml-4'>
                        <p>Τα προίόντα που θα προσθέσετε στο holder θα συνδεθούν με αυτόν τον IMPA </p>   
                        <Button className='mt-3' icon="pi pi-tag" severity='warning' label="όλα τα Προϊόντα" onClick={onAllProductsClick} />
     
                    </div>

                </div>
            )}
        </>

    )
}

export default ImpaDataTable;