import React,  {useState} from 'react'
import LoginLayout from '@/layouts/Auth/loginLayout'
import styled, { useTheme } from 'styled-components'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputStyled } from '@/components/Forms/FormInput'
import Button from '@/components/Buttons/Button'
import axios from 'axios'

const ResetPassword = () => {
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),
});
const { register, handleSubmit, formState: { errors }, reset } = useForm({
  resolver: yupResolver(schema),
});

  const onSubmit = async (data) => {
    setLoading(true)
    const resp = await axios.post('/api/user/resetPassword', {email: data.email, action: 'sendResetEmail'})
    if(resp.data)
      setSubmit(prev => !prev)
      setLoading(false)
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
                <InputStyled
                    label="email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    placeholder={'example@gmail.com'}
                />
                <Button size={'100%'} type="submit" loading={loading}>Αποστολή συνδέσμου στο Email</Button>
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
        <CheckCircleOutlineRoundedIcon sx={{ fontSize: '25px', color: `${theme.palette.success.main}` }} />
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
  margin-bottom: 30px;
  
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