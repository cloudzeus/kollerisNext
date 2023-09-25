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
import TranslateInput from '@/components/Forms/TranslateInpit';


const addSchema = yup.object().shape({
    // subGroupName: yup.string().required('Συμπληρώστε το όνομα'),
    NAME: yup.string().required('To όνομα είναι υποχρεωτικό'),
});


const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
    //This component has one Image only:
    const [descriptions, setDescriptions] = useState(
        {
            de: '',
            en: '',
            es: '',
            fr: '',
        }
    )
    const [parent, setParent] = useState([])
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });

    const handleGerman = async (value) => {
        setDescriptions({ ...descriptions, de: value })
    }

    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);





    const handleEdit = async (data) => {
        let user = session.user.user.lastName
        console.log(data)
     

        try {
            let resp = await axios.post('/api/product/apiProduct', {
                action: "update",
                data: data,
            })
            if (!resp.data.success) return showError()
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
                    header="Τροποποίηση Κατασκευαστή"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                    <FormTitle>Λεπτομέριες</FormTitle>
                    <Input
                        label={"Όνομα"}
                        name={'NAME'}
                        control={control}
                        required
                    //    error={errors.NAME}
                    />
                    <TextAreaInput
                        autoResize={true}
                        label={'Ελληνική Περιγραφή'}
                        name={'DESCRIPTION'}
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
                        label={'Τιμή ΑΠΟΘΗΚΗΣ'}
                        name={'PRICEW'}
                        control={control}
                        required
                    />
                    <Input
                        label={'Τιμή Scroutz'}
                        name={'PRICE05'}
                        control={control}
                        required
                    />
                    <FormTitle>ΜΕΤΑΦΡΑΣΕΙΣ ΠΕΡΙΓΡΑΦΗ:</FormTitle>
                    <TranslateInput 
                       label={'Περιγραφή Γερμανική'}
                       name={'descriptions.de'}
                       control={control}
                       state={descriptions.de}
                       setState={handleGerman}
                       targetLang="GE"
                    />
                    <TranslateInput 
                       label={'Περιγραφή Aγγλική'}
                       name={'descriptions.en'}
                       control={control}
                       state={descriptions.en}
                       setState={handleGerman}
                       targetLang="EN"
                    />
                    <TranslateInput 
                       label={'Περιγραφή Ισπανική'}
                       name={'descriptions.es'}
                       control={control}
                       state={descriptions.es}
                       setState={handleGerman}
                       targetLang="ES"
                    />
                    <TranslateInput 
                       label={'Περιγραφή Γαλλική'}
                       name={'descriptions.fr'}
                       control={control}
                       state={descriptions.fr}
                       setState={handleGerman}
                       targetLang="FR"
                    />
                </Dialog>
            </form>
        </Container>

    )
}





const AutoTranslateInput = ({control, label, name}) => {
    console.log(control)
    console.log(label)
    console.log(name)
    const handletranslate = async () => {
        console.log('translate')
        let resp = await axios.post('/api/deepL', {text: 'Καλημέρα', targetLang: 'EN'})
    }
    return (
        <>  
          <Input
                        label={label}
                        name={name}
                        control={control}
                        required
                    />
            <Button label="auto-tr" />

        </>
    )
}



export { EditDialog }
