
'use client';
import React, { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { HeaderBox, HeaderBoxShadow } from '@/components/HeaderBox';
import { Avatar } from '@mui/material';
import { Btn } from '@/components/Buttons/styles';
import styled from 'styled-components';
import { InputDiv } from '@/components/Forms/FormInput';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/features/userSlice';
import Button from '@/components/Buttons/Button';


const Profile = () => {

    const { user, isLoading } = useSelector(state => state.user)
    console.log('user' + JSON.stringify(user))
    const [state, setState] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        landline: '',
        address: {
            country: '',
            address: '',
            city: '',
            province: '',
        },

    })

    useEffect(() => {
        setState({ ...state, _id: user?._id, firstName: user?.firstName, lastName: user?.lastName, email: user?.email, landline: user?.phones.landline, mobile: user?.phones.mobile})
    }, [])

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setState({ ...state, [name]: value });
    };


    const dispatch = useDispatch()

    const handleUpdateUser = (e) => {
        e.preventDefault()
        dispatch(updateUser(state))
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
                                    <InputDiv mt={10}>
                                        <input name="email" id="email" type='text' value={state?.email} onChange={handleChange} />
                                        <label htmlFor="my-name">Email</label>
                                    </InputDiv>
                                    <Grid container columnSpacing={2}>
                                        <Grid item xs={6}>
                                            <InputDiv mt={10}>
                                                <input name="firstName" id="firstName" type='text' value={state?.firstName} onChange={handleChange}/>
                                                <label htmlFor="firstName">Όνομα</label>
                                            </InputDiv>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <InputDiv mt={10}>
                                                <input name="lastName" id="lastName" type='text' value={state?.lastName} onChange={handleChange} />
                                                <label htmlFor="lastName">Επώνυμο</label>
                                            </InputDiv>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <InputDiv mt={10}>
                                                <input name="landline" id="landline" type='text' value={state?.landline} onChange={handleChange}/>
                                                <label htmlFor="landline">Σταθερό</label>
                                            </InputDiv>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <InputDiv mt={10}>
                                                <input name="mobile" id="mobile" type='text' value={state?.mobile} onChange={handleChange} />
                                                <label htmlFor="mobile">Κινητό</label>
                                            </InputDiv>
                                        </Grid>
                                        <Grid item xs={6}>
                                           
                                        </Grid>
                                        <Grid item xs={6}>

                                        </Grid>
                                    </Grid>
                                    <div>
                                        <Button
                                            onClick={handleUpdateUser}
                                            >Αποθήκευση</Button>
                                    </div>
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