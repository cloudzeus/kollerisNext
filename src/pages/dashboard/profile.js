
'use client';
import React, { useEffect, useState, useRef } from 'react'
import Input from '@/components/Forms/PrimeInput';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

//Form inmports:
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
//Rest imports:
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { FormTitle, Container } from '@/componentsStyles/dialogforms';
import { useSession } from 'next-auth/react';
import { Avatar } from 'primereact/avatar';

const registerSchema = yup.object().shape({
    firstName: yup.string().required('Συμπληρώστε το όνομα'),
    lastName: yup.string().required('Συμπληρώστε το επώνυμο'),
    email: yup.string().required('Συμπληρώστε το email').email('Λάθος format email'),
    password: yup.string().required('Συμπληρώστε τον κωδικό').min(5, 'Tουλάχιστον 5 χαρακτήρες').max(15, 'Μέχρι 15 χαρακτήρες'),
});



const Profile = () => {
    const toast = useRef(null);
    const [details, setDetails] = useState(false);
    // const [user, setUser] = useState(null)
    const session = useSession();
    const [disabled, setDisabled] = useState(true);
    let user = session.data?.user?.user;
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {...user}
    });

    useEffect(() => {
        reset({...user });
    }, [user, reset]);



    const onSubmit = async (data) => {

    }
    


    return (
        <AdminLayout >
            <div className='shadow-1 bg-white p-4 border-round'>
                <form noValidate onSubmit={handleSubmit(onSubmit)} >
                    <Toast ref={toast} />
                    <div className='mb-5 flex align-items-center'>
                        <Avatar icon={"pi pi-user" } shape="circle" />
                        <div className='ml-2 '>
                            <span className="font-semibold block">{user?.firstName}</span>
                            <span className="text-sm block">{user?.email}</span>
                        </div>
                    </div>
                    <Input
                        label={'Όνομα'}
                        name={'firstName'}
                        mb={'10px'}
                        required
                        disabled={disabled}
                        control={control}
                    />
                    <Input
                        label={'Eπώνυμο'}
                        name={'lastName'}
                        mb={'10px'}
                        required
                        disabled={disabled}
                        control={control}
                    />
                    <Input
                        label={'Εmail'}
                        name={'email'}
                        mb={'10px'}
                        required
                        disabled={disabled}
                        control={control}
                    />
                    <Input
                        label={'Χώρα'}
                        name={'address.country'}
                        disabled={disabled}
                        control={control}
                    />

                    <Button
                        onClick={() => setDetails(prev => !prev)}
                        outlined
                        className='w-9rem mt-4 bg-white'
                        size='small'
                        label="Λεπτομέριες"
                        icon="pi pi-angle-down"
                        severity="secondary"
                        iconPos="right" />
                    {details ? (
                        <div>
                        <FormTitle>Διεύθυνση</FormTitle>
                        <div className='grid'>
                            <div className='col-6'>
                                <Input
                                    label={'Χώρα'}
                                    name={'address.country'}
                                    control={control}
                                    disabled={disabled}
                                />
                            </div>
                            <div className='col-6'>
                                <Input
                                    label={'Διεύθυνση'}	
                                    name={'address.address'}
                                    control={control}
                                    disabled={disabled}
                                />
                            </div>
                            <div className='col-6'>
                                <Input
                                    label={'Πόλη'}	
                                    name={'address.city'}
                                    control={control}
                                    disabled={disabled}
                                />
                            </div>
                            <div className='col-6'>
                                <Input
                                    label={'Τ.Κ.'}	
                                    name={'address.postalcode'}
                                    control={control}
                                    disabled={disabled}
                                />
                            </div>
                       
                         
                        </div>
                        <FormTitle>Τηλέφωνα</FormTitle>
                        <div className='grid'>
                            <div className='col-6'>
                                <Input
                                    label={'Κινητό'}
                                    name={'phones.mobile'}
                                    control={control}
                                    disabled={disabled}
                                />
                            </div>
                            <div className='col-6'>
                                <Input
                                    label={'Κινητό'}
                                    name={'phones.landline'}
                                    control={control}
                                    disabled={disabled}
                                />
                            </div>

                        </div>
                    </div>
                ) : null}
                   <div className='mt-4 border-top-1 pt-4 border-300'>
                   <Button  style={{ width: '40px', height: '40px' }} icon="pi pi-pencil" onClick={() => setDisabled(prev => !prev)} />
                    {!disabled ? (
                        <Button 
                            onClick={handleSubmit(onSubmit)}
                            className='ml-2' 
                            type='submit' 
                            label="Αποθήκευση" 
                            severity="info" 
                            style={{  height: '40px' }}/> 
                    ): null}
                   </div>
                </form>
            </div>

        </AdminLayout>
    )
}







export default Profile