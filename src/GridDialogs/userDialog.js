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
import { resetGridRowData } from '@/features/grid/gridSlice';
import { InputTextarea } from 'primereact/inputtextarea';
import { TextAreaInput } from '@/components/Forms/PrimeInput';
import { PrimeInputPass } from '@/components/Forms/PrimeInputPassword';
import PrimeSelect from '@/components/Forms/PrimeSelect';

const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([])
    const [logo, setLogo] = useState([])
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });

  
   
    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);


    const [videoList, setVideoList] = useState(gridRowData?.videoPromoList)
    useEffect(() => {
        setVideoList(gridRowData?.videoPromoList)
        //handle images:
        let newArray = []
        if (gridRowData?.photosPromoList && gridRowData?.photosPromoList.length > 0) {

            for (let image of gridRowData?.photosPromoList) {
                newArray.push(image.photosPromoUrl)
            }
            setImages(newArray)
        }
    }, [gridRowData])


    const handleEdit = async (data) => {

        const object = {
            ...data,
            videoPromoList: videoList,
            logo: logo[0]
        }
        console.log('object')
        console.log(object)
        try {
            let resp = await axios.post('/api/product/apiMarkes', {action: "update", data: object, id: gridRowData._id, mtrmark: gridRowData?.softOne?.MTRMARK})
                if(!resp.data.success) {
                    showError()
                }
                if(resp.data.success) {
                    showSuccess()
                    setSubmitted(true)
                    hideDialog()
                }
               
        } catch (e) {
            console.log(e)
        }
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
                    header="Διόρθωση Προϊόντος"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                    <FormTitle>Λεπτομέριες</FormTitle>
                    <Input
                        label={'Όνομα'}
                        name={'name'}
                        control={control}
                        required
                    />
                    <TextAreaInput
                        autoResize={true}
                        label={'Περιγραφή'}
                        name={'description'}
                        control={control}
                    />
                    < Divider />
                    <FormTitle>Λογότυπο	</FormTitle>
                   
                </Dialog>
            </form>
        </Container>

    )
}



const addSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
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
        // resolver: yupResolver(addSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: '',
        }
    });

    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
  


    const cancel = () => {
        hideDialog()
        reset()
    }


    const handleAdd = async (data) => {
        console.log('data')
        console.log(data)
        setDisabled(false)
      
      
        let res = await axios.post('/api/user/apiUser', { action: 'create', data: data })
        if(!res.data.success) return showError()
        setDisabled(true)
        setSubmitted(true)
        showSuccess()
        hideDialog()
        reset();
    }

    const productDialogFooter = (
        <>
            <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={cancel} />
            <Button label="Αποθήκευση" icon="pi pi-check" type="submit" onClick={handleSubmit(handleAdd)} disabled={disabled} />
        </>
    );

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
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
                header="Προσθήκη Χρήστη"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}>
               
                <Input
                    label={'Όνομα'}
                    name={'firstName'}
                    mb={'10px'}
                    required
                    control={control}
                />
                 <Input
                    label={'Eπώνυμο'}
                    name={'lastName'}
                    mb={'10px'}
                    required
                    control={control}
                />
                 <Input
                    label={'Εmail'}
                    name={'email'}
                    mb={'10px'}
                    required
                    control={control}
                />
               
                <PrimeInputPass
                    control={control}
                    name="password"
                />
                <PrimeSelect 
                    control={control}
                    name="role"
                    required
                    label={'Δικαιώματα Χρήστη'}
                    values={[
                            { role: 'user' },
                            { role: 'employee' },
                            { role: 'manager' },
                            { role: 'admin' },
                         
                        ]}
                  
                    />
            </Dialog>
        </form>
    )

}





export { EditDialog, AddDialog }
