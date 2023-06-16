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
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

const percentage = 90;



const SyncItemsWrapper = () => {
    const { dataNotFoundInAriadne, dataNotFoundInSoftone } = useSelector(state => state.grid);
    return (
        <AdminLayout>
            <SyncItems
                data={dataNotFoundInAriadne}
                displayAttr={[
                    { displayName: 'Softone Όνομα', attr: 'NAME' }
                ]} />

            <SyncItems
                data={dataNotFoundInSoftone}
                displayAttr={[
                    { displayName: 'Softone Όνομα', attr: 'softOne.NAME' }
                ]} />
        </AdminLayout>
    )

}

const SyncItems = ({ data, displayAttr }) => {
    const dispatch = useDispatch();
    const [dataUpdate, setDataUpdate] = useState([]);
    const [expand, setExpand] = useState(false);
    const { currentPage, totalPages, paginatedData, handlePageChange, } = usePagination(data, 10);


    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState([{}]);

    const handleAdd = async () => {
        let { data } = await axios.post('/api/admin/markes/markes', { action: 'createMany', data: dataUpdate })
        if (data.success) {

        }
    }

    const handleItemClick = (index, item) => {
        console.log(item)
        if (selected.includes(item.MTRMARK)) {
            setDataUpdate(dataUpdate.filter((data) => data !== item));
            setSelected(selected.filter((id) => id !== item.MTRMARK));
        } else {
            setDataUpdate((prevData) => [...prevData, item]);
            setSelected([...selected, item.MTRMARK]);
        }
    };

    const handleSelectSinglePage = () => {
        // setSelectAll(prev => !prev)
        let array = [];
        for (let i = 0; i < paginatedData.length; i++) {
            array.push(paginatedData[i].MTRMARK)
        }

        setDataUpdate([...paginatedData, ...array]);
        setSelected([...selected, ...array]);
    }

    const clearAllSelected = () => {
        setDataUpdate([]);
        setSelected([]);
    }


    useEffect(() => {
        const findExtraSoftone = async () => {
            dispatch(findSoftoneAndSyncTables())
        }
        findExtraSoftone();
    }, [dispatch])

    return (
        <Section>
            <Box p={'0'}>
                <TopDiv  >
                    <div className="header">
                        <h2>Μάρκες Softone:</h2>
                        <p className="intro" >Εγγραφές που υπάρχουν στο Softone και λείπουν από το Ariadne</p>
                    </div>
                    <div className="prog-div" >
                        <CircularProg color={'#ff9000'} value={66} />
                    </div>
                    
                </TopDiv >
                <div className='expand' onClick={() => setExpand(prev => !prev)}>
                        {!expand ? < IoIosArrowDown/> : <IoIosArrowUp />}
                </div>
                {expand ? (
                    <MainDiv>

                    <button onClick={handleSelectSinglePage}>Επιλογή Σελίδας {currentPage}</button>
                    <button onClick={clearAllSelected}>Επίλεξε όλα τα <span>{data.length}</span> προϊόντα</button>
                    <button onClick={clearAllSelected}>clear all</button>
                    <div>

                    </div>
                    {paginatedData.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="formsContainer"
                                onClick={() => handleItemClick(index, item)}>
                                <div className="info-div">
                                    {displayAttr.map((single, index) => {
                                        const attrKeys = single.attr.split('.');
                                        let attributeValue = item;
                                        // Traverse the nested attributes
                                        for (const key of attrKeys) {
                                            attributeValue = attributeValue[key];
                                            if (!attributeValue) break;
                                        }

                                        return (
                                            <div key={index}>
                                                <span>{single.displayName}:</span>
                                                <p>{attributeValue}</p>
                                            </div>
                                        );
                                    })}

                                </div>

                                {/* <button onClick={handleAdd}>Add</button> */}
                                <div className="check-div">
                                    {selected.includes(item.MTRMARK) ? <CheckIcon /> : null}
                                    {/* {selectAll ? <CheckIcon /> : null} */}
                                </div>
                            </div>
                        )
                    })}
                    <Button onClick={handleAdd} >Προσθήκη</Button>
                    <Pagination
                        count={totalPages}
                        shape="rounded"
                        onChange={handlePageChange}
                        page={currentPage}
                    />
                </MainDiv>
                ) : (
                    null
                )}
                

            </Box>

        </Section>

    )
}



export default SyncItemsWrapper;