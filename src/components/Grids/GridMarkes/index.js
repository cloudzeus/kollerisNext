'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Image from 'next/image'
import { Container, GridActions, GridContainer } from './styles';
import { useDispatch } from 'react-redux';
import {
    validationRules,
    pageSettings,
    loadingIndicator,
    editOptions,
    toolbarOptions,
    AddIcon,
    EditIcon,
    DeleteIcon,
} from './config';
import { FormAdd } from './formAdd';
import { FormEdit } from './formEdit';
import Grid from './Grid';
import { useSelector } from 'react-redux';
import { setSelectedId } from '@/features/gridSlice';
import { toast } from 'react-toastify';

const GridTable = () => {
    const [data, setData] = useState([]);
    const [id, setId] = useState(null);
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState(null)
    const {selectedId} = useSelector(state => state.grid)
    const dispatch = useDispatch();
    console.log('selectedId: '  + selectedId)


    const handleAction = (action) => {setAction(action)}

   const handleCancel = () => {
        setAction(null)
        dispatch(setSelectedId(null))
    }

    const handleDeleteUser = async () => {
        console.log('delete id')
        console.log(id)
        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'delete', id: id })
            console.log(resp.data)
            handleFetchUser();
        } catch (error) {
            console.log(error)
        }
    }

    const ReturnForms = () => {
        if(action === 'edit' && selectedId) {
            return (<FormEdit />)
        }
        
        if( action==='edit' && !selectedId) {
            setAction(null)
            toast.error('Δεν έχει επιλεγεί εγγραφή') 
        }
    }

    return (
        <>
            <Container p="0px" className="box">
                <div className="header">
                    <h2 className="boxHeader">Μάρκες</h2>
                </div>
               
                <div className="innerContainer" >
                <GridActions >
                    <button onClick={() => handleAction('add')}>
                        <AddIcon /> Προσθήκη
                    </button>
                    <button onClick={() => handleAction('edit')}>
                        <EditIcon /> Διόρθωση
                    </button>
                    <button onClick={handleDeleteUser}>
                        <DeleteIcon /> Διαγραφή
                    </button>
                    <button onClick={handleCancel}>
                        <DeleteIcon /> Ακύρωση
                    </button>
                </GridActions>
                    {!action && <Grid id={id} setId={setId}/>}
                    {action === 'add' && <FormAdd />}
                    {action === 'edit' && selectedId && <FormEdit />}
                </div>
              

            </Container>
        </>

    )

}








export default GridTable;



