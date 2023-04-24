import React from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@mui/material';


const Spinner = () => {
  return (
    <Container>
      <CircularProgress />
    </Container>
  )
}

const Container = styled.div`

  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

export default Spinner