
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import axios from 'axios';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Divider, Container } from '@/componentsStyles/dialogforms';
import { TreeSelect } from 'primereact/treeselect';
import { set } from 'mongoose';
import { Dropdown } from 'primereact/dropdown';





const ClassificationDialog = ({ dialog, hideDialog, onEditClass }) => {
    const [categories, setCategories] = useState(null);
    const [category, setCategory] = useState(null);

    const [groups, setGroups] = useState(null);
    const [group, setGroup] = useState(null);

    const [subgroups, setSubgroups] = useState(null);
    const [subgroup, setSubgroup] = useState(null);

    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });



    useEffect(() => {
        setCategories(null)
        setGroups(null)
        setSubgroups(null)
        reset({ ...gridRowData });
    }, [gridRowData, reset]);


    // console.log('gridRowData')
    // console.log(gridRowData)


    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }


    const handleClose = () => {
        console.log('handleClose')
        hideDialog()
    }

    const onSubmit = async (data) => {
       
        if(category === null || group === null || subgroup === null ) return;
            let object = {
                MTRL: gridRowData.MTRL[0],
                MTRCATEGORY: category.softoneid,
                MTRGROUP: group.groupId,
                CCCSUBGROUP2: subgroup.subgroupId

            }
        let response = axios.post('/api/product/apiProduct', { action: 'updateClass', id: gridRowData._id, data: object })
        if(!response.success) return showError()
        setSubmitted(true)
        hideDialog()
        showSuccess('Επιτυχής Ενημέρωση')
       
    }


    const productDialogFooter = (
        <React.Fragment>
            <Button label="Ακύρωση" icon="pi pi-times" severity="info" outlined onClick={handleClose} />
            <Button label="Αποθήκευση" icon="pi pi-check" severity="info" onClick={handleSubmit(onSubmit)} />
        </React.Fragment>
    );

    return (
        < Container>
            <form >
                <Toast ref={toast} />
                <Dialog
                    visible={dialog}
                    style={{ width: '32rem', maxWidth: '80rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Αλλαγή Κατηγοριοποίησης"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >   
                    
                    <p className='text-md  mt-2 font-bold'>Κατηγορία:</p>
                    <p>{gridRowData.categoryName}</p>
                    <p className='text-md  mt-2 font-bold'>Ομάδα:</p>
                    <p>{gridRowData.mtrgroups ? gridRowData.mtrgroups : '-----------' }</p>
                    <p className='text-md  mt-2 font-bold'>Υποομάδα</p>
                    <p>{gridRowData.mtrsubgroup ? gridRowData.mtrsubgroup : '-----------'}</p>
                    <TreeSelectComp  
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
                </Dialog>
            </form>
        </Container>

    )
}






const TreeSelectComp = ({
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
        subgroup}) => {

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
        
                  if(category?.code === item._id && group?.code === groupitem._id){
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


    const handleSubmit = () => {
   
    }



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









export default ClassificationDialog