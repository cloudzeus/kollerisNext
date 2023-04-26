import React, { useState } from 'react'
import { Grid } from '@mui/material'
import styled from 'styled-components'

import theme from '@/theme/theme';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputDiv } from './FormInput';
import CheckboxInput from './CheckboxInput';
import Link from 'next/link';
import { TextBtn } from './styles';
import { Btn } from '../Buttons/styles';
import Divider from '@mui/material/Divider';
import { FlexBetween, CenterDiv } from '../styles';

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	const [values, setValues] = useState({
		username: 'kminchelle',
		password: '0lelplR',
	})

	// const [register, setRegister] = useState(false)
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const { isAuthenticated } = useSelector(state => state.user)
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// dispatch(loginUser({email: values.email, password: values.password}))
		dispatch(loginUser({ username: values.username, password: values.password }))
		if (isAuthenticated && !register) {
			router.push('/dashboard')
		}
	}

	const handleRegister = () => {
		setRegister((prev) => !prev.register)
	}


	return (
		<Container>
			<LoginBox >
				<Grid container justifyContent="center" alignItems="center" direction="row" mb='40px'>
					<Grid item xs={8}>
						<StyledHeader>ΚΑΛΩΣ ΗΡΘΑΤΕ!</StyledHeader>
						<Subheader>Συνδεθείτε στον λογαριασμό σας</Subheader>
					</Grid>
					<Grid
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
					<input className="customInput" name="name" id="my-name" type='text' />
					<label className="customLabel" htmlFor="my-name">Email/Username</label>
				</InputDiv>
				<InputDiv mt={20}>
					<input className="customInput" name="name" id="passwordid" type='text' />
					<label className="customLabel" htmlFor="passwordid">Password</label>
				</InputDiv>
				{/* Checkbox row */}
				<FlexBetween>
					<CheckboxInput label={'Αποθήκευση κωδικού'} />
					<TextBtn >
						<Link href="/" >
							Αλλαγή κωδικού
						</Link>
					</TextBtn >
				</FlexBetween>
				{/* Login Button */}
				<Btn>Σύνδεση</Btn>
				<Divider variant="middle" color={"#fff"} sx={{ margin: '20px 0' }} />

				<CenterDiv>
					<TextBtn className='black'>
						<Link href="/" >
							Δημιουργία Λογαριασμού
						</Link>
					</TextBtn >
				</CenterDiv>
			</LoginBox >
		</Container>
	)
}


const StyledHeader = styled.h1`
  font-size: 1.2rem;
  color: ${theme.palette.primary.main};
  font-weight: 900;
  font-family: 'Roboto Condensed', 'Roboto', sans-serif;
  margin-bottom: 3px;
`

const Subheader = styled.h2`
  font-size: 0.9rem;
  color: ${theme.palette.text.light};
  font-weight: 300;
`

const LoginBox = styled.div`
  padding: 30px;
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; */
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`
const Container = styled.div`
  width: 450px;
  @media (max-width: 499px) {
      widtd: auto;
  } 
`


export default LoginForm