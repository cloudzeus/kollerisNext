'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Image from 'next/image'
import { Container, GridActions, GridContainer } from './styles';
import { useDispatch } from 'react-redux';
import {
    AddIcon,
    EditIcon,
    DeleteIcon,
    SyncIcon,
} from './config';
import { FormAdd } from './formAdd';
import { FormEdit } from './formEdit';
import Sync from './Sync';
import Grid from './Grid';
import { useSelector } from 'react-redux';
import { setSelectedId } from '@/features/gridSlice';
import { toast } from 'react-toastify';
import { IconContainer } from '@/components/AdminNavbar';
import Notifications from '@/components/Buttons/Notifications';

const GridTable = () => {
    const [id, setId] = useState(null);
    const [data, setData] = useState([]);
    const [ asyncedMarkes, setAsyncedMarkes] = useState([])
    const [action, setAction] = useState(null)
    const {selectedId} = useSelector(state => state.grid)
    const dispatch = useDispatch();
    console.log('asyncedMarke: ' + asyncedMarkes)

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


    //
  
        
      
    useEffect(() => {
            const run = setTimeout(() => {
                const handleSync = async () => {
                    try {
                        const resp = await axios.post('/api/admin/markes/markes', { action: 'sync' })
                        console.log('sync');
                        // console.log(resp.data)
                        setData(resp.data.markes)
                        setAsyncedMarkes(resp.data.markes.length)
                    } catch (error) {
                        console.log(error)
                    }
                }
                handleSync()
            }, 2000);
            return () => clearTimeout(run);
    

        }, [])
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
                        
                        <Notifications
                             onClick={() => handleAction('sync')}
                             num={asyncedMarkes}>
                            <SyncIcon />
                        </Notifications>
                    {!action && <Grid id={id} setId={setId}/>}
                    {action === 'add' && <FormAdd />}
                    {action === 'sync' && <Sync data={data} />}
                    {action === 'edit' && selectedId && <FormEdit />}
                </div>
              

            </Container>
        </>

    )

}





const SyncBtn = styled(IconContainer)`
    border-radius: 10px;
    margin-left: 4px;
`


export default GridTable;



