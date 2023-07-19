import React,  {useState} from 'react'
import LoginLayout from '@/layouts/Auth/loginLayout'
import styled, { useTheme } from 'styled-components'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios'
import {toast} from 'react-toastify'
import { Button } from 'primereact/button';
import Input from '@/components/Forms/PrimeInput';

const ResetPassword = () => {
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),
});
const {  handleSubmit, formState: { errors }, reset, control } = useForm({
  resolver: yupResolver(schema),
});

  const onSubmit = async (data) => {
    setLoading(true)
    const resp = await axios.post('/api/user/resetPassword', {email: data.email, action: 'sendResetEmail'})
    console.log(resp)
    
    if(resp.data.success === true) {
      setLoading(false)
      setSubmit(prev => !prev)
      setLoading(false)
    }
    if(resp.data.success === false) {
      setLoading(false)
      console.log('error')
      toast.error(resp.data.error)
    }
    reset();
  }
  return (
    <LoginLayout>
      <Container  className="box">
      {!submit ? (
          <>
            <Header>
              Εισάγετε την διεύθυνση email σας και θα σας στείλουμε έναν σύνδεσμο για την επαναφορά του κωδικού πρόσβασης.
            </Header>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                   <Input
                    label={'email'}
                    name={'email'}
                    mb={'10px'}
                    required
                    control={control}
                    error={errors.email}
                    placeholder={'example@gmail.com'}
                />
                  <Button type="submit" label="Αποστολή συνδέσμου στο Email" loading={loading} style={{width: '100%'}} />
            </form>
            
          </>
        ) : (
          <SuccessMessage />

        )}
      </Container >
      
    </LoginLayout>

  )
}

const SuccessMessage = () => {
  const theme = useTheme();
  return (
    <>
      <div className="success">
      <i className="pi pi-check" style={{ color: 'slateblue' }}></i>
        <h3>Το email στάλθηκε</h3>
      </div>
      <p>Ελέγξτε το email σας και πατήστε τον σύνδεσμο αλλαγής κωδικού</p>
    </>
  )
}

const Header = styled.h1`
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 10px;
  
`

const Container = styled.div`
  max-width: 600px;

  h3 {
    margin-left: 10px;
  }
  .success {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

`


export default ResetPassword