import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { setSubmitted } from '@/features/productsSlice';
const TreeSelectComp = () => {
    const dispatch = useDispatch();
    const toast = useRef(null)
    const {selectedProducts} = useSelector(state => state.products)
    const [loading, setLoading] = useState(false)
    const [categoriesOptions, setCategoriesOptions] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [subGroupOptions, setSubGroupOptions] = useState([])
    const [selectState, setSelectState] = useState({
        category: null,
        group: null,
        subgroup: null,
    })

    const showSuccess = (name) => {
        toast.current.show({severity:'success', detail:`Επιτυχής Ενημέρωση MTRL : ${name}`, life: 3000});
    }

    const showError = (name, message) => {
        toast.current.show({severity:'error', detail:`Aποτυχία Ενημέρωσης MTRL : ${name} // ${message}`, life: 3000});
    }

    const handleCategory = (e) => {setSelectState({...selectState, category: e.value})}
    const handleGroup = (e) => {setSelectState({...selectState, group: e.value})}
    const handleSubGroup = (e) => {setSelectState({...selectState, subgroup: e.value})}

    const onCategoryDelete = () => {
        setSelectState({...selectState, category: null, group: null, subgroup: null})
    
    }

    const onGroupDelete = () => {
        setSelectState({...selectState, group: null, subgroup: null})
    
    }
    const onSubGroupDelete = () => {
        setSelectState({...selectState, subgroup: null})
    
    }

  
    const onSubmit = async () => {
    
        setLoading(true)
        let obj = {
            gridData: selectedProducts, 
            categoryid: selectState.category.softOne.MTRCATEGORY, 
            categoryName: selectState.category?.categoryName,
            groupid: selectState.group?.softOne.MTRGROUP, 
            groupName: selectState.group?.groupName,
            subgroupid: selectState.subgroup?.softOne.cccSubgroup2 || 0,
            subGroupName: selectState.subgroup?.subGroupName || ""
        }
       
        // setSubmitted(false)
        let res = await axios.post('/api/product/apiProduct', { 
            action: 'updateClass', 
            ...obj
        })
      
        setLoading(false)
            if(!res.data.success) {
                res.data.result.map((item) => {
                    showError(item?.name)
                })
            }

            res.data.result.map((item) => {
                if(item.mtrl && item.updated) {
                    showSuccess(item?.name)
                } else {
                    showError(item?.name, 'ΤΟ ΠΡΟΪΟΝ ΔΕΝ ΕΧΕΙ MTRL. ΠΡΟΣΘΕΣΤΕ ΤΟ ΣΤΟ SOFTONE')
                }
              
            })
            dispatch(setSubmitted())
         
    }
    return (
        <div>
            <Toast ref={toast} />
               <CategoriesRowFilterTemplate 
                options={categoriesOptions} 
                setOptions={setCategoriesOptions}
                value={selectState.category}
                onChange={handleCategory}
                onDelete={onCategoryDelete}
                />
                <div className='w-full mt-4'>
                    <GroupRowFilterTemplate 
                        options={groupOptions} 
                        setOptions={setGroupOptions}
                        value={selectState.group}
                        onChange={handleGroup}
                        category={selectState.category}
                        onDelete={onGroupDelete}
                    />
                </div>
                <div className='w-full mt-4'>
                    <SubGroupsTemplate
                        options={subGroupOptions} 
                        setOptions={setSubGroupOptions}
                        value={selectState.subgroup}
                        onChange={handleSubGroup}
                        group={selectState.group}
                        onDelete={onSubGroupDelete}
                    />
                </div>
                <Button loading={loading} disabled={!selectState.category} size="small"  label="Αποστολή" icon="pi pi-chevron-right" className="mt-2" onClick={onSubmit} />

        </div>
    )
}

