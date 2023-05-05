
'use client';
import React, { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { HeaderBox, HeaderBoxShadow } from '@/components/HeaderBox';
import { Avatar } from '@mui/material';
import { Btn } from '@/components/Buttons/styles';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/features/userSlice';
import Button from '@/components/Buttons/Button';
import SelectInput from '@/components/Forms/SelecInput';
import { Input } from '@/components/Forms/FormInput';

const Profile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user)

    const [state, setState] = useState({
        _id: '',
        firstName:  '',
        lastName:'',
        email: '',
        landline:  '',
        mobile:  '',
        country:  '',
        city: '',
        address:  '',
        postalcode:  '',
    })

  

    useEffect(() => {
            console.log(user)
          setState({
            ...state,
            _id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            landline: user?.phones.landline,
            mobile: user?.phones.mobile,
            country: user?.address.country,
            city: user?.address.city,
            address: user?.address.address,
            postalcode: user?.address.postalcode,
        })
    }, [user])

   

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setState({ ...state, [name]: value });
    };

    
    const handleSelect = (name, value) => {
        setState({ ...state, [name]: value })
    }


    const handleUpdateUser = async (e) => {
        e.preventDefault()
        dispatch(updateUser(state));
        
    }
    return (
        <AdminLayout >
            <HeaderBox title={'Profile'}>
                <Div>
                    <Grid container >
                        {/* LEFT SIDE */}
                        <Grid item xs={12} lg={4}>
                            <HeaderBoxShadow align="center" title={'Eικόνα Προφίλ'}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src='/static/imgs/avatar.jpg'
                                    sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px', width: 100, height: 100 }}
                                />
                                <p>Αλλάξτε την Εικόνα Προφίλ σας</p>
                                <Btn className="btn"> Αλλαγή Avatar</Btn>
                            </HeaderBoxShadow>
                        </Grid>
                        {/* RIGTH SIDE */}
                        <Grid item xs={12} lg={8} >
                            <HeaderBoxShadow title={'Αλλαγή Πληροφοριών Προφίλ'}>

                                <form>
                                    <Input
                                        id="email"
                                        type="text"
                                        value={state.email}
                                        onChange={handleChange}
                                        label="Email"
                                    />
                                    <Grid container columnSpacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                value={state.firstName}
                                                onChange={handleChange}
                                                label="Όνομα"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                value={state.lastName}
                                                onChange={handleChange}
                                                label="Επώνυμο"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="landline"
                                                type="text"
                                                value={state.landline}
                                                onChange={handleChange}
                                                label="Σταθερό"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="mobile"
                                                type="text"
                                                value={state.mobile}
                                                onChange={handleChange}
                                                label="Κινητό"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <SelectInput 
                                                id='country' 
                                                items={['Eλλάδα', 'Αγγλία', 'Ισπανία']} 
                                                label="Xώρα" 
                                                onChange={handleSelect} 
                                                value={state.country}
                                                />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="address"
                                                type="text"
                                                value={state.address}
                                                onChange={handleChange}
                                                label="Διεύθυνση"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={state.city}
                                                onChange={handleChange}
                                                label="Πόλη"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="postalcode"
                                                type="text"
                                                value={state.postalcode}
                                                onChange={handleChange}
                                                label="T.K"
                                            />
                                        </Grid>
                                       
                                    </Grid>
                                    <Button onClick={handleUpdateUser}>
                                        Αποθήκευση
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