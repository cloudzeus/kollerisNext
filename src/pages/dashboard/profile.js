
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

const Profile = () => {


    const { user } = useSelector(state => state.user)
    const [state, setState] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phones: {
            mobile: '',
            phones: ''
        },
        address: {
            country: '',
            address: '',
            city: '',
            province: '',
        },

    })

    useEffect(() => {
        setState({ ...state, firstName: user?.firstName, lastName: user?.lastName, email: user?.email })
    }, [])

    const handleChange = (e) => {
        const name = e.target.name;
        console.log(name)
        const value = e.target.value;
        setState({ ...state, [name]: value });
    };


    const dispatch = useDispatch()

    const handleUpdateUser = (e) => {
        e.preventDefault()
        dispatch(updateUser(state))
    }
    console.log(user)
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
                                                <input name="lastName" id="lastName" type='text' value={user?.lastName} onChange={handleChange} />
                                                <label htmlFor="lastName">Επώνυμο</label>
                                            </InputDiv>
                                        </Grid>
                                        <Grid item xs={6}>
                                           
                                        </Grid>
                                        <Grid item xs={6}>

                                        </Grid>
                                    </Grid>
                                    <div>
                                        <Btn
                                            onClick={handleUpdateUser}
                                            className="btn">Αποθήκευση</Btn>
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