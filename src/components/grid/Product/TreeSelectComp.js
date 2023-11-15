import React, { useState, useEffect, useRef, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProductQuantityContext } from '@/_context/ProductGridContext';
import { setSubmitted } from '@/features/productsSlice';
const TreeSelectComp = () => {

    // const {selectedProducts, setSubmitted} = useContext(ProductQuantityContext)

    const [categories, setCategories] = useState(null);
    const [category, setCategory] = useState(null);

    const [groups, setGroups] = useState(null);
    const [group, setGroup] = useState(null);

    const [subgroups, setSubgroups] = useState(null);
    const [subgroup, setSubgroup] = useState(null);

    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)


    return (
        <div>
             <Toast ref={toast} />
            <TreeSelectDropDown
                gridRowData={gridRowData}
                categories={categories}
                setCategories={setCategories}
                category={category}
                setCategory={setCategory}
                groups={groups}
                setGroups={setGroups}
                group={group}
                setGroup={setGroup}
                setSubgroups={setSubgroups}
                subgroups={subgroups}
                subgroup={subgroup}
                setSubgroup={setSubgroup}
            />
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
        setSubmitted(false)
        let res = await axios.post('/api/product/apiProduct', { 
            action: 'updateClass', 
            gridData: selectedProducts, 
            categoryid: category?.categoryId, 
            categoryName: category?.name,
            groupid: group?.groupId, 
            groupName: group?.name,
            subgroupid:subgroup?.subgroupId,
            subGroupName: subgroup?.name
        })
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
              
                dispatch(setSubmitted())

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
                    {category ? (
                        <div className="card flex justify-content-center  mb-3">
                            <Dropdown value={group} onChange={chooseGroup} options={groups} optionLabel="name"
                                placeholder="Επιλογή Ομάδας" className="w-full" />

                        </div>
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

export default TreeSelectComp