'use client';
import React, { useRef, useEffect } from 'react'
//Yup and useForm
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
//Rest imports:

import { Subheader } from '@/components/Forms/formStyles'
import Link from 'next/link';
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux';
import CheckboxInput from '@/components/Forms/CheckboxInput';
import LoginLayout from '@/layouts/Auth/loginLayout';
import { registerUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Input from "@/components/Forms/PrimeInput";
import { PrimeInputPass } from "@/components/Forms/PrimeInputPassword";
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { signIn } from "next-auth/react"
import { Toast } from 'primereact/toast';

const registerSchema = yup.object().shape({
	firstName: yup.string().required('Συμπληρώστε το όνομα'),
	lastName: yup.string().required('Συμπληρώστε το επώνυμο'),
	lastName: yup.string().required('Συμπληρώστε το επώνυμο'),
	email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),

});




const RegisterPage = () => {
	const { isLoading, response, user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const router = useRouter()
	const [loading, setLoading] = React.useState(false);
	const toast = useRef(null);
	const { handleSubmit, formState: { errors }, control } = useForm({
		resolver: yupResolver(registerSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			password: '',
			email: '',

		}
	});


	// useEffect(() => {
	// 	if(response.success == null) return;
	// 	if (!response.success) {
	// 		showError(response.error)
	// 		return;
	// 	}
	// 	showSuccess(response.user.firstName)
	// }, [response, router])


	const onSubmit = async (data) => {
		setLoading(true)
		if (data?.firstName && data?.lastName && data?.email && data?.password) {
			dispatch(registerUser({ firstName: data.firstName, password: data.password, lastName: data.lastName, email: data.email }))
			router.push('/auth/thankyouregistration')

		}
	}



	const showSuccess = (name) => {
		toast.current.show({ severity: 'success', summary: 'Success', detail: `Επιτυχής εγγραφή χρήστη ${name}`, life: 4000 });
	}
	const showError = (error) => {
		toast.current.show({ severity: 'error', summary: 'Error', detail: error,  life: 5000 });
	}


	return (
		<LoginLayout>
			<Toast ref={toast} />
			<Container className="box">
				<div className="grid mb-4 " >
					<div className="col-8">
						<h2>EΓΓΡΑΦΗ ΧΡΗΣΤΗ!</h2>
						<Subheader>Συμπληρώστε τη φόρμα εγγραφής</Subheader>
					</div>
					
				</div>

				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<div className='grid'>
						<div className='col-12'>
							<Input
								label={'Όνομα'}
								name={'firstName'}
								mb={'10px'}
								required
								control={control}
								error={errors.firstName}
							/>
						</div>
						<div className='col-12'>
							<Input
								label={'Επώνυμο'}
								name={'lastName'}
								mb={'10px'}
								required
								control={control}
								error={errors.lastName}
							/>
						</div>

					</div>
					<Input
						label={'email'}
						name={'email'}
						type="email"
						mb={'10px'}
						required
						control={control}
						error={errors.email}
					/>
					<PrimeInputPass
						label={'password'}
						name={'password'}
						mb={'10px'}
						required
						control={control}
						error={errors.password}
					/>

					{/* Checkbox row */}
					<div className="flex-between">
						<CheckboxInput label={'Συμφωνώ με τους Όρους Χρήσης και την πολιτική απορρήτου'} />
					</div>
					{/* Login Button */}
					<Button type="submit" onClick={onSubmit} label="Εγγραφή" loading={isLoading} style={{ width: '100%' }} />
				</form>

				<Divider className="my-4" />
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