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
// import { findSoftoneAndSyncTables, calculatePercentage } from '@/features/compareDatabases/compareDatabasesSlice';
import { Section, Box, TopDiv, MainDiv, BottomDiv } from '@/componentsStyles/syncProducts/syncProductsStyle';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Component } from '@syncfusion/ej2/base';
import { findSoftoneAndSyncTables } from '@/features/syncProduct/markesNotFoundAriadne';
import { calculateCompletionAriadne, notFoundSoftoneApi } from '@/features/syncProduct/markesNotFoundSoftone';
import { calculateCompletionSoftone, notFoundAriadneApi } from '@/features/syncProduct/markesNotFoundAriadne';
import { toast } from 'react-toastify';



const SyncItemsWrapper = () => {
    const { dataNotFoundInAriadne, softoneCompletionPercentage } = useSelector((store) => store.notFoundAriadne)
    const { dataNotFoundInSoftone, ariadneCompletionPercentage } = useSelector((store) => store.notFoundSoftone)

    return (
        <AdminLayout>
            <SyncItems
                data={dataNotFoundInAriadne}
                percentage={softoneCompletionPercentage}
                apiCall={notFoundAriadneApi}
                addToDatabaseURL= '/api/admin/markes/markes'
                calculatePercentage={calculateCompletionSoftone}
                subtitle="Εγγραφές που υπάρχουν στο Softone και λείπουν από το Ariadne"
                displayAttr={[
                    { displayName: 'Softone Όνομα', attr: 'NAME' }
                ]} />

            {/* <SyncItems
                data={dataNotFoundInSoftone}
                percentage={ariadneCompletionPercentage}
                apiCall={notFoundSoftoneApi}
                calculatePercentage={calculateCompletionAriadne}
                subtitle="Εγγραφές που υπάρχουν στο Ariadne και λείπουν από το Softone"
                displayAttr={[
                    { displayName: 'Softone Όνομα', attr: 'NAME' }
                ]} /> */}
        </AdminLayout>
    )

}

const SyncItems = ({ data, displayAttr, subtitle, percentage, component, apiCall, calculatePercentage, addToDatabaseURL }) => {
    console.log(percentage)
    const dispatch = useDispatch();
    const [dataUpdate, setDataUpdate] = useState([]);
    const [expand, setExpand] = useState(false);
    const [hide, setHide] = useState([])
    const { currentPage, totalPages, paginatedData, handlePageChange } = usePagination(data, 10);
    
    const [selected, setSelected] = useState([]);
    
    const handleAdd = async () => {
        dispatch(calculatePercentage({ dataToUpdateLength: dataUpdate.length, dataLength: data.length}))
        let res = await axios.post(addToDatabaseURL, { action: 'createMany', data: dataUpdate })
        if(res) {
            setHide([...selected])
            toast.success('Προστέθηκαν επιτυχώς')
        } else {
            toast.error('Πρόβλημα κατά την προσθήκη')
        }
    }

    const handleItemClick = (index, item) => {
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
            dispatch(apiCall())
        }
        findExtraSoftone();
    }, [dispatch, apiCall])

    
    return (
        <Section>
            <Box p={'0'}>
                <TopDiv  >
                    <div className="header">
                        <h2>Μάρκες Softone:</h2>
                        <p className="intro" >{subtitle}</p>
                    </div>
                    <div className="prog-div" >
                        <CircularProg color={'orange'} value={percentage} />
                    </div>

                </TopDiv >
                <div className='expand' onClick={() => setExpand(prev => !prev)}>
                    {!expand ? < IoIosArrowDown /> : <IoIosArrowUp />}
                </div>
                {expand ? (
                    <MainDiv>
                        <div className="button-action-div">
                            <button onClick={handleSelectSinglePage}>Επιλογή Σελίδας {currentPage}</button>
                            <button onClick={clearAllSelected}>Επίλεξε όλα τα <span>{data.length}</span> προϊόντα</button>
                            <button onClick={clearAllSelected}>clear all</button>
                        </div>

                        <div>
                        </div>
                        {paginatedData.map((item, index) => {
                            return (
                               <>
                                {hide.includes(item.MTRMARK) ? null : (
                                     <div
                                     key={index}
                                     className="formsContainer"
                                     onClick={() => handleItemClick(index, item)}>
                                     <div className="info-div">
                                         {displayAttr.map((single, index) => {
                                             const key = single.attr;
                                             console.log(key)
                                             return (
                                                 <div key={index} >
                                                     <span>{single.displayName}:</span>
                                                     <p>{item[key]}</p>
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
                                )}
                               </>
                            )
                        })}
                        <BottomDiv>
                            <Button onClick={handleAdd} >Προσθήκη</Button>
                            <Pagination
                                count={totalPages}
                                shape="rounded"
                                onChange={handlePageChange}
                                page={currentPage}
                            />
                        </BottomDiv>

                    </MainDiv>
                ) : (
                    null
                )}


            </Box>

        </Section>

    )
}



export default SyncItemsWrapper;