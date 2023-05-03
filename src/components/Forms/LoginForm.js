import React, { useEffect, useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import Image from 'next/image'

import { InputDiv } from './FormInput';
import CheckboxInput from './CheckboxInput';
import Link from 'next/link';
import { TextBtn, Container, StyledHeader, Subheader } from './formStyles';
import { Btn } from '../Buttons/styles';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '../styles';
import { toast } from 'react-toastify';
import { Input, InputPassword } from './FormInput';



const LoginForm = () => {
	const [showPass, setShowPass] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const { user } = useSelector(state => state.user)
	const [values, setValues] = useState({
		email: '',
		password: '',
	})




	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (values.email === '' || values.password === '') {
			toast.error('Συμπληρώστε τα στοιχεία');

		}

		if (user === null && values.email !== '' && values.password !== '') {
			toast.error('Δεν βρέθηκε χρήστης');
		}

		dispatch(loginUser({ email: values.email, password: values.password }))
	}

	const redirect = () => {
		router.push('/test')
	}

	useEffect(() => {
		if (user !== null) {
			redirect();
		}

	}, [user])


	return (
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
				id="email"
				type="text"
				// value={state?.lastName}
				onChange={handleChange}
				label="Email"
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
	)
}










export default LoginForm