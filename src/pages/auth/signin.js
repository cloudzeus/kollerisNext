import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import LoginLayout from '@/layouts/Auth/loginLayout'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchUser } from '@/features/userSlice';
import { toast } from 'react-toastify';
import Image from 'next/image'
import CheckboxInput from '@/components/Forms/CheckboxInput';
import { StyledHeader, Subheader } from '@/components/Forms/formStyles';
import { signIn } from "next-auth/react"
import { Divider } from 'primereact/divider';
import Input from "@/components/Forms/PrimeInput";
import { PrimeInputPass } from "@/components/Forms/PrimeInputPassword";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),
    password: yup.string().required('Συμπληρώστε τον κωδικό'),
});

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const toast = useRef(null);
    const { handleSubmit, formState: { errors }, reset, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            password: '',
            email: '',
        }
    });
    const showSuccess = (message) => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Επιτυχής Σύνδεση', life: 3000});
    }


    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Δεν βρέθηκε χρήστης', life: 3000});
    }


    const onSubmit = async (data, event) => {
        event.preventDefault();
        setLoading(true)
        const res = await signIn("credentials",
            {
                username: data.email,
                password: data.password,
                redirect: false,
            })
        if (res.ok == true && res.status == 200 && res.error == null) {
            router.push('/dashboard/product')
            dispatch(fetchUser({ username: data.email, password: data.password }))
            showSuccess()
        } else {
            showError()
        }
        setLoading(false);

    };

    return (
        < LoginLayout >
            <Toast ref={toast} />
            <Container className="box">
                <div className="grid mb-4">
                    <div className="col-8">
                        <h2>ΚΑΛΩΣ ΗΡΘΑΤΕ!</h2>
                        <Subheader>Συνδεθείτε στον λογαριασμό σας</Subheader>
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
                        style={{ width: '100%' }}
                    />
                    <Divider className="my-4" />
                    <div className="centerDiv">
                        <Link className="linkBtn" href="/auth/register" >
                            Δημιουργία Λογαριασμού
                        </Link>
                    </div>
                </form>
            </Container>

        </LoginLayout>


    );
};


const Container = styled.div`
    padding: 30px;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius: 8px;
    min-width: 450px;
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