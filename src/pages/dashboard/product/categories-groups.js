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
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { IconButton } from '@/componentsStyles/buttons/buttonStyles';
import { useRouter } from 'next/router'
import NavigateBtn from '@/components/Buttons/NavigateBtn';
import { NavigateArrowButton } from '@/componentsStyles/buttons/buttonStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useDispatch } from 'react-redux';
import { setChildListData } from '@/features/List/listSlice';
import { useSelector } from 'react-redux';


const CategoriesGroups = () => {
    const {childListData, parentCategory} = useSelector(state => state.list)
    const router = useRouter();
    const [expand, setExpand] = useState([])
    const handleExpand = (index) => {
        if (expand.includes(index)) {
            setExpand([])
            return;
        }
        setExpand([index])
    }

    return (
        <AdminLayout>
        <div className="header">
            <h2 className="boxHeader">Groups</h2>
        </div>
        <div>
            <span>Κατηγορία:</span>
            <span>{parentCategory}</span>
        </div>
       
            {childListData.map((item, index) => {
                return (
                    <div key={index}>
                       
                        <ListContainer>
                            <div className='list-header-div' onClick={() => handleExpand(index)} >
                                <div className="list-header-div-left">
                                    <div >
                                        <span>Ονομα:</span>
                                        <span>{item.softOne.subGroupName}</span>
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
                                 
                                        <div >
                                            <Input
                                                label="Όνομα"
                                                name="softOne.NAME"
                                                type="text"
                                                value={item.softOne.subGroupName}
                                                disabled={true}
                                                required={true}
                                            />
                                           
                                        </div>
                                    <div className="list-bottom-actions-div">
                                    <button onClick={() => handleNavigation(item)}>
                                        Groups
                                        <NavigateNextIcon />
                                    </button>
                                    <div className="list-bottom-actions-div_actions">
                                        <button>
                                            <EditIcon />
                                        </button>
                                        <button>
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                    </div>
                                    

                                </ExpandableItems>
                            ) : null}
                        </ ListContainer >
                    </div>
                )
            })}
  </AdminLayout>
    )
}

export default CategoriesGroups;