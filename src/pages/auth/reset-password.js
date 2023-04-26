import React from 'react'
import { Container } from '@/components/Forms/formStyles'
import LoginLayout from '@/layouts/Auth/loginLayout'
import { InputDiv } from '@/components/Forms/FormInput'
import { Btn } from '@/components/Buttons/styles'
import styled, { useTheme } from 'styled-components'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
const ResetPassword = () => {
  const [submit, setSubmit] = React.useState(false)
  return (
    <LoginLayout>
      <Container>
        {!submit ? (
          <>
            <Header>
              Εισάγετε την διεύθυνση email σας και θα σας στείλουμε έναν σύνδεσμο για την επαναφορά του κωδικού πρόσβασης.
            </Header>
            <InputDiv mt={10}>
              <input className="customInput" placeholder='example@gmail.com' name="name" id="my-name" type='text' />
              <label className="customLabel" htmlFor="my-name">Διεύθυνση Email</label>
            </InputDiv>
            <Btn onClick={() => setSubmit(prev => !prev)}>Αποστολή συνδέσμου στο Email</Btn>
          </>
        ) : (
          <SuccessMessage />

        )}
      </Container>
    </LoginLayout>

  )
}

const SuccessMessage = () => {
  const theme = useTheme();
  return (
    <>
      <CheckCircleOutlineRoundedIcon sx={{ fontSize: '35px', color: `${theme.palette.primary.main}`, mb: '10px' }} />
      <h3 className='mb10'>
        Το email στάλθηκε
      </h3>
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

export default ResetPassword