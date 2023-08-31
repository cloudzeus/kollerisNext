import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Button } from 'primereact/button';

const TreeSelectComp = () => {
    const [show, setShow]   = useState(false)
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
            <Button label="Αλλαγή Κατηγοριοποίησης" icon="pi pi-arrow-down-right" className="surface-ground text-primary w-full p-mr-2 mt-3" onClick={() => setShow(prev => !prev)} />
            {show ? (
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
            ) : null}
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
    subgroup }) => {

    const [data, setData] = useState(null);


    const handleFetch = async () => {
        let res = await axios.post('/api/product/apiCategories', { action: 'findAll' })
        console.log(res.data.result)
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
                softoneid: item.softOne.MTRCATEGORY,
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
        console.log(e)
        setCategory(e.value)
    }
    const chooseGroup = (e) => {
        console.log(e)
        setGroup(e.value)
    }
    const chooseSub = (e) => {
        console.log(e)
        setSubgroup(e.value)
    }


    return (
        <div className="mt-4 mb-4">


            <h2 className='text-sm mb-2 text-700'>Eπιλογή Νέου:</h2>

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

        </div>
    );
}

export default TreeSelectComp