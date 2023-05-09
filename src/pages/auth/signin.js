'use client';
import React, { useEffect, useState } from 'react'
import LoginLayout from '@/layouts/Auth/loginLayout'
import { Grid, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { fetchUser } from '@/features/userSlice';

import CheckboxInput from '@/components/Forms/CheckboxInput';
import Link from 'next/link';
import { TextBtn, Container, StyledHeader, Subheader } from '@/components/Forms/formStyles';
// import { Btn } from '@/components/Buttons/styles';
import Button from '@/components/Buttons/Button';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '@/components/styles';
import { toast } from 'react-toastify';
import { Input, InputPassword } from '@/components/Forms/FormInput';

import { useSession, signIn, signOut } from "next-auth/react"
import { getCsrfToken } from "next-auth/react"
import { logoutUser } from '@/features/userSlice';
const LoginForm = () => {

    const router =  useRouter();
	const dispatch = useDispatch();
	const session = useSession();

	const user = session?.data?.user;
	const [values, setValues] = useState({
		username: 'johnrambo@gmail.com',
		password: '12345',
	})
	
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
        const res = await signIn("credentials", 
        { 	
			//here usename will be the email of the use, because NextAUth need a username attribute
            username: values.username, 
            password: values.password,
            redirect: false,
        })
		
        if(res.ok == true && res.status == 200) {
            // toast.success('Εγω ειμαι χρήστης');
			dispatch(fetchUser({username: values.email, password: values.password}))
			
            router.push('/dashboard')
			setLoading(false);
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
            {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
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
			{/* <Btn onClick={handleSubmit}>Σύνδεση</Btn> */}
			<Divider variant="middle" color={"#fff"} sx={{ margin: '20px 0' }} />

			<CenterDiv>
				<TextBtn className='black'>
					<Link href="/auth/register" >
						Δημιουργία Λογαριασμού
					</Link>
				</TextBtn >
				<div>



				</div>
			</CenterDiv>
		</Container >
      </LoginLayout>
		
	)
}


export async function getServerSideProps(context) {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
      },
    }
  }



export default LoginForm;