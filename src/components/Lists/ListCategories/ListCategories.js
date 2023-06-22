
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ListContainer, ExpandableItems, NestedListA } from '@/componentsStyles/list/listStyles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ActiveTag from '@/components/ActiveTag';

import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router'
import ListHeader from '../components';
const CategoriesList = () => {

    const [data, setData] = useState([])
    const router = useRouter();

    const [selectedItem, setSelectedItem] = useState(null)


    useEffect(() => {
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiCategories', { action: 'findAll' })
            setData(res.data.result)
        }
        handleFetch()
    }, [])



    return (
        <AdminLayout>
            <div className="header">
                <h2 className="boxHeader">Κατηγoρίες 2</h2>
            </div>
            <div>
                {!selectedItem ? (
                    <AllData data={data} setSelectedItem={setSelectedItem} />
                ) : (
                    <div onClick={() => { setSelectedItem(null) }}>
                        <SigleItem item={selectedItem} />
                    </div>
                )}

            </div>

        </AdminLayout>

    );
}

const AllData = ({ data, setSelectedItem }) => {
    
    const [showNested, setShowNested] = useState(false);
    return (
        <div>
            {data.map((item, index) => {
                return (
                    <div key={item}>
                        <ListContainer onClick={() => setSelectedItem(item)} >
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
                            {/* {expand.includes(index) ? (
                                <ExpandableItems>
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
                                
                                    <div className="list-bottom-actions-div">
                                        <NavigateBtn text={'Groups'} url={'/dashboard/product/categories-groups'} />
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
                            ) : null} */}
                        </ ListContainer >
                    </div>
                )
            })}
        </div>
    )
}


const SigleItem = ({ item }) => {
    return (
        <div>
            <ListHeader
                item={item}
          
            />
        </div>
    )
}





export default CategoriesList;
