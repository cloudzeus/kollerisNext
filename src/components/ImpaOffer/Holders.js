import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { setHolderPage, setSelectedImpa } from '@/features/impaofferSlice';
import StepHeader from './StepHeader';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';


const Holders = () => {
    const [counter, setCounter] = useState([])
    const {holderPage} = useSelector(state => state.impaoffer)
    const  dispatch = useDispatch();

    const Holders = () => {
        return (
            <>
                {counter.map((item, index) => {
                    return (
                        <HolderItem id={item.id} counter={counter} setCounter={setCounter} index={index} />
                    )
                })}
            </>
        )

    }

    return (
        <div className=''>
            <div className='bg-white mt-3 border-round p-4 flex align-item-center justify-content-between'>
                <div>
                    <Button icon="pi pi-plus" label="Νέο Holder" severity='warning' onClick={() => dispatch(setHolderPage(prev => !prev))} />
                </div>
                <div>
                </div>
            </div>
            {/* <Holders counter={counter} setCounter={setCounter} /> */}
        </div>
    )
}



const HolderItem = ({ counter, id, setCounter, index }) => {

    const onDelete = () => {
        let update = counter.filter((item, index) => item.id !== id)
        setCounter(update)
    }


    
    return (
        <div className='bg-white mt-1 border-round p-4 flex align-item-center justify-content-between'>
            <div className='flex'>
                <p className='mr-2'>{id}</p>
                <p>Impa: 25320</p>
            </div>
            <div className='flex'>
                <p className='mr-4'>Σύνολο Προϊόντων: <span className='font-bold'>5</span></p>
                <i className="pi pi-trash" onClick={onDelete}></i>

            </div>
        </div>
    )
}
export default  Holders;