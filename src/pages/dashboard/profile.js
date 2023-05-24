
'use client';
import React, { useEffect, useState } from 'react'

//Form inmports:
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
//Rest imports:
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { HeaderBox, HeaderBoxShadow } from '@/components/HeaderBox';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Button from '@/components/Buttons/Button';
import SelectInput from '@/components/Forms/SelecInput';
import { Input, InputStyled } from '@/components/Forms/FormInput';


const registerSchema = yup.object().shape({
    firstName: yup.string().required('Συμπληρώστε το όνομα'),
    lastName: yup.string().required('Συμπληρώστε το επώνυμο'),
    email: yup.string().required('Συμπληρώστε το email').email('Λάθος format email'),
    password: yup.string().required('Συμπληρώστε τον κωδικό').min(5, 'Tουλάχιστον 5 χαρακτήρες').max(15, 'Μέχρι 15 χαρακτήρες'),
});



const Profile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user)

    const [state, setState] = useState({
        _id: '',
        email: '',
        firstName: '',
        lastName: '',
        landline: '',
        mobile: '',
        country: '',
        city: '',
        address: '',
        postalcode: '',
      
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({

    });

    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(true);

    useEffect(() => {
        console.log('user in profile: ' + JSON.stringify(user))
        setState({
            ...state,
            _id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            landline: user?.phones?.landline,
            mobile: user?.phones?.mobile,
            country: user?.address?.country,
            city: user?.address?.city,
            address: user?.address?.address,
            postalcode: user?.address?.postalcode,
        })
    }, [user])

    console.log(edit)


 

    const handleSelect = (name, value) => {
        setState({ ...state, [name]: value })
    }


    // const handleUpdateUser = async (e) => {
    //     e.preventDefault()
    //     dispatch(updateUser(state));

    // }
    const handleButton = (e) => {
        e.preventDefault();
        console.log('edit')
        setEdit((prev) => !prev)


    }

    const onSubmit = (data) => {
        console.log('edit')
        setEdit((prev) => !prev)
        if(edit) {
            dispatch(updateUser(data));
        }
   
      
    }
    return (
        <AdminLayout >
            <HeaderBox title={'Profile'}>
                <Div>
                    <Grid container >
                        {/* LEFT SIDE */}
                        {/* <Grid item xs={12} lg={4}>
                            <HeaderBoxShadow align="center" title={'Eικόνα Προφίλ'}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src='/static/imgs/avatar.jpg'
                                    sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px', width: 100, height: 100 }}
                                />
                                <p>Αλλάξτε την Εικόνα Προφίλ σας</p>
                                <Btn className="btn"> Αλλαγή Avatar</Btn>
                            </HeaderBoxShadow>
                        </Grid> */}
                        {/* RIGTH SIDE */}
                        <Grid item xs={12} lg={8} >
                            <HeaderBoxShadow title={'Αλλαγή Πληροφοριών Προφίλ'}>
                                <form noValidate onSubmit={() => handleSubmit(onSubmit)}>
                                    <InputStyled
                                        label="email"
                                        name="email"
                                        type="email"
                                        register={register}
                                        defaultValue={state.email}
                                        disabled={edit}
                                    />
                                    <Grid container columnSpacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <InputStyled
                                                label="Όνομα"
                                                name="firstName"
                                                type="text"
                                                register={register}
                                                defaultValue={state.firstName}
                                                disabled={edit}
                                            // error={errors.firstName}
                                            />

                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputStyled
                                                label="Επώνυμο"
                                                name="lastName"
                                                type="text"
                                                register={register}
                                                defaultValue={state.lastName}
                                                disabled={edit}
                                            // error={errors.firstName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <InputStyled
                                                label="landline"
                                                name="landline"
                                                type="text"
                                                register={register}
                                                defaultValue={state.landline}
                                                disabled={edit}
                                            // error={errors.firstName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <InputStyled
                                                label="Κινητό"
                                                name="mobile"
                                                type="text"
                                                register={register}
                                                defaultValue={state.mobile}
                                                disabled={edit}                                            // error={errors.firstName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <SelectInput
                                                id='country'
                                                items={['Eλλάδα', 'Αγγλία', 'Ισπανία']}
                                                label="Xώρα"
                                                onChange={handleSelect}
                                                value={state.country}
                                                edit={edit}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <InputStyled
                                                label="Διεύθυνση"
                                                name="address"
                                                type="text"
                                                register={register}
                                                defaultValue={state.address}
                                                disabled={edit}
                                            // error={errors.firstName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <InputStyled
                                                label="Πόλη"
                                                name="city"
                                                type="text"
                                                register={register}
                                                defaultValue={state.city}
                                                disabled={edit}
                                            // error={errors.firstName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <InputStyled
                                                label="T.K"
                                                name="postalcode"
                                                type="text"
                                                register={register}
                                                defaultValue={state.postalcode}
                                                disabled={edit}
                                            />
                                        </Grid>

                                    </Grid>
                                    <Button 
                                        edit={edit}
                                        loading={isLoading} 
                                        onClick={handleButton}
                                        type="submit"
                                        >{edit ? 'Επεξεργασία' : 'Αποθήκευση'}
                                    </Button>
                                </form>
                            </HeaderBoxShadow>
                        </Grid>
                    </Grid>

                </Div>
            </HeaderBox>
        </AdminLayout>
    )
}





const Div = styled.div`
    width: 100%;
    padding: 20px;
    p {
        font-size: 13px;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .btn {
        width: 120px;
        height: 40px;
        margin-top: 10px;
    }
`


export default Profile