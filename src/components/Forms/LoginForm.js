import React, { useEffect, useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputDiv } from './FormInput';
import CheckboxInput from './CheckboxInput';
import Link from 'next/link';
import { TextBtn, Container, StyledHeader, Subheader } from './formStyles';
import { Btn } from '../Buttons/styles';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '../styles';


import Button from '../Buttons/Button';


const LoginForm = () => {
	const [showPass, setShowPass] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const {user} = useSelector(state => state.user)
	const [values, setValues] = useState({
		email: '',
		password: '',
	})

	const handleShowPass = () => setShowPass((show) => !show);


	useEffect(() => {
		console.log('user is:' + user)
	}, [user])

	// const { isAuthenticated } = useSelector(state => state.user)
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	};

		console.log(values)
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginUser({ email: values.email, password: values.password }))
		if(user !== null) {
			router.push('/test')
			console.log('user is:' + user)
		}

		
	}




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
					alignItems="center">
					<Image
						src="/static/imgs/logoDG.png"
						alt="Picture of the author"
						width={100}
						height={28}
					/>
				</Grid>
			</Grid>
			<InputDiv mt={10}>
				<input className="customInput " placeholder='example@gmail.com' name="email" id="my-name" type='text' onChange={handleChange} />
				<label className="customLabel" htmlFor="my-name">Email/Username</label>
			</InputDiv>
			<InputDiv mt={20}>
				<input className="customInput" placeholder='******' name="password" id="password" type={showPass ? 'text' : 'password'} onChange={handleChange} />
				<label className="customLabel" htmlFor="password">Password</label>
				<IconButton className='showPassIcon' onClick={handleShowPass}>
					{showPass ? <VisibilityOff /> : <Visibility />}
				</IconButton>
			</InputDiv>
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
			</CenterDiv>
		</Container >
	)
}









export default LoginForm