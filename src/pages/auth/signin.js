'use client';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
//REDUX:
import { fetchUser } from '@/features/userSlice';
//TOAST:
import { toast } from 'react-toastify';
//COMPONENTS- LAYOYTS: 
import LoginLayout from '@/layouts/Auth/loginLayout'
import { Grid } from '@mui/material'
import Image from 'next/image'
import CheckboxInput from '@/components/Forms/CheckboxInput';
import { TextBtn, Container, StyledHeader, Subheader } from '@/components/Forms/formStyles';
import Button from '@/components/Buttons/Button';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '@/components/styles';
import { Input, InputPassword } from '@/components/Forms/FormInput';
import { useSession, signIn, signOut } from "next-auth/react"
//FORMIK:
import { useFormik } from 'formik';




const LoginForm = () => {
    const router =  useRouter();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);

	const {values, handleChange} = useFormik({
		initialValues: {
			username: '',
			password: '',
		}
	})

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		//Use nextAuth authentificator: 
        const res = await signIn("credentials", 
        { 	
            username: values.username, 
            password: values.password,
            redirect: false,
        })

		//if next auth response  is ok:
        if(res.ok == true && res.status == 200 && res.error == null) {
			setLoading(false);
            router.push('/dashboard')
			dispatch(fetchUser({username: values.username, password: values.password}))
			toast.success('Επιτυχής σύνδεση');
        } else {
            toast.error('Δεν βρέθηκε χρήστης');
			setLoading(false);
        }
        
	}   



	return (
        <LoginLayout>
       <Container >
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
			<Input
				id="username"
				type="text"
				value={values.username}
				onChange={handleChange}
				label="Email"
				placeholder={'example@gmail.com'}
			/>
			<InputPassword
				id="password"
				value={values.password}
				label="Password"
				onChange={handleChange}
				placeholder='******'
			/>

			{/* Checkbox row */}
			<FlexBetween>
				<CheckboxInput label={'Αποθήκευση κωδικού'} />
				<TextBtn >
					<Link href="/auth/reset-password" >
						Αλλαγή κωδικού
					</Link>
				</TextBtn >
			</FlexBetween>
			{/* Login Button */}
			<Button size={'100%'} loading={loading} onClick={handleSubmit}>Σύνδεση</Button>
			<Divider variant="middle" color={"#fff"} sx={{ margin: '20px 0' }} />
			<CenterDiv>
				<TextBtn className='black'>
					<Link href="/auth/register" >
						Δημιουργία Λογαριασμού
					</Link>
				</TextBtn >
			</CenterDiv>
		</Container >
      </LoginLayout>
		
	)
}




export default LoginForm;