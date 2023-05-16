import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import { IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
import { TextBtn, Container, StyledHeader, Subheader } from '@/components/Forms/formStyles';
import Button from '@/components/Buttons/Button';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '@/components/styles';
import { useSession, signIn, signOut } from "next-auth/react"
//FORMIK:

import { InputStyled, InputPass } from "@/components/Forms/FormInput";


const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Το email είναι υποχρεωτικό'),
    password: yup.string().min(5).max(32).required(),
});

const Form = () => {
    const [loading, setLoading] = useState(false);
    const router =  useRouter();
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
            if(res.ok == true && res.status == 200 && res.error == null) {
                setLoading(false);
                router.push('/dashboard')
                dispatch(fetchUser({username: data.email, password: data.password}))
                toast.success('Επιτυχής σύνδεση');
            } else {

                toast.error('Δεν βρέθηκε χρήστης');
                setLoading(false);
            }
        reset();
      
    };

    return (
        < LoginLayout >
         <Container >
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
                <button type="submit">Sign in</button>
            </form>
         </Container>
         
        </LoginLayout>
        
         
    );
};




export default Form;