
import React from 'react';
import { IndexWrapper } from '@/componentsStyles/grid/gridStyles';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ListContainer, ExpandableItems, BootstrapInput } from '@/componentsStyles/list/listStyles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image';

import { Input } from '@/components/Forms/newInputs/InputClassic';
import { useForm } from "react-hook-form";


const CategoriesTreeGrid = () => {

    const [data, setData] = useState([])

    const [expand, setExpand] = useState([])
    const [subexpand, setSubexpand] = useState([])
    console.log(subexpand)
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
    }
    const handleSubExpand = (index) => {
        if (subexpand.includes(index)) {
            setSubexpand([])
            return;
        }
        setExpand([index])
    }


    return (
        <IndexWrapper p="0px" className="box">
            <div className="header">
                <h2 className="boxHeader">Κατηγoρίες</h2>
            </div>
            <div className="innerContainer" >
                <>
                    {data.map((item, index) => {
                        console.log('CATEGORIES ITEM  ' + JSON.stringify(item.groups))
                        return (
                            <>
                                <ListContainer  >
                                    <div className='list-header-div' onClick={() => handleExpand(index)}>
                                        <div >
                                            <span>Ονομα:</span>
                                            <span>{item.categoryName}</span>
                                        </div>
                                        {expand ? <KeyboardArrowDownIcon /> : < KeyboardArrowUpIcon />}
                                    </div>
                                    {expand.includes(index) ? (
                                        <ExpandableItems>
                                            <div className='divider'></div>
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
                                            {/* INNER MAP */}
                                            <div className="inner-items-container">
                                                {item.groups.map((group, indexGroup) => {
                                                    console.log(indexGroup)
                                                    let condition = expand.includes(index) && subexpand.includes(indexGroup)
                                                    return (
                                                        <div className="inner-items" key={indexGroup}>
                                                            <div className='list-header-div' onClick={() => handleSubExpand(indexGroup)}>
                                                                <div >
                                                                    <span>Ονομα Group:</span>
                                                                    <span>{group.groupName}</span>
                                                                </div>
                                                                {condition ? <KeyboardArrowDownIcon /> : < KeyboardArrowUpIcon />}
                                                            </div>
                                                            {condition ? (
                                                                <Input
                                                                label="Όνομα"
                                                                name="softOne.NAME"
                                                                type="text"
                                                                value={group.groupName}
                                                                disabled={true}
                                                                required={true}
                                                            />
                                                            ) : null}
                                                            
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                        </ExpandableItems>
                                    ) : null}
                                </ ListContainer >
                            </>
                        )
                    })}
                </>

            </div>

        </IndexWrapper>
    );
}




export default CategoriesTreeGrid;
