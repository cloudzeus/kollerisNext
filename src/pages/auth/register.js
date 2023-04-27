import Reac, { useState } from 'react'
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

const registerPage = () => {
	const [showPass, setShowPass] = useState(false);
	const dispatch = useDispatch();
	const handleShowPass = () => setShowPass((show) => !show);
    const [values, setValues] = useState({
        firstName: '',
		lastName: '',
        password: '',
        email: ''

    })

    const handleChange = (e) => {
        const name = e.target.name;
        console.log(name)
        const value = e.target.value;
        console.log(value)
        setValues({ ...values, [name]: value });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ firstName: values.firstName, password: values.password, lastName: values.lastName, email: values.email }))
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
						<InputDiv mt={10}>
							<input placeholder='john' name="firstName" id="firstName" type='text' onChange={handleChange} />
							<label className="" htmlFor="lastName">Όνομα</label>
						</InputDiv>
					</Grid>
					<Grid item xs={6}>
						<InputDiv  mt={10}>
							<input placeholder='doe' name="lastName" id="lastName" type='text' onChange={handleChange}/>
							<label htmlFor="lastName">Επώνυμο</label>
						</InputDiv>
					</Grid>
				</Grid>
				<InputDiv  mt={10}>
					<input placeholder='example@gmail.com' name="email" id="email" type='email' onChange={handleChange} />
					<label htmlFor="email">Email/Username</label>
				</InputDiv>
				<InputDiv mt={20}>
					<input  placeholder='******' name="password" id="password" type={showPass ? 'text' : 'password'} onChange={handleChange}/>
					<label  htmlFor="password">Password</label>
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
				<Btn onClick={onSubmit}>Σύνδεση</Btn>
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