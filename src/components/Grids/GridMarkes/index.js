'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, GridActions, GridContainer } from './styles';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
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
import { fetchNotSynced,setSelectedId, setAction, findSoftoneAndSyncTables } from '@/features/grid/gridSlice';
import Notifications from '@/components/Buttons/Notifications';
import SoftOneExtra from './softone/addAllSoftone';


const GridTable = () => {
    const [id, setId] = useState(null);
    const { selectedId, asyncedMarkes, action} = useSelector(state => state.grid)
    const dispatch = useDispatch();


    const handleAction = (action) => { dispatch(setAction(action)) }
    const handleCancel = () => {
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


   const findExtraSoftone = async () => {
        handleAction('findSoftoneExtra')
        dispatch(findSoftoneAndSyncTables())
   }
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
                        <button onClick={() => {
                            if(selectedId) {
                                handleAction('edit')
                            } else {toast.error('Δεν έχετε επιλέξει εγγραφή')}
                        }}>
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
                    <button onClick={findExtraSoftone}>Νέες Εγγραφές στο softone</button>
                    <div>
                        {!action && <Grid id={id} setId={setId} />}
                        {action === 'add' && <FormAdd />}
                        {action === 'sync' && <Sync />}
                        {action === 'edit' && selectedId && <FormEdit />}
                        {action === 'findSoftoneExtra' && <SoftOneExtra />}
                    </div>
                </div>

            </Container>

    )

}





export default GridTable;



