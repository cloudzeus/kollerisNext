'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import GallerySmall from '@/components/GalleryListSmall';
import { AddMoreInput } from '@/components/Forms/PrimeAddMultiple';
import axios from 'axios';
import styled from 'styled-components';
import PrimeUploads from '@/components/Forms/PrimeImagesUpload';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Divider, Container } from '@/componentsStyles/dialogforms';

import { TextAreaInput } from '@/components/Forms/PrimeInput';
import { useSession } from "next-auth/react"
import PrimeSelect from '@/components/Forms/PrimeSelect';
import AddDeleteImages from '@/components/GalleryListSmall';
import { original } from '@reduxjs/toolkit';



const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
 
    //This component has one Image only:
    const [image, setImage] = useState([gridRowData?.subGroupImage])
    const [logo, setLogo] = useState([gridRowData?.subGroupIcon])
    const [parent, setParent] = useState([])
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });



    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);
    
    useEffect(() => {
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiSubGroup', { action: 'findGroupNames' })
            setParent(res.data.result)

        }
        handleFetch()

        //In the database empty logo is saved as an empty string, so we need to convert it to an empty array
        setLogo(gridRowData?.subGroupIcon ? [gridRowData?.subGroupIcon] : [])
        setImage(gridRowData?.subGroupImage ? [gridRowData?.subGroupImage] : [])
    }, [gridRowData])


    useEffect(() => {
       
    }, [])


   
    const handleEdit = async (data) => {
        console.log(gridRowData )
        let user = session.user.user.lastName
        let originalGroup = gridRowData?.group
   
        //User hasn't selected a new group, so we keep the original one
        // if(typeof data.categoryid === 'undefined') {
        //     data.groupid = gridRowData?.group
        // } 
        console.log('originalGroup: ' + JSON.stringify(originalGroup))
      
        let cccSubgroup2 = gridRowData?.softOne?.cccSubgroup2
        let newLogo = logo[0]
        if(logo.length === 0) {
            newLogo = ''

        }
        let newImage = image[0]
        if(image.length === 0) {
            newImage = ''

        }
        const object = {
            ...data,
            groupIcon: newLogo,
            groupImage: newImage,
           
        }
 

        try {
           
            let resp = await axios.post('/api/product/apiSubGroup', 
            {
                action: "update", 
                data: {...object, updatedFrom: user, }, 
                id: gridRowData._id, 
                cccSubgroup2: cccSubgroup2 ,
                originalGroup: originalGroup,
                originalSubGroupName: gridRowData?.subGroupName
            })
            if(!resp.data.success) {
                return showError()
            }
            setSubmitted(true)
            hideDialog()
            showSuccess('Η εγγραφή ενημερώθηκε')
            showSuccess(resp.data?.message)
            
               
        } catch (e) {
            console.log(e)
        }
       
    }

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 5000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }


    const handleClose = () => {
        hideDialog()
    }

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Ακύρωση" icon="pi pi-times" severity="info" outlined onClick={handleClose} />
            <Button label="Αποθήκευση" icon="pi pi-check" severity="info" onClick={handleSubmit(handleEdit)} />
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
                    header= "Διόρθωση Group"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                   <FormTitle>Λεπτομέριες</FormTitle>
                <PrimeSelect
                    control={control}
                    name="groupid"
                    required
                    label={'Yποκατηγορία'}
                    options={parent}
                    optionLabel={'label'}
                    optionValue={'value._id'}
                    placeholder={gridRowData?.group?.groupName}
                    // error={errors.categoryName}
                    />
                <Input
                    label={'Όνομα Sub Group'}
                    name={'subGroupName'}
                    control={control}
                    required
                    // error={errors.groupName}
                />
              
                <FormTitle>Λογότυπο</FormTitle>
                    <AddDeleteImages 
                        state={logo}
                        setState={setLogo}
                        multiple={false}
                        singleUpload={false}
                       
                    />

                <FormTitle>Φωτογραφίες</FormTitle>
                <AddDeleteImages 
                        state={image}
                        setState={setImage}
                        multiple={false}
                        singleUpload={false}
                       
                    />
                </Dialog>
            </form>
        </Container>

    )
}



const addSchema = yup.object().shape({
    // subGroupName: yup.string().required('Συμπληρώστε το όνομα'),
    groupid: yup.string().required('Η Κατηγορία είναι υποχρεωτική'),
});


const AddDialog = ({
    dialog,
    hideDialog,
    setSubmitted
}) => {


    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(addSchema),
        defaultValues: {
            subGroupName: '',
            groupid: '',
        }
    });
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
    const [logo, setLogo] = useState('')
    const [image, setImage] = useState([])
    const [parent, setParent] = useState([])
    const cancel = () => {
        hideDialog()
        reset()
    }

   
    useEffect(() => {
        setDisabled(false)
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiSubGroup', { action: 'findGroupNames' })
          
            setParent(res.data.result)

        }
        handleFetch()
    }, [])



    const handleAdd = async (data) => {
     
        let user = session.user.user.lastName
        const body ={
            ...data,
            subGroupIcon: logo[0],
            subGroupImage: image[0],
            createdFrom: user
        }
        console.log('body: ' + JSON.stringify(body))

        let res = await axios.post('/api/product/apiSubGroup', { action: 'create', data: body })
        console.log(res.data)
        if(!res.data.success) return showError(res.data.softoneError)
        // let parent = res.data.parent
        setDisabled(true)
        setSubmitted(true)
        showSuccess('Επιτυχής εισαγωγή στην βάση')
        // showSuccess('Eπιτυχής Update στην Κατηγορία: ' + parent)
        hideDialog()
        reset();
    }



    const productDialogFooter = (
        <>
            <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={cancel} />
            <Button label="Αποθήκευση" icon="pi pi-check" type="submit" onClick={handleSubmit(handleAdd)} disabled={disabled} />
        </>
    );

    const showSuccess = (detail) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: detail, life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης : ' + message, life: 5000 });
    }

    return (
        <form noValidate onSubmit={handleSubmit(handleAdd)}>
            <Toast ref={toast} />
            <Dialog
                visible={dialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Προσθήκη ΜTRGroup"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}>
                <FormTitle>Λεπτομέριες</FormTitle>
                <PrimeSelect
                    control={control}
                    name="groupid"
                    required
                    label={'Eπιλέξτε Group'}
                    options={parent}
                    optionLabel={'label'}
                    optionValue={'value._id'}
                    error={errors.groupid}
                    />
                <Input
              
                    label={'Όνομα subgroup'}
                    name={'subGroupName'}
                    control={control}
                    required
                    // error={errors.subGroupName}
                />
              
                <FormTitle>Λογότυπο</FormTitle>
                <PrimeUploads
                    setState={setLogo}
                    multiple={false}
                    singleUpload={true}
                    mb={'20px'} />


                <FormTitle>Φωτογραφίες</FormTitle>
                <PrimeUploads
                    setState={setImage}
                    multiple={false}
                    mb={'30px'}
                    singleUpload={true}
                    />
               

            </Dialog>
        </form>
    )

}





export { EditDialog, AddDialog }
