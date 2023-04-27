import React from 'react'
import LoginLayout from '@/layouts/Auth/loginLayout'
import LoginForm from "@/components/Forms/LoginForm"
import styled from 'styled-components'
import CenterBox from '@/components/Wrappers/CenterBox'
import ShadowBox from '@/components/Wrappers/ShadowBox'


import { InputBase } from '@mui/material'



const Login = () => {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  )
}




export default Login