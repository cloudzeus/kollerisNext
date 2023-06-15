'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
// import { Container, GridActions, GridContainer } from './styles';
import { IndexWrapper, GridActions, GridContainer } from '@/componentsStyles/grid/gridStyles';
import {MdOutlineKeyboardBackspace} from 'react-icons/md';

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
import { fetchNotSynced, setSelectedId, setAction, findSoftoneAndSyncTables, } from '@/features/grid/gridSlice';
import Notifications from '@/components/Buttons/Notifications';
import SoftOneExtra from './softone/addAllSoftone';
import { ImList2 } from 'react-icons/im';






const GridTable = () => {
    const [id, setId] = useState(null);
    const { selectedId, asyncedMarkes, action } = useSelector(state => state.grid)
    const dispatch = useDispatch();
    const gridActionCondition = (a) => (action !== a && action !== null) ? 'disabled' : ''

    const handleAction = (action) => {
        dispatch(setAction(action))
    }
    const handleCancel = () => {
        dispatch(setAction(null))
        dispatch(setSelectedId(null))
    }

    
    const handleSyncButton = () => {
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
        <IndexWrapper p="0px" className="box">
            <div className="header">
                <h2 className="boxHeader">Μάρκες</h2>
            </div>
            <div className="innerContainer" >
                <GridActions action={action}>
                    <button className="grid-icon" onClick={handleCancel} >
                        <ImList2 />
                    </button>
                    <button className="grid-icon" onClick={handleCancel} >
                        <MdOutlineKeyboardBackspace />
                    </button>
                    <button 
                        className={(action !== 'add' && action !== null) ? 'disabled' : ''}
                        disabled={(action !== 'add' && action !== null) ? true : false}
                        onClick={() => handleAction('add')}>
                        <AddIcon  className={(action !== 'add' && action !== null) ? 'disabled' : ''}/> Προσθήκη
                    </button>
                    <button 
                        className={(action !== 'edit' && action !== null) ? 'disabled' : ''}
                        disabled={(action !== 'edit' && action !== null) ? true : false}
                        onClick={() => {
                        if (selectedId) {
                            handleAction('edit')
                        } else { toast.error('Δεν έχετε επιλέξει εγγραφή') }
                    }}>
                        <EditIcon className={(action !== 'edit' && action !== null) ? 'disabled' : ''} /> Διόρθωση
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

        </IndexWrapper>

    )

}





export default GridTable;



