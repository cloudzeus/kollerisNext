'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import { TextAreaInput } from '@/components/Forms/PrimeInput';
import axios from 'axios';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Divider, Container } from '@/componentsStyles/dialogforms';

import { useSession } from "next-auth/react"


const addSchema = yup.object().shape({
    // subGroupName: yup.string().required('Συμπληρώστε το όνομα'),
    NAME: yup.string().required('To όνομα είναι υποχρεωτικό'),
});


const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
    //This component has one Image only:

    const [parent, setParent] = useState([])
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });



    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);
    
    console.log(gridRowData)


   
   
    const handleEdit = async (data) => {
        let user = session.user.user.lastName
      
        let obj = {
            ...data,
            PRICER01: gridRowData.PRICER01[0],
            PRICER02: gridRowData.PRICER02[0],
            PRICER03: gridRowData.PRICER03[0],
            PRICER04: gridRowData.PRICER04[0],
            PRICER05: gridRowData.PRICER05[0],

            PRICEW01: gridRowData.PRICEW01[0],
            PRICEW02: gridRowData.PRICEW02[0],
            PRICEW03: gridRowData.PRICEW03[0],
            PRICEW04: gridRowData.PRICEW04[0],
            PRICEW05: gridRowData.PRICEW05[0],
            updatedFrom: user
        }
      

        try {
            let resp = await axios.post('/api/product/apiProduct', {
                action: "update",
                data: obj
            })
            if(!resp.data.success) return showError()
            setSubmitted(true)
            hideDialog()
            showSuccess('Η εγγραφή ενημερώθηκε')
               
        } catch (e) {
            console.log(e)
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
                    header= "Τροποποίηση Κατασκευαστή"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                   <FormTitle>Λεπτομέριες</FormTitle>
                   <Input
                   label={"Όνομα"}
                   name={'name'}
                   control={control}
                   required
                //    error={errors.NAME}
               />
                                   <TextAreaInput
                        autoResize={true}
                        label={'Περιγραφή'}
                        name={'description'}
                        control={control}
                    />
                   <Input
                   label={'Κωδικός ΕΑΝ'}
                   name={'CODE'}
                   control={control}
                   required
                //    error={errors.NAME}
               />
                 
                   <Input
                   label={'Κωδικός εργοστασίου'}
                   name={'CODE1'}
                   control={control}
                   required
               />
                   <Input
                   label={'Κωδικός 2'}
                   name={'CODE2'}
                   control={control}
                   required
               />
                   <Input
                   label={'VAT'}
                   name={'VAT'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΛΙΑΝΙΚΗΣ'}
                   name={'PRICER'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΛΙΑΝΙΚΗΣ 01'}
                   name={'PRICER01'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΛΙΑΝΙΚΗΣ 02'}
                   name={'PRICER02'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΛΙΑΝΙΚΗΣ 03'}
                   name={'PRICER03'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΛΙΑΝΙΚΗΣ 04'}
                   name={'PRICER04'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΛΙΑΝΙΚΗΣ 05'}
                   name={'PRICER05'}
                   control={control}
                   required
               />
                   <Input
                   label={'Τιμή ΑΠΟΘΗΚΗΣ'}
                   name={'PRICEW'}
                   control={control}
                   required
               />
              
                </Dialog>
            </form>
        </Container>

    )
}










export { EditDialog }
