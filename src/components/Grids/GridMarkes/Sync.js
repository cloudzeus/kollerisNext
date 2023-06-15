import React, { useEffect, useState, useCallback } from 'react'
import styled from "styled-components";
import axios from "axios";
import { Input } from "@/components/Forms/newInputs/InputClassic";
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SyncIcon from '@mui/icons-material/Sync';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchNotSynced, updateNotSynced, notSyncedData } from '@/features/grid/gridSlice';
import { useSelector } from 'react-redux';
import { SyncItemsContainer } from '@/componentsStyles/grid/gridStyles';

const Sync = () => {

    const [isSynced, setIsSynced] = useState([])
    const dispatch = useDispatch();
    const { notSyncedData } = useSelector(state => state.grid)
    const [sync, setSync] = useState({
        syncTo: 'Softone',
        syncFrom: 'Eμάς'
    })


    const changeSync = () => {
        if (sync.syncTo === 'Softone') {
            setSync({
                syncTo: 'Εμάς',
                syncFrom: 'Softone'
            })
        } else {
            setSync({
                syncTo: 'Softone',
                syncFrom: 'Εμάς'
            })
        }
    }


    const syncItem = async (index, item) => {
        let resData;
        if (sync.syncTo === 'Εμάς') {
            //if we update our schema, send Softone data:
            resData = item.softoneObject

        }
        if (sync.syncTo === 'Softone') {
            //if we update softone, send Our Shcema data:
            resData = item.ourObject
        }


        //HIDE ITEMS AFTER UPDATE:
        dispatch(updateNotSynced({ syncTo: sync.syncTo.toString(), resData: resData }))
            .then((res) => {
                let updated = res.payload.updated;
                if (updated) {
                    setIsSynced((prevActiveItems) => {
                        const updatedActiveItems = [...prevActiveItems];
                        updatedActiveItems[index] = !updatedActiveItems[index];
                        return updatedActiveItems;
                    });
                    toast.success('Eπιτυχία')
                }
            }).catch((err) => {
                console.log(err)
            })
            dispatch(fetchNotSynced())


    }


    const CompareInputs = ({ our, softone }) => {
        if (sync.syncTo === 'Softone') {
            return (
                <>
                    <span className="input">{our.NAME}</span>
                    <span className="input">{softone.NAME}</span>
                </>
            )
        }
        else {
            return (
                <>
                    <span className="input">{softone.NAME}</span>
                    <span className="input">{our.NAME}</span>

                </>
            )
        }


    }

    return (

        <SyncItemsContainer isSynced={isSynced} >
            <div className="header-top">
                <div className="syncDiv" onClick={changeSync}>
                    < SyncAltIcon />
                    <p>
                        από:
                        <span> {sync.syncFrom} </span>
                        σε:
                        <span> {sync.syncTo}</span>
                    </p>

                </div>
                <div>
                    <SyncIcon />
                    <span>Mαζικός Συγχρονισμός</span>
                </div>
            </div>

            {notSyncedData.map((item, index) => {
                const isItemSynced = isSynced[index];
                const formsContainerClassName = isItemSynced ? 'formsContainer synced filled-border' : 'formsContainer';
                let our = item?.ourObject;
                let softone = item?.softoneObject
                let isChecked = true;
                return (
                    <div className={formsContainerClassName} key={index}>
                        <div className="item-primary-key">
                            <span>Kωδικός:</span>
                            <span>{softone.CODE}</span>
                        </div>
                        <div className="grid">
                            <CompareInputs our={our} softone={softone} />
                            <button className='sync-button' onClick={() => {
                                syncItem(index, item)
                            }}>
                                <SyncIcon />
                            </button>
                        </div>
                    </div>
                )

            })}
        </ SyncItemsContainer>
    )
}









export default Sync