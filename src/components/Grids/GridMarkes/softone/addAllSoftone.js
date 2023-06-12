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
import CheckIcon from '@mui/icons-material/Check';
import { Pagination } from '@mui/material';
import usePagination from '@/utils/pagination';

const CheckDifferences = () => {
    const dispatch = useDispatch();
    const { notFoundData } = useSelector(state => state.grid);
    const [dataUpdate, setDataUpdate] = useState([]);
    const { currentPage, totalPages, paginatedData, handlePageChange, } = usePagination(notFoundData, 10);
    console.log('data update')
    console.log(dataUpdate)


    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState([{}]);
    console.log(selected)
    const handleAdd = () => {

    }
    const handleItemClick = (index, item) => {
        console.log(item)
        if (selected.includes(index)) {
            setDataUpdate(dataUpdate.filter((id) => id !== item));
            setSelected(selected.filter((id) => id !== index));
        } else {
            setDataUpdate((prevData) => [...prevData, item]);
            setSelected([...selected, index]);
        }
    };


    return (

        <Container >
            <button onClick={() => setSelectAll(prev => !prev)}>select all</button>
            <p>Εγγραφές που υπάρχουν στο Softone και λείπουν από το Ariadne</p>
            {paginatedData.map((item, index) => (
                <div
                    key={index}
                    className="formsContainer"
                    onClick={() => handleItemClick(index, item)}>
                    <div className="info-div">
                        <span>MTRMARK:</span>
                        <p>{item.MTRMARK}</p>
                        <span>ΟΝΟΜΑ:</span>
                        <p>{item.NAME}</p>
                    </div>

                    {/* <button onClick={handleAdd}>Add</button> */}
                    <div className="check-div">
                        {selected.includes(index) && <CheckIcon />}
                        {selectAll && <CheckIcon />}
                    </div>
                </div>
            ))}

            <Pagination
                count={totalPages}
                shape="rounded"
                onChange={handlePageChange}
                page={currentPage}
            />

        </Container>
    )
}



const Container = styled.div`
    .info-div {
        display: flex;
        align-items: center;
        justify-content: center;
        & p {
            font-weight: 600;
            margin-right: 10px;
        }
        & * {
            margin-right: 2px;
        }
    }

    .check-div {
        padding: 5px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${props => props.theme.palette.border};
        & svg {
            font-size: 18px;
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }
    .formsContainer {
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 10px;
        position: relative;
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
    }

    .formsContainer:hover {
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
    }

  

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 50px;
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
        /* background-color:#e4ac1b; */
        border-radius: 5px;
        border: none;
        outline: none;
        width: auto;
        color: white;
        padding: 10px 2px;
        margin-left: 10px;
        
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




export default CheckDifferences;