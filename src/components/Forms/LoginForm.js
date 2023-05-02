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
import {toast} from 'react-toastify';

import Button from '../Buttons/Button';
import { useTheme } from '@emotion/react';


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



	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if(values.email === '' || values.password === '') {
			toast.error('Συμπληρώστε τα στοιχεία');

		}

			if(user === null && values.email !== '' && values.password !== '') {
			toast.error('Δεν βρέθηκε χρήστης');
		}
	
		dispatch(loginUser({ email: values.email, password: values.password }))
	}

	const redirect = () => {
		router.push('/test')
	}

	useEffect(() => {
		if(user !== null) {
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
				<div>

			

				</div>
			</CenterDiv>
		</Container >
	)
}



// const SVG = () => {
// 	const theme = useTheme();
// 	return (
// 		<>
// 			<svg viewBox='0 0 100 100'>
// 						<style type="text/css" >
// 							{`.st0{fill:${theme.palette.primary.main};`}
// 							{`.st1{fill:#414042;}`}
							
// 						</style>
// 						<g>
// 							<path class="st0" d="M73.69,48.24c0-0.08,0.01-0.15,0.01-0.23c0.08-12.01,6.7-21.84,18.9-21.84c7.71,0,12.71,2.72,15.86,9.51h19.12
// 								c-3.7-19.7-19.66-27.96-34.98-28.07c-10.63,0-21.31,4.11-28.8,12.29c-6.07,6.64-10.05,15.93-10.18,27.91v0.79
// 								c-0.16,10.7-6.35,21.26-18.59,21.26h-8.82V44.09V26.5h8.82c6.04,0,10.61,2.58,13.69,6.48C50.69,26.1,54,20.05,58.6,15
// 								c-5.91-4.54-13.56-7.35-22.95-7.39H6.27l0.01,36.48v44.67h29.37c12.41-0.06,21.78-4.94,28.11-12.26c6.57-7.6,9.88-17.83,9.94-28.08
// 								C73.7,48.35,73.69,48.3,73.69,48.24 M128.65,42.69H92.7v17.55h16.19c-3.48,7.57-8.47,9.73-16.3,9.73c-5.96,0-10.79-2.32-14.09-6.36
// 								c-1.95,6.63-5.17,12.67-9.42,17.62c6.83,5.01,15.18,7.53,23.51,7.53c14.01,0,28.46-6.34,33.89-22.86
// 								C129.09,58.2,129.09,50.61,128.65,42.69"/>
// 							<path class="st1" d="M175.36,63.97c0-5.47-6.47-6.7-14.27-7.14c-16.95-1.23-28.1-7.02-28.32-23.97c-0.67-33.68,60-33.68,59.55,0
// 								h-18.96c0-10.37-20.97-9.48-21.64-0.22c-0.44,5.91,5.35,7.14,12.38,7.92c15.5,1.67,30.68,4.01,30.68,23.54
// 								c0,32.78-63.57,33.33-63.12-1.01h19.29C150.94,73,175.36,73.12,175.36,63.97"/>
// 							<path class="st1" d="M197.55,48.03c0-53.98,80.06-53.98,80.06,0C277.61,102.11,197.55,102.11,197.55,48.03 M257.21,48.03
// 								c0-28.1-39.14-28.1-39.14,0C218.07,76.35,257.21,76.35,257.21,48.03"/>
// 							<polygon class="st1" points="302.35,61.63 302.35,86.94 282.05,86.94 282.05,8.89 330.68,8.89 330.68,26.73 302.35,26.73 
// 								302.35,43.79 327.44,43.79 327.44,61.63 	"/>
// 							<polygon class="st1" points="334.65,26.73 334.65,8.89 392.64,8.89 392.64,26.73 373.57,26.73 373.57,86.94 353.83,86.94 
// 								353.83,26.73 	"/>
// 						</g>
// 					</svg>
// 		</>
// 	)
// }






export default LoginForm