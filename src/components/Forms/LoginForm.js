import React, { useState } from 'react'
import { Box, Grid, Item, InputBase } from '@mui/material'
import styled from 'styled-components'
import ShadowBox from '../Wrappers/ShadowBox'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import theme from '@/theme/theme';
import { FormControlLabel, Checkbox, Button, InputLabel, FormLabel, InputAdornment, FormHelperText,    OutlinedInput, FilledInput, Input, IconButton} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/userSlice';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


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
        <Grid container  justifyContent="center" alignItems="center" direction="row" mb='20px'>
          <Grid item xs={8}>
            <StyledHeader>Καλώς ήρθατε!</StyledHeader>
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

        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth sx={{marginBottom: '20px'}}/>

        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormControlLabel control={<Checkbox />} label="Save Password" />
          <Button variant='contained' color='primary' size='large' onClick={handleSubmit}>{'Σuνδεση'}</Button>

        </FormControl>
      </LoginBox >
      {/* <BottomDiv>
        {!register && <Button variant="text">Forgot Password</Button>}
        <Button variant="text" onClick={handleRegister}>{!register ? 'Δημιουργια λογαριασμου' : 'Συνδεση σε λογαριασμό'}</Button>
      </BottomDiv> */}
    </Container>
  )
}




// {register && <TextField sx={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;' }} color={'primary'} size='Small' label="Όνομα" margin="normal" onChange={handleChange} />}
// <TextField sx={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;' }} color={'primary'} label="Email" margin="normal" onChange={handleChange} />
// <TextField sx={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;' }} color={'primary'} id="outlined-basic" label="Κωδικός" margin="normal" onChange={handleChange} />
// {/* <CustomTextField id="outlined-basic" label="Κωδικός"/> */}
// <FormControlLabel control={<Checkbox />} label="Save Password" />
// <Button variant='contained' color='primary' size='large' onClick={handleSubmit}>{register ? 'Εγγραφή' : 'Σύνδεση'}</Button>


const StyledHeader = styled.h1`
  font-size: 1.5rem;
  color: ${theme.palette.primary.main};
  font-weight: 900;
  font-family: 'Roboto Condensed', 'Roboto', sans-serif;
`

const Subheader = styled.h2`
  font-size: 0.7rem;
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