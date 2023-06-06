import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import axios from "axios";
import { Input } from "@/components/Forms/newInputs/InputClassic";
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SyncIcon from '@mui/icons-material/Sync';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';



const Sync = ({data}) => {
    const [isSynced, setIsSynced] = useState([])
    const [loading, setLoading] = useState(false);
    console.log(data)
    const [sync, setSync] = useState({
        syncTo: 'Softone',
        syncFrom: 'Eμάς'
    })

    console.log(sync.syncTo)
    

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

    const syncItem = (index, data) => {
        setLoading(true);
        let resData;
        if(sync.syncTo === 'Εμάς') {
            //if we update our schema, send Softone data:
            resData = data.softoneObject
            
        }
        if(sync.syncTo === 'Softone') {
              //if we update softone, send Our Shcema data:
            resData = data.ourObject
        }
        let res = axios.post('/api/admin/markes/markes', { action: 'syncAndUpdate', syncTo: sync.syncTo.toString(), data: resData })
        setIsSynced((prevActiveItems) => {
            const updatedActiveItems = [...prevActiveItems];
            updatedActiveItems[index] = !updatedActiveItems[index];
            return updatedActiveItems;
        });
        if(res?.modifiedCount == 0) {
            toast.error('Αποτυχία Συγχρονισμού')
        }
        setLoading(false);
    }
    return (


        <Container isSynced={isSynced} >
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

            {data.map((item, index) => {
                const isItemSynced = isSynced[index];
                const formsContainerClassName = isItemSynced ? 'formsContainer synced' : 'formsContainer';
                let our = item?.ourObject;
                let softone = item?.softoneObject
                return (
                    <>
                        <div className={formsContainerClassName} key={item?.ourObject.name}>
                           
                            <div className="item-primary-key">
                                <span>Kωδικός:</span>
                                <span>{softone.CODE}</span>
                            </div>
                            <div className="grid"> 
                            {sync.syncTo === 'Softone' ? (
                                <>   
                                    <span  className="input">{our.NAME}</span>
                                    <span  className="input">{softone.NAME}</span>
                                </>
                            ) : (
                                <>  
                                  <span  className="input">{softone.NAME}</span>
                                <span className="input">{our.NAME}</span>
                                  
                                </>
                            )}
                            <button className='sync-button' onClick={() => {
                                syncItem(index, item)
                            }}>
                                <SyncIcon />
                            </button>
                            </div>
                          
                        </div>
                    </>
                )

            })}
        </Container>
    )
}




const Container = styled.div`
    .header-top {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            margin-top: 20px;
            
        }

    .header-top div {
        display: flex;
        align-items: center;
        margin-right: 10px;
        border-radius: 4px;
        border: 1px solid ${props => props.theme.palette.border};
        padding: 10px;
        font-size: 13px;
        height: 40px;
        cursor: pointer;
    }

    .header-top div svg {
        color: ${props => props.theme.palette.primary.main};
    }

    h1 {
        font-size: 15px;
    }
  
    .syncDiv p {
        font-size: 13px;
        font-weight: bold;
        /* color: ${props => props.theme.palette.primary.main}; */
        font-weight: 300;
    }
    .syncDiv p span {
        font-size: 16px;
        font-weight: bold;
        /* color: ${props => props.theme.palette.primary.main}; */
    }
    .syncDiv svg {
        margin-right: 10px;
    }
   
    .formsContainer {
        border: 1px solid ${props => props.theme.palette.border};
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        min-height: 115px;
        position: relative;
    }

  

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 40px;
        grid-column-gap:  10px;
        box-shadow: rgba(99, 99, 99, 0.05) 0px 1px 5px 0px;
    }

    .synced {
        display: none;
    }
    .formsContainer h2 {
        font-size: 12px;
        letter-spacing: 0.2px;
  
    }

    .formsContainer span.input {
        font-size: 13px;
        align-items: center;
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        padding-left: 20px;
        border-radius: 5px;
        color: grey;
    }
   

    .sync-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: ${props => props.theme.palette.primary.main};
        border-radius: 5px;
        border: none;
        outline: none;
        width: auto;
        color: white;
        padding: 10px 2px;

        
    }
    .sync-button svg {
        color: white;
        font-size: 20px;
    }
    .item-primary-key {
        margin-bottom: 10px;
        span {
            font-size: 11px;
          
        }
        span:nth-child(2) {
            font-weight: 600;
            margin-left: 5px;
        }
    }

    .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

    }
`


const StyledInput = styled(Input)`
    margin-bottom: 0px;
`

export default Sync