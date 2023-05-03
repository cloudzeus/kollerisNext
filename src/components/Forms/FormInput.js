import React, {useState} from 'react'
import styled from 'styled-components';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
export const Input = ({ id, type, value, onChange, label, placeholder }) => {

  return (
    <InputDiv mt={10}
      className="focusDiv"
      >
      <label htmlFor={id}>{label}</label>
      <input name={id} id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </InputDiv>
  )
}
export const InputPassword = ({ id, value, onChange, label, placeholder, }) => {
  const [showPass, setShowPass] = React.useState(false);
  return (
    <InputDiv mt={10} className="focusDiv" >
      <label htmlFor={id}>{label}</label>
      <input name={id} id={id} type={showPass ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} />
      <IconButton className='showPassIcon' onClick={() => setShowPass(prev => !prev)}>
        {showPass ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputDiv>
  )
}




export const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  background-color: ${props => props.theme.palette.background};
  /* border: 1px solid #eaeaea ; */
  border-radius: 5px;
  padding: 10px;
  border: 2px solid transparent;
  

  &.focusDiv:focus-within{
    border-color: ${props => props.theme.palette.primary.main };
  }
  &.focusDiv:focus-within label{
    color: ${props => props.theme.palette.primary.main };
  }

  input:focus + label {
  color: ${props => props.theme.palette.primary.main};
  font-size: 30px;
  }

  label {
      font-size: 10px;
      letter-spacing: 0.9px;
      color: ${props => props.theme.palette.grey.light};
      font-weight: 400;
      margin-bottom: 1px;
    

  }
  input {
    outline: none;
    width: 100%;
    display: flex;
    border-style: none;
    font-size: 14px;
    letter-spacing: 0.3px;
    font-weight: 600;
    color: #373737;
    background-color: ${props => props.theme.palette.background};
    /* margin-top: 1px; */
    height: 100%;
    }
  

  .showPassIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

  }
  


 
  
   

  
`


