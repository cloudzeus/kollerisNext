import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import LoginLayout from '@/layouts/Auth/loginLayout'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
//REDUX:
import { fetchUser } from '@/features/userSlice';
//TOAST:
import { toast } from 'react-toastify';
//COMPONENTS- LAYOYTS: 
import { Grid } from '@mui/material'
import Image from 'next/image'
import CheckboxInput from '@/components/Forms/CheckboxInput';
import { StyledHeader, Subheader } from '@/components/Forms/formStyles';
import Button from '@/components/Buttons/Button';
import Divider from '@mui/material/Divider';
import { useSession, signIn } from "next-auth/react"
//FORMIK:

import { InputStyled, InputPass } from "@/components/Forms/FormInput";


const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),
    password: yup.string().required('Συμπληρώστε τον κωδικό'),
});

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log(data)
        const res = await signIn("credentials",
            {
                username: data.email,
                password: data.password,
                redirect: false,
            })
        console.log(res)
        // //if next auth response  is ok:
        if (res.ok == true && res.status == 200 && res.error == null) {
            setLoading(false);
            router.push('/dashboard')
            dispatch(fetchUser({ username: data.email, password: data.password }))
            toast.success('Επιτυχής σύνδεση');
        } else {

            toast.error('Δεν βρέθηκε χρήστης');
            setLoading(false);
        }
        reset();

    };

    return (
        < LoginLayout >
            <Container>
                <Container className="box">
                    <Grid container justifyContent="center" alignItems="center" direction="row" mb='40px'>
                        <Grid item xs={8}>
                            <StyledHeader>ΚΑΛΩΣ ΗΡΘΑΤΕ!</StyledHeader>
                            <Subheader>Συνδεθείτε στον λογαριασμό σας</Subheader>
                        </Grid>
                        <Grid
                            item
                            container
                            xs={4}
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Image
                                src="/static/imgs/logoDG.png"
                                alt="Picture of the author"
                                width={100}
                                height={28}
                            />
                        </Grid>
                    </Grid>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <InputStyled
                            label="email"
                            name="email"
                            type="email"
                            register={register}
                            error={errors.email}
                        />
                        <InputPass
                            label="Κωδικός"
                            name="password"
                            register={register}
                            error={errors.password}
                        />

                        {/* Checkbox row */}
                        <div className='flexBetween'>
                            <CheckboxInput label={'Αποθήκευση κωδικού'} />
                            <Link className="linkBtn" href="/auth/reset-password" >
                                Αλλαγή κωδικού
                            </Link>
                        </div>
                        {/* Login Button */}
                        <Button size={'100%'} type="submit" loading={loading} >Σύνδεση</Button>
                        <Divider variant="middle" color={"#fff"} sx={{ margin: '20px 0' }} />
                        <div className="centerDiv">
                            <Link className="linkBtn" href="/auth/register" >
                                Δημιουργία Λογαριασμού
                            </Link>
                        </div>
                    </form>
                </Container>
            </Container>

        </LoginLayout>


    );
};


const Container = styled.div`
    padding: 30px;
    width: 450px;
    @media (max-width: 499px) {
        width: 90%;
    } 

    .centerDiv {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }

    .flexBetween {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 40px;
        font-size: 14px;
    }

 
`

export default LoginForm;