const TreeSelectDropDown = ({
    categories,
    groups,
    subgroups,
    setCategories,
    setSubgroups,
    setCategory,
    setGroup,
    setGroups,
    setSubgroup,
    category,
    group,
    subgroup,
}) => {
    // const {selectedProducts, setSubmitted} = useContext(ProductQuantityContext)
    const {selectedProducts} = useSelector(state => state.products)
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const toast = useRef(null);
   
    const showSuccess = (name) => {
        toast.current.show({severity:'success', detail:`Επιτυχής Ενημέρωση MTRL : ${name}`, life: 3000});
    }

    const showError = (name, message) => {
        toast.current.show({severity:'error', detail:`Aποτυχία Ενημέρωσης MTRL : ${name} // ${message}`, life: 3000});
    }
    const handleFetch = async () => {
        //FETCH CATEGORIES AND BUILD SUBGROUPS AND MTRGROUPS
        let res = await axios.post('/api/product/apiCategories', { action: 'findAll' })
        setData(res.data.result)

    }

    useEffect(() => {
        handleFetch()
    }, [])


    useEffect(() => {
        if (data === null) return;
        let categories = [];
        data.map((item) => {
            categories.push({
                name: item.categoryName,
                categoryId: item.softOne.MTRCATEGORY,
                code: item._id

            })

        })
        setCategories(categories)

        if (category === null) return;
        data.map((item) => {
            if (category.code === item._id) {
                let groups = [];
                item.groups.map((groupitem) => {
                    groups.push({
                        name: groupitem.groupName,
                        code: groupitem._id,
                        groupId: groupitem.softOne.MTRGROUP
                    })

                    if (category?.code === item._id && group?.code === groupitem._id) {
                        let subgroups = [];
                        groupitem.subGroups.map((subgroupitem) => {
                            subgroups.push({
                                name: subgroupitem.subGroupName,
                                code: subgroupitem._id,
                                subgroupId: subgroupitem.softOne.cccSubgroup2
                            })
                        })
                        setSubgroups(subgroups)
                    }

                })
                setGroups(groups)
            }
        })


    }, [data, category, group, setCategories, setGroups, setSubgroups])





    const chooseCategory = (e) => {
        setCategory(e.value)
    }
    const chooseGroup = (e) => {
        setGroup(e.value)
    }
    const chooseSub = (e) => {
        setSubgroup(e.value)
    }

    const onSubmit = async () => {

        let obj = {
            gridData: selectedProducts, 
            categoryid: category?.categoryId, 
            categoryName: category?.name,
            groupid: group?.groupId, 
            groupName: group?.name,
            subgroupid:subgroup?.subgroupId || 0,
            subGroupName: subgroup?.name || ""
        }
      
        setSubmitted(false)
        let res = await axios.post('/api/product/apiProduct', { 
            action: 'updateClass', 
            ...obj
        })
        dispatch(setSubmitted())
            if(!res.data.success) {
                res.data.result.map((item) => {
                    showError(item?.name)
                })
            }

            res.data.result.map((item) => {
                if(item.mtrl && item.updated) {
                    showSuccess(item?.name)
                } else {
                    showError(item?.name, 'ΤΟ ΠΡΟΪΟΝ ΔΕΝ ΕΧΕΙ MTRL. ΠΡΟΣΘΕΣΤΕ ΤΟ ΣΤΟ SOFTONE')
                }
              
            })
         

          
    }

   
    const disabledCondition = !category && !group

    return (
        <div className="mb-4">
           <Toast ref={toast} />
            <h2 className='text-sm mb-2 text-700'>Αλλαγή Κατηγοριοποίησης:</h2>
          
                <div >
                    <div className="card flex justify-content-center  mb-3">
                        <Dropdown value={category} onChange={chooseCategory} options={categories} optionLabel="name"
                            placeholder="Επιλογή Εμπορικής Κατηγορίας" className="w-full" />

                    </div>
                    <CategoriesRowFilterTemplate />
                    {category ? (
                       
                        <GroupRowFilterTemplate category={category} options={groups} value={group} />
                    ) : null}
                    {group ? (
                        <div className="card flex justify-content-center  mb-3">
                            <Dropdown value={subgroup} onChange={chooseSub} options={subgroups} optionLabel="name"
                                placeholder="Επιλογή Ομάδας" className="w-full" />

                        </div>
                    ) : null}
                    <Button disabled={disabledCondition} label="Αποστολή" icon="pi pi-chevron-right" className="  w-full p-mr-2" onClick={onSubmit} />
                </div>


        </div>
    );
}


const CategoriesRowFilterTemplate = ({ value, options, onChange, setOptions, onDelete }) => {
    useEffect(() => {
        const handleCategories = async () => {
            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'findCategories',
            })
           
            setOptions(data.result)
        }
        handleCategories()
    }, [])

  
    return (
        <div className="flex align-items-center">
            <Dropdown
                emptyMessage="Δεν υπάρχουν κατηγορίες"
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="categoryName"
                placeholder="Φίλτρο Κατηγορίας"
                className="p-column-filter  grid-filter w-full mt-2"
                style={{ minWidth: '14rem', fontSize: '12px' }}

            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
        </div>

    )
};



const GroupRowFilterTemplate = ({ category, options, setOptions, onChange, value, onDelete  }) => {

    
    const dispatch = useDispatch()
    useEffect(() => {
        const handleCategories = async () => {

            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'findGroups',
                categoryID: category?.softOne?.MTRCATEGORY
            })
            setOptions(data.result)
        }
        handleCategories()
    }, [category])


    return (
        <div className='flex align-items-center'>
            <Dropdown
                disabled={!category ? true : false}
                emptyMessage="Δεν υπάρχουν ομάδες"
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="groupName"
                placeholder="Φίλτρο Ομάδας"
                className="p-column-filter  grid-filter w-full"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
        </div>

    )
};

const SubGroupsTemplate = ({ value, options, setOptions, group, onChange, onDelete }) => {
   
    const dispatch = useDispatch()
    useEffect(() => {
        const handleCategories = async () => {
            let { data } = await axios.post('/api/product/apiProductFilters', {
                action: 'findSubGroups',
                groupID: group?.softOne.MTRGROUP
            })
            setOptions(data.result)
        }
        handleCategories()
    }, [group])

    return (
        <div className="flex align-items-center">
            <Dropdown
                emptyMessage="Δεν υπάρχουν υποομάδες"
                size="small"
                disabled={!group ? true : false}
                value={value}
                options={options}
                onChange={onChange}
                optionLabel="subGroupName"
                placeholder="Φίλτρο Υποομάδας"
                className="p-column-filter grid-filter w-full"
                style={{ minWidth: '14rem', fontSize: '12px' }}
            />
            <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete} ></i>
        </div>
    )
};



export default TreeSelectComp