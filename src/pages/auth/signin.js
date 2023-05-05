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
import { Btn } from '@/components/Buttons/styles';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '@/components/styles';
import { toast } from 'react-toastify';
import { Input, InputPassword } from '@/components/Forms/FormInput';

import { useSession, signIn, signOut } from "next-auth/react"
import { getCsrfToken } from "next-auth/react"
import { saveUser } from '@/features/userSlice';

const LoginForm = ({ csrfToken}) => {

    const router =  useRouter();
	const dispatch = useDispatch();
	const session = useSession();
	const user = session?.data?.user;
	console.log('user', JSON.stringify(user))
	const [values, setValues] = useState({
		username: '',
		password: '',
	})


	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        const res = await signIn("credentials", 
        { 
            username: values.username, 
            password: values.password,
            redirect: false,
        })
		
        if(res.ok == true && res.status == 200) {
            toast.success('Εγω ειμαι χρήστης');
			dispatch(fetchUser({username: values.username, password: values.password}))
            router.push('/dashboard')
        } else {
            toast.error('Δεν βρέθηκε χρήστης');
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
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
			<Input
				id="username"
				type="text"
				// value={state?.lastName}
				onChange={handleChange}
				label="Username"
				placeholder={'example@gmail.com'}
			/>
			<InputPassword
				id="password"
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
			<Btn onClick={handleSubmit}>Σύνδεση</Btn>
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