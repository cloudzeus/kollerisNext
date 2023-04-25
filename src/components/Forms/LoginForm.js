import React, { useState } from 'react'
import { Box } from '@mui/material'
import styled from 'styled-components'
import ShadowBox from '../Wrappers/ShadowBox'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import theme from '@/theme/theme';
import {FormControlLabel, Checkbox, Button} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import { NoEncryption } from '@mui/icons-material';



console.log(theme)
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();
  const [values, setValues] = useState({
    username: 'kminchelle',
    password: '0lelplR',
  })
  const [register, setRegister] = useState(false)

  const {isAuthenticated} = useSelector(state => state.user)
  console.log('login is Authenticated: ', isAuthenticated)
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(loginUser({email: values.email, password: values.password}))
    dispatch(loginUser({ username: values.username, password: values.password }))
    if(isAuthenticated && !register) {
      router.push('/dashboard')
    }
  }

  const handleRegister = () => {
    setRegister((prev) => !prev.register)
  }

 
  return (
   <Container>
     <LoginBox >
      {/* <h1>efsefse</h1> */}
      <h3>{register ? 'Register' : 'Login'}</h3>

      <FormControl fullWidth > 
        {register &&  <TextField  sx={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;'}} color={'primary'} size='Small' label="Όνομα"   margin="normal" onChange={handleChange}/>}
        <TextField  sx={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;'}} color={'primary'}  label="Email"   margin="normal" onChange={handleChange}/>
        <TextField sx={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;'}} color={'primary'}   id="outlined-basic" label="Κωδικός"  margin="normal" onChange={handleChange} />
        {/* <CustomTextField id="outlined-basic" label="Κωδικός"/> */}
        <FormControlLabel  control={<Checkbox />} label="Save Password" />
        <Button variant='contained' color='primary' size='large' onClick={handleSubmit}>{register ? 'Εγγραφή' : 'Σύνδεση'}</Button>
      </FormControl> 
    </LoginBox >
    <BottomDiv>
      {!register && <Button variant="text">Forgot Password</Button>}
      <Button variant="text" onClick={handleRegister}>{!register ? 'Δημιουργια λογαριασμου' : 'Συνδεση σε λογαριασμό'}</Button>
    </BottomDiv>
   </Container>
  )
}





const LoginBox = styled.div`
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background-color: ${({theme}) => theme.palette.background};
 
`
const Container = styled.div`
  width: 500px;
  
  @media (max-width: 499px) {
      widtd: auto;
  } 
`
const BottomDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`


export default LoginForm