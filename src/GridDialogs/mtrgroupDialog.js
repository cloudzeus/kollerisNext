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



const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { data: session, status } = useSession()
    const [parent, setParent] = useState([])
   
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
    console.log(gridRowData)

    //This component has one Image only:
    const [images, setImages] = useState([gridRowData?.groupImage])

    const [logo, setLogo] = useState([gridRowData?.groupIcon])
    
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });


    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);
    
    useEffect(() => {
    
    }, [gridRowData])

    const handleEdit = async (data) => {

        const object = {
            ...data,
        
        }
        console.log('object')
        console.log(object)
        // try {
        //     let user = session.user.user.lastName
        //     let resp = await axios.post('/api/product/apiMarkes', {action: "update", data: {...object, updatedFrom: user}, id: gridRowData._id, mtrmark: gridRowData?.softOne?.MTRMARK})
        //         if(!resp.data.success) {
        //             return showError(resp.data.softoneError)
        //         }
        //         showSuccess()
        //         setSubmitted(true)
        //         hideDialog()
               
        // } catch (e) {
        //     console.log(e)
        // }
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
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
                    name="categoryid"
                    required
                    label={'Κατηγορία'}
                    options={parent}
                    optionLabel={'label'}
                    placeholder='label'
                    optionValue={'value._id'}
                    // error={errors.categoryName}
                    />
                <Input
                    label={'Όνομα Κατηγορίας'}
                    name={'groupName'}
                    control={control}
                    required
                    // error={errors.groupName}
                />
              
                <FormTitle>Λογότυπο</FormTitle>
                <GallerySmall
                        images={[gridRowData?.groupIcon]}
                        updateUrl={'/api/product/apiImages'}
                        id={gridRowData._id}
                    />
                    <AddDeleteImages
                        state={logo}
                        multiple={false}
                        setState={setLogo}
                        updateUrl={'/api/product/apiMarkes'}
                        action="deleteLogo"
                        id={gridRowData._id}
                    />

                <FormTitle>Φωτογραφίες</FormTitle>
               <GallerySmall
                        images={[gridRowData?.groupImage]}
                        updateUrl={'/api/product/apiImages'}
                        id={gridRowData._id}
                    />
                </Dialog>
            </form>
        </Container>

    )
}



const addSchema = yup.object().shape({
    groupName: yup.string().required('Συμπληρώστε το όνομα'),
    categoryid: yup.string().required('Η Κατηγορία είναι υποχρεωτική'),
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
            groupName: '',
            categoryid: '',
        }
    });
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
    const [logo, setLogo] = useState('')
    const [images, setImages] = useState([])
    const [parent, setParent] = useState([])
    const cancel = () => {
        hideDialog()
        reset()
    }

   
    useEffect(() => {
        setDisabled(false)
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiGroup', { action: 'findCategoriesNames' })
            setParent(res.data.result)

        }
        handleFetch()
    }, [])



    const handleAdd = async (data) => {
     
        let user = session.user.user.lastName
        const body ={
            ...data,
            groupIcon: logo[0],
            groupImage: images[0],
            createdFrom: user
        }


        let res = await axios.post('/api/product/apiGroup', { action: 'create', data: body })
        if(!res.data.success) return showError(res.data.softoneError)
        let parent = res.data.parent
        setDisabled(true)
        setSubmitted(true)
        showSuccess('Επιτυχής εισαγωγή στην βάση')
        showSuccess('Eπιτυχής Update στην Κατηγορία: ' + parent)
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
                    name="categoryid"
                    required
                    label={'Κατηγορία'}
                    options={parent}
                    optionLabel={'label'}
                    placeholder='label'
                    optionValue={'value._id'}
                    error={errors.categoryName}
                    />
                <Input
                    toolip="Σε ποιά κατηγορία ανήκει;"
                    label={'Όνομα Κατηγορίας'}
                    name={'groupName'}
                    control={control}
                    required
                    error={errors.groupName}
                />
              
                <FormTitle>Λογότυπο</FormTitle>
                <PrimeUploads
                    setState={setLogo}
                    multiple={false}
                    mb={'20px'} />


                <FormTitle>Φωτογραφίες</FormTitle>
                <PrimeUploads
                    setState={setImages}
                    multiple={false}
                    mb={'30px'} />
             
               

            </Dialog>
        </form>
    )

}





export { EditDialog, AddDialog }
