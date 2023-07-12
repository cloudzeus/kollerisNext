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

import { PrimeInputPass } from '@/components/Forms/PrimeInputPassword';
import PrimeSelect from '@/components/Forms/PrimeSelect';
import { useSession } from "next-auth/react"

const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {

    const dispatch = useDispatch();
    const [images, setImages] = useState([])
    const [logo, setLogo] = useState([])
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
    const { data: session, status } = useSession()

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            firstName: gridRowData?.firstName,
            lastName: gridRowData?.lastName,
            email: gridRowData?.email,
            role: gridRowData?.role,
        }
    });

    console.log(gridRowData)
   
    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);




    const handleEdit = async (data) => {

        const object = {
            ...data,
        }
        try {
            const updatedFrom = session.user.user.lastName

            let resp = await axios.post('/api/user/apiUser', 
            {
                action: "update", 
                data: {...object, updatedFrom: updatedFrom}, 
                id: gridRowData._id
            })
            
            if(!resp.data.success) showError(resp.data.error)
            showSuccess()
            setSubmitted(true)
            hideDialog()
               
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
                    header="Διόρθωση Xρήστη"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                    
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
                    name="newpassword"
                    label={'Νέος Κωδικός'}
                />
                <PrimeSelect 
                    control={control}
                    name="role"
                    required
                    label={'Δικαιώματα Χρήστη'}
                    options={[
                        { role: 'user' },
                        { role: 'employee' },
                        { role: 'manager' },
                        { role: 'admin' },
                    ]}
                    optionLabel={'role'}
                    placeholder='label'
                    optionValue={'role'}
                  
                    />
                </Dialog>
            </form>
        </Container>

    )
}



const addSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
});


const AddDialog = ({dialog,hideDialog,setSubmitted}) => {


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
      
        let resp = await axios.post('/api/user/apiUser', { action: 'create', data: data })
        if(!resp.data.success) return showError(resp.data.error)
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
                    label={'Κωδικός'}
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
