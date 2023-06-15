import AdminLayout from '@/layouts/Admin/AdminLayout'
import CircularProg from '@/components/CircularProgress';
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import { Pagination } from '@mui/material';
import usePagination from '@/utils/pagination';
import Button from '@/components/Buttons/Button';
import { findSoftoneAndSyncTables } from '@/features/grid/gridSlice';
import styled from 'styled-components';
import { Section, Box, TopDiv, MainDiv } from '@/componentsStyles/syncProducts/syncProductsStyle';

const percentage = 90;

const SyncItems = () => {
    const dispatch = useDispatch();
    const { notFoundData } = useSelector(state => state.grid);
    console.log('notfounddata')
    console.log(notFoundData)
    const [dataUpdate, setDataUpdate] = useState([]);
    const { currentPage, totalPages, paginatedData, handlePageChange, } = usePagination(notFoundData, 10);



    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState([{}]);
    console.log(selected)


    const handleAdd = async () => {
        let { data } = await axios.post('/api/admin/markes/markes', { action: 'createMany', data: dataUpdate })
        if(data.success) {
            
        }
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



    useEffect(() => {
        const findExtraSoftone = async () => {
            dispatch(findSoftoneAndSyncTables())
        }
        findExtraSoftone();
    }, [dispatch])

    return (
        <AdminLayout>
            <Section>
                <Box p={'0'}>
                    <TopDiv  >
                        <div className="header">
                            <h2 className="boxHeader">Μάρκες</h2>
                        </div>
                        <div className="prog-div" >
                            <CircularProg color={'#ff9000'} value={66} />
                        </div>
                    </TopDiv >
                    <MainDiv>
                        <p className="intro" >Εγγραφές που υπάρχουν στο Softone και λείπουν από το Ariadne</p>
                        <button onClick={() => setSelectAll(prev => !prev)}>select all</button>
                        <div>

                        </div>
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
                                    {selected.includes(index) ? <CheckIcon /> : null}
                                    {selectAll ? <CheckIcon /> : null}
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
                    </MainDiv>

                </Box>

            </Section>
        </AdminLayout>
    )
}



export default SyncItems