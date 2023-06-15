import React, { useEffect, useState, useCallback } from 'react'
import styled from "styled-components";
import axios from "axios";
import { Input } from "@/components/Forms/newInputs/InputClassic";
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SyncIcon from '@mui/icons-material/Sync';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import { Pagination } from '@mui/material';
import usePagination from '@/utils/pagination';
import Button from '@/components/Buttons/Button';
import { MissingItemsContainer } from '@/componentsStyles/grid/gridStyles';

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


    const handleAdd =  async () => {
        let {data} = await axios.post('/api/admin/markes/markes', { action: 'createMany', data: dataUpdate })
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

        < MissingItemsContainer >
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
            <Button onClick={handleAdd} >Προσθήκη</Button>
            <Pagination
                count={totalPages}
                shape="rounded"
                onChange={handlePageChange}
                page={currentPage}
            />

        </ MissingItemsContainer>
    )
}




export default CheckDifferences;