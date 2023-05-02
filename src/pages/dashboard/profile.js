import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { HeaderBox, HeaderBoxShadow } from '@/components/HeaderBox';
import { Avatar } from '@mui/material';
import { Btn } from '@/components/Buttons/styles';
import styled from 'styled-components';
import { InputDiv } from '@/components/Forms/FormInput';
import { Grid } from '@mui/material';

const Profile = () => {
    return (
        <AdminLayout >
            <HeaderBox title={'Profile'}>
                <Div>
                    <Grid container >
                        {/* LEFT SIDE */}
                        <Grid item xs={12}  lg={4}>
                            <HeaderBoxShadow  align="center" title={'Eικόνα Προφίλ'}>
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
                            <HeaderBoxShadow  title={'Αλλαγή Πληροφοριών Προφίλ'}>
                                <InputDiv mt={10}>
                                    <input className="customInput" name="email" id="my-name" type='text' />
                                    <label className="customLabel" htmlFor="my-name">Email/Username</label>
                                </InputDiv>
                                <InputDiv mt={10}>
                                    <input className="customInput" name="email" id="my-name" type='text' />
                                    <label className="customLabel" htmlFor="my-name">Email/Username</label>
                                </InputDiv>
                                <Grid container columnSpacing={2}>
                                    <Grid item xs={6}>
                                        <InputDiv mt={10}>
                                            <input className="customInput" name="email" id="my-name" type='text' />
                                            <label className="customLabel" htmlFor="my-name">Email/Username</label>
                                        </InputDiv>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InputDiv mt={10}>
                                            <input className="customInput" name="email" id="my-name" type='text' />
                                            <label className="customLabel" htmlFor="my-name">Email/Username</label>
                                        </InputDiv>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InputDiv  mt={10}>
                                            <input className="customInput" name="email" id="my-name" type='text' />
                                            <label className="customLabel" htmlFor="my-name">Email/Username</label>
                                        </InputDiv>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InputDiv  mt={10} >
                                            <input className="customInput" name="email" id="my-name" type='text' />
                                            <label className="customLabel" htmlFor="my-name">Email/Username</label>
                                        </InputDiv>
                                    </Grid>
                                </Grid>
                                <div>
                                <Btn className="btn">Αποθήκευση</Btn>
                                </div>
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
    }
    .btn {
        width: 120px;
        height: 40px;
        margin-top: 20px;
    }

    

 
`



export default Profile