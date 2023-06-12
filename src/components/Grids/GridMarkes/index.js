'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
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
import { fetchNotSynced,setSelectedId, setAction } from '@/features/grid/gridSlice';
import Notifications from '@/components/Buttons/Notifications';

const GridTable = () => {
    const [id, setId] = useState(null);
    const [data, setData] = useState([]);
    const { selectedId, asyncedMarkes, notSyncedData, action} = useSelector(state => state.grid)
    const dispatch = useDispatch();


    console.log('action', action)
    const handleAction = (action) => { dispatch(setAction(action)) }
    const handleCancel = () => {
        setAction(null)
        dispatch(setAction(null))
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

    const handleSyncButton =  () => {
        handleAction('sync')
    }



    useEffect(() => {
        dispatch(fetchNotSynced());
       
    }, [dispatch])
    return (
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
                        ml="10px"
                        onClick={handleSyncButton}
                        num={asyncedMarkes}>
                        <SyncIcon />
                    </Notifications >
                    {!action && <Grid id={id} setId={setId} />}
                    {action === 'add' && <FormAdd />}
                    {action === 'sync' && <Sync />}
                    {action === 'edit' && selectedId && <FormEdit />}
                </div>

            </Container>

    )

}





export default GridTable;



