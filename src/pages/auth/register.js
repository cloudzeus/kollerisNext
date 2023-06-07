'use client';
import React, { useEffect, useState } from 'react'
//Yup and useForm
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
//Rest imports:
import { Grid } from '@mui/material'
import { Subheader } from '@/components/Forms/formStyles'
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/Buttons/Button';
import CheckboxInput from '@/components/Forms/CheckboxInput';
import LoginLayout from '@/layouts/Auth/loginLayout';
import { registerUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { InputStyled, InputPass } from "@/components/Forms/FormInput";


const registerSchema = yup.object().shape({
	firstName: yup.string().required('Συμπληρώστε το όνομα'),
	lastName: yup.string().required('Συμπληρώστε το επώνυμο'),
	email: yup.string().required('Συμπληρώστε το email').email('Λάθος format email'),
	password: yup.string().required('Συμπληρώστε τον κωδικό').min(5, 'Tουλάχιστον 5 χαρακτήρες').max(15, 'Μέχρι 15 χαρακτήρες'),
});




const RegisterPage = () => {
	const { isLoading, response } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const router = useRouter()


	const { register, handleSubmit, formState: { errors }, reset } = useForm({
		resolver: yupResolver(registerSchema),
	});


	const onSubmit = async (data) => {

		console.log(data)
		if (data?.firstName && data?.lastName && data?.email && data?.password) {
			dispatch(registerUser({ firstName: data.firstName, password: data.password, lastName: data.lastName, email: data.email }))
			router.push('/auth/thankyouregistration')
		}

		// toast.error('Συμπληρώστε τα απαραίτητα πεδία');
	}





	return (
		<LoginLayout>
			<Container className="box">
				<Grid container justifyContent="center" alignItems="center" direction="row" mb='30px'>
					<Grid item xs={8}>
						<h1 className="primaryHeader">EΓΓΡΑΦΗ ΧΡΗΣΤΗ</h1>
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

				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<Grid container justifyContent="center" alignItems="center" direction="row" columnSpacing={2}>
						<Grid item xs={6}>
							<InputStyled
								label="Όνομα"
								name="firstName"
								type="text"
								register={register}
								error={errors.firstName}
							/>
						</Grid>
						<Grid item xs={6}>
							<InputStyled
								label="Επώνυμο"
								name="lastName"
								type="text"
								register={register}
								error={errors.lastName}
							/>
						</Grid>
					</Grid>

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

					{/* Checkbox row */}
					<div className="flex-between">
						<CheckboxInput label={'Συμφωνώ με τους Όρους Χρήσης και την πολιτική απορρήτου'} />
					</div>
					{/* Login Button */}
					<Button size={'100%'} loading={isLoading} onClick={onSubmit}>Εγγραφή</Button>
				</form>


				<Divider variant="middle" color={"#fff"} sx={{ margin: '20px 0' }} />

				<div className="center-div">
					<Link className="linkBtn" href="/auth/signin">
						Έχετε ήδη λογαριασμό
					</Link>
				</div>
			</Container >
		</LoginLayout>

	)
}


const Container = styled.div`
 padding: 30px;
 width: 450px;
  @media (max-width: 499px) {
    width: 90%;
  } 
  .flex-between {
	display: flex;	
	align-items: center;
	height: 60px;
	font-size: 14px;
  }

  .linkBtn {
        font-size: 14px;
    }

	.center-div {
        display: flex;
        align-items: center;
        justify-content: center;
		font-size: 14px;
    }
`
export default RegisterPage;