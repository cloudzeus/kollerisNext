
import React from 'react';
import { IndexWrapper } from '@/componentsStyles/grid/gridStyles';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ListContainer, ExpandableItems, NestedListA } from '@/componentsStyles/list/listStyles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Input } from '@/components/Forms/newInputs/InputClassic';
import { useForm } from "react-hook-form";
import ActiveTag from '@/components/ActiveTag';



const CategoriesTreeGrid = () => {

    const [data, setData] = useState([])

    const [expand, setExpand] = useState([])
    const [showNested, setShowNested] = useState(false);

    useEffect(() => {
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiCategories', { action: 'findAll' })
            setData(res.data.result)
        }
        handleFetch()
    }, [])

    const handleExpand = (index) => {
        if (expand.includes(index)) {
            setExpand([])
            return;
        }
        setExpand([index])
        setShowNested(false)
    }

    const handleShowNested = () => {
        setShowNested(prev => !prev)
    }


    return (
        <div p="0px" >
            <div className="header">
                <h2 className="boxHeader">Κατηγoρίες</h2>
            </div>
            <div>
                {data.map((item, index) => {
                    return (
                        <div key={item}>
                            <ListContainer>
                                <div className='list-header-div' onClick={() => handleExpand(index)} >
                                    <div className="list-header-div-left">
                                        <div >
                                            <span>Ονομα:</span>
                                            <span>{item.categoryName}</span>
                                        </div>
                                        <div>
                                        <ActiveTag isActive={true} />
                                        </div>
                                    </div>
                                    <div className="list-header-div-rigth">
                                          {!expand.includes(index) ? <KeyboardArrowDownIcon /> : < KeyboardArrowUpIcon />} 
                                    </div>
                                </div>
                                {expand.includes(index) ? (
                                    <ExpandableItems>
                                        {!showNested ? (
                                            <div >
                                                <Input
                                                    label="Όνομα"
                                                    name="softOne.NAME"
                                                    type="text"
                                                    value={item.categoryName}
                                                    disabled={true}
                                                    required={true}
                                                />
                                                <Input
                                                    label="Softone Όνομα"
                                                    name="softOne.NAME"
                                                    type="text"
                                                    value={item.categoryName}
                                                    disabled={true}
                                                    required={true}
                                                />
                                            </div>
                                        ) : null}
                                        {/* INNER MAP */}
                                        <button onClick={handleShowNested}>
                                            <KeyboardArrowDownIcon />
                                            Group
                                        </button>

                                    </ExpandableItems>
                                ) : null}

                            </ ListContainer >
                            {showNested ? <NestedList groups={item.groups} /> : null}
                        </div>
                    )
                })}
            </div>

        </div>
    );
}




const NestedList = ({ groups }) => {
    const [subexpand, setSubexpand] = useState([])
    const [showSubNested, setShowSubNested] = useState(false);
    const handleSubExpand = (index) => {
        if (subexpand.includes(index)) {
            setSubexpand([])
            return;
        }
        setSubexpand([index])
    }
    return (
       <>
            {groups.map((group, indexGroup) => {
                return (
                    <div key={indexGroup}>
                         <NestedListA  >
                    <div className="inner-items">
                        <div className='inner-items-header' onClick={() => handleSubExpand(indexGroup)}>
                            <div >
                                <span>Ονομα Group:</span>
                                <span>{group.groupName}</span>
                            </div>
                            {subexpand.includes(indexGroup) ? <KeyboardArrowDownIcon /> : < KeyboardArrowUpIcon />}
                        </div>
                        {subexpand.includes(indexGroup) ? (
                            <div className='inner-items-expand'>
                                <Input
                                    label="Όνομα"
                                    name="softOne.NAME"
                                    type="text"
                                    value={group.groupName}
                                    disabled={true}
                                    required={true}
                                />
                                <div className="inner-items-btn-container">
                                    <button onClick={() => handleSubExpand(indexGroup)}>
                                        < EditIcon />
                                    </button>
                                    <button>
                                        < DeleteIcon />
                                    </button>
                                </div>
                                <button onClick={() => setShowSubNested(prev => !prev)} >show subnested</button>
                            </div>
                        ) : null}
                       
                    </div>
                    </NestedListA>
                    </div>
                   
                )
            })}
        
       
       </>
    )
}





export default CategoriesTreeGrid;
