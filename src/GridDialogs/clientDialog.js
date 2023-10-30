'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';

import axios from 'axios';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Divider, Container } from '@/componentsStyles/dialogforms';

import { useSession } from "next-auth/react"


const addSchema = yup.object().shape({
    code: yup.string().required('O κωδικός είναι υποχρεωτικός'),
    greekDescription: yup.string().required('Υπορχρεωτική Περιγραφή'),
    englishDescription: yup.string().required('Υπορχρεωτική αγγλική Περιγραφή'),
});


const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
 
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });

    useEffect(() => {
        reset({ ...gridRowData });
    }, [gridRowData, reset]);
    
 
   
    const handleEdit = async (data) => {
        // let user = session.user.user.lastName;
         console.log(data)
   
        try {
            await axios.post('/api/clients/apiClients', {action: "updateOne", data: data})
            setSubmitted(true)
            hideDialog()
            showSuccess('Η εγγραφή ενημερώθηκε')
        } catch (e) {
            showError()
            hideDialog()
        }
       
       
    }

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 4000 });
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
                    header= "Διόρθωση Κατασκευαστή"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                   <FormTitle>Λεπτομέριες</FormTitle>
                   <Input
                   label={'Όνομα'}
                   name={'NAME'}
                   control={control}
                   required
               />
                   <Input
                   label={'ΑΦΜ'}
                   name={'AFM'}
                   control={control}
               />
                   <Input
                   label={'Διεύθυνση'}
                   name={'ADDRESS'}
                   control={control}
               />
               
                   <Input
                   label={'T.K'}
                   name={'ZIP'}
                   control={control}
               />
               
                   <Input
                   label={'Τηλέφωνο'}
                   name={'PHONE01'}
                   control={control}
               />
                   <Input
                   label={'Τηλέφωνο 2'}
                   name={'PHONE02'}
                   control={control}
               />
                   <Input
                   label={'Εmail'}
                   name={'EMAIL'}
                   control={control}
                />
                   <Input
                   label={'DIASCODE'}
                   name={'DIASCODE'}
                   control={control}
                />
               
              
                </Dialog>
            </form>
        </Container>

    )
}





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
            code: '',
            englishDescription: '',
            greekDescription: '',
        }
    });
    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
   
    const cancel = () => {
        hideDialog()
        reset()
    }

    const handleAdd = async (data) => {
        console.log(data)
        let res = await axios.post('/api/product/apiImpa', { action: 'createImpa', data: data })
        console.log(res.data)
        if(!res.data.success) return showError(res.data.error)
        setDisabled(true)
        setSubmitted(true)
        showSuccess('Επιτυχής εισαγωγή στην βάση')
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
                header="Προσθήκη Κατασκευαστή"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}>
                <FormTitle>Λεπτομέριες</FormTitle>
                <Input
                    label={'Impa code'}
                    name={'code'}
                    control={control}
                    required
                    error={errors.code}
                />
                <Input
                    label={'Ελληνική Περιγραφή'}
                    name={'greekDescription'}
                    control={control}
                    required
                    error={errors.greekDescription}
                />
                <Input
                    label={'Αγγλική Περιγραφή'}
                    name={'englishDescription'}
                    control={control}
                    required
                    error={errors.englishDescription}
                />
            </Dialog>
        </form>
    )

}





export { EditDialog, AddDialog }
