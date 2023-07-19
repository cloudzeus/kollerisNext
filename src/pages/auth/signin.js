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
import Image from 'next/image'
import CheckboxInput from '@/components/Forms/CheckboxInput';
import { StyledHeader, Subheader } from '@/components/Forms/formStyles';
// import Button from '@/components/Buttons/Button';
import {  signIn } from "next-auth/react"
//FORMIK:
import { Divider } from 'primereact/divider';

import Input from "@/components/Forms/PrimeInput";
import { PrimeInputPass } from "@/components/Forms/PrimeInputPassword";
import { Button } from "primereact/button";

const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),
    password: yup.string().required('Συμπληρώστε τον κωδικό'),
});

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const {handleSubmit, formState: { errors }, reset, control } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data, event) => {
        event.preventDefault();
        setLoading(true)
        const res = await signIn("credentials",
            {
                username: data.email,
                password: data.password,
                redirect: false,
            })
        console.log('next auth credentials response: ' + JSON.stringify(res))
        if (res.ok == true && res.status == 200 && res.error == null) {
            setLoading(false);
            router.push('/dashboard')
            dispatch(fetchUser({ username: data.email, password: data.password }))
            toast.success('Επιτυχής σύνδεση');
        } else {
            toast.error('Δεν βρέθηκε χρήστης');
            setLoading(false);
        }
        // reset();

    };

    return (
        < LoginLayout >
            <Container>
                <Container className="box">
                    <div className="grid mb-4">
                        <div className="col-8">
                            <h2>ΚΑΛΩΣ ΗΡΘΑΤΕ!</h2>
                            <Subheader>Συνδεθείτε στον λογαριασμό σας</Subheader>
                        </div>
                        <div className="col-4">
                            <Image
                                src="/static/imgs/logoDG.png"
                                alt="Picture of the author"
                                width={100}
                                height={28}
                            />
                        </div>
                    </div>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                     <Input
                    label={'email'}
                    name={'email'}
                    mb={'10px'}
                    required
                    control={control}
                    error={errors.email}
                />
                <PrimeInputPass
                    label={'password'}
                    name={'password'}
                    mb={'10px'}
                    required
                    control={control}
                    error={errors.password}
                />
                        <div className='flexBetween'>
                            <CheckboxInput label={'Αποθήκευση κωδικού'} />
                            <Link className="linkBtn" href="/auth/reset-password" >
                                Αλλαγή κωδικού
                            </Link>
                        </div>
                        <Button 
                            type="submit" 
                            label="Σύνδεση" 
                            loading={loading} 
                            style={{width: '100%'}} 
                        />
                        <Divider className="my-4" />
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
    h2 {
        color: #4b4c4b;
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