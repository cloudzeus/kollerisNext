
import React from 'react';
import { IndexWrapper } from '@/componentsStyles/grid/gridStyles';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ListContainer, ExpandableItems, NestedListA} from '@/componentsStyles/list/listStyles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Input } from '@/components/Forms/newInputs/InputClassic';
import { useForm } from "react-hook-form";


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
        <IndexWrapper p="0px" className="box">
            <div className="header">
                <h2 className="boxHeader">Κατηγoρίες</h2>
            </div>
            <div className="innerContainer" >
                <>
                    {data.map((item, index) => {
                        console.log('CATEGORIES ITEM  ' + JSON.stringify(item.groups))
                        let condition = expand.includes(index)
                        return (
                            <>
                                 <ListContainer>
                                 <div className='list-header-div' onClick={() => handleExpand(index)} >
                                     <div >
                                         <span>Ονομα:</span>
                                         <span>{item.categoryName}</span>
                                     </div>
                                     {expand ? <KeyboardArrowDownIcon /> : < KeyboardArrowUpIcon />}
                                 </div>
                                 {expand.includes(index) ? (
                                     <ExpandableItems>
                                         <div className='divider'></div>
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
                                        ): null}
                                         {/* INNER MAP */}
                                         <button onClick={handleShowNested}>
                                         <KeyboardArrowDownIcon />
                                             Group
                                         </button>
                                         {showNested ? <NestedList groups={item.groups} /> : null}
                                            

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

const NestedList = ({ groups }) => {
    const [subexpand, setSubexpand] = useState([])
    const handleSubExpand = (index) => {
        if (subexpand.includes(index)) {
            setSubexpand([])
            return;
        }
        setSubexpand([index])
    }
    return (
        <NestedListA>
            {groups.map((group, indexGroup) => {
                console.log(indexGroup)
                return (
                    <div className="inner-items" key={indexGroup}>
                        <div className='list-header-div inner-items-header' onClick={() => handleSubExpand(indexGroup)}>
                            <div >
                                <span>Ονομα Group:</span>
                                <span>{group.groupName}</span>
                            </div>
                               

                            {subexpand.includes(indexGroup)? <KeyboardArrowDownIcon /> : < KeyboardArrowUpIcon />}
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
                                        < DeleteIcon/>
                                    </button>
                                </div>
                           </div>
                        ) : null}

                    </div>
                )
            })}
        </NestedListA>
    )
}


export default CategoriesTreeGrid;
