'use client';

import React, { useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import { StyledHeader, TextBtn, Container, Subheader } from '@/components/Forms/formStyles'
import Link from 'next/link';
import { Btn } from '@/components/Buttons/styles';
import Divider from '@mui/material/Divider';
import Image from 'next/image'
import { InputDiv } from '@/components/Forms/FormInput';
import { useDispatch } from 'react-redux';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FlexBetween, CenterDiv } from '@/components/styles';
import CheckboxInput from '@/components/Forms/CheckboxInput';
import LoginLayout from '@/layouts/Auth/loginLayout';
import { registerUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import { Input, InputPassword } from '@/components/Forms/FormInput';

const registerPage = () => {
	const [showPass, setShowPass] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter()
	const handleShowPass = () => setShowPass((show) => !show);
	const [values, setValues] = useState({
		firstName: '',
		lastName: '',
		password: '',
		email: ''

	})

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	}

	const onSubmit = (e) => {
		e.preventDefault();
		dispatch(registerUser({ firstName: values.firstName, password: values.password, lastName: values.lastName, email: values.email }))
		router.push('/test')
	}
	return (
		<LoginLayout>
			<Container>
				<Grid container justifyContent="center" alignItems="center" direction="row" mb='40px'>
					<Grid item xs={8}>
						<StyledHeader>EΓΓΤΡΑΦΗ ΧΡΗΣΤΗ!</StyledHeader>
						<Subheader>Συμπληρώστε τη φόρμα εγγραφής </Subheader>
					</Grid>
					<Grid
						item
						container
						xs={4}
						justifyContent="flex-end"
						alignItems="center">
						<Image
							src="/static/imgs/logoDG.png"
							alt="Picture of the author"
							width={100}
							height={28}
						/>
					</Grid>
				</Grid>
				<Grid container justifyContent="center" alignItems="center" direction="row" columnSpacing={2}>
					<Grid item xs={6}>
						<Input
							id="firstName"
							type="text"
							onChange={handleChange}
							label="Όνομα"
							placeholder='john'
						/>

					</Grid>
					<Grid item xs={6}>
						<Input
							id="lastName"
							type="text"
							onChange={handleChange}
							label="Επώνυμο"
							placeholder='Doe'
						/>

					</Grid>
				</Grid>

				<Input
					id="email"
					type="text"
					onChange={handleChange}
					label="Email"
					placeholder='example@gmail.com'
				/>
				<InputPassword
					id="password"
					label="Password"
					onChange={handleChange}
					placeholder='******'
				/>

				{/* Checkbox row */}
				<FlexBetween>
					<CheckboxInput label={'Συμφωνώ με τους Όρους Χρήσης και την πολιτική απορρήτου'} />
				</FlexBetween>
				{/* Login Button */}
				<Btn onClick={onSubmit}>Εγγραφή</Btn>
				<Divider variant="middle" color={"#fff"} sx={{ margin: '20px 0' }} />

				<CenterDiv>
					<TextBtn className='black'>
						<Link href="/auth/login" >
							Έχετε ήδη λογαριασμό
						</Link>
					</TextBtn >
				</CenterDiv>
			</Container >
		</LoginLayout>

	)
}

export default registerPage;