import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import { IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Το email είναι υποχρεωτικό'),
    password: yup.string().min(8).max(32).required(),
    firstName: yup.string().required('Το όνομα είναι υποχρεωτικό'),
});

const Form = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log({ data });
        reset();
    };

    const [showPass, setShowPass] = React.useState(false);
    return (
        <Wrapper>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Name"
                    name="firstName"
                    type="text"
                    register={register}
                    error={errors.firstName}
                />
                <Input
                    label="email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                />
                {/* <InputPass
                    label="Κωδικός"
                    name="password"
                    register={register}
                    error={errors.email}
                /> */}
                <button type="submit">Sign in</button>
            </form>
        </Wrapper>
    );
};


export const InputPass = ({error, name , label, placeholder, }) => {
    const [showPass, setShowPass] = React.useState(false);
    return (
        <Container>
            <div  className="input" error={error}  >
                <label htmlFor={name}>{label}</label>
                <input name={name}  type={showPass ? 'text' : 'password'} placeholder={placeholder} />
                <IconButton className='showPassIcon' onClick={() => setShowPass(prev => !prev)}>
                    {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </div>
        </Container>
    )
}


export const Input = ({ name, type, label, placeholder, register, error, mt }) => {
    return (
        <Container error={error}>
            <div mt={mt} className="input" error={error}  >
                <label htmlFor={name}>{label}</label>
                <input name={name} type={type} placeholder={placeholder}  {...register(name)} />
            </div>
            {error && <span className="error-text">! {error.message}</span>}
        </Container>
    )
}


const errorColor = '#ff0033'

const Wrapper = styled.div`
    padding: 10px;

`

export const Container = styled.div`
  min-height: 65px;
 
  /* background-color: lightblue; */
  margin-bottom: 2px;
  .input {
    display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  font-weight: 600;
  margin-bottom: 2px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  background-color: ${props => props.theme.palette.background};
  /* border: 1px solid #eaeaea ; */
  border-radius: 5px;
  padding: 10px;
  border: 2px solid ${props => props.error ? errorColor : ' transparent'};
  }

  //change the border color when the input is focused
  & .input:focus-within{
    border-color:${props => props.error ? errorColor : props.theme.palette.primary.main};
  }
  //change the label when the input is focused
  & .input:focus-within label{
    color: ${props => props.error ? errorColor : props.theme.palette.primary.main};
  }
  
  & .focusDiv label:valid {
    border-color: pink;
  }
  
  
  label {
      font-size: 10px;
      letter-spacing: 0.9px;
      font-weight: 600;
      margin-bottom: 1px;
        color: ${props => props.error ? errorColor : props.theme.palette.text.light};

  }
  input {
    outline: none;
    width: 100%;
    display: flex;
    border-style: none;
    font-size: 14px;
    letter-spacing: 0.3px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    margin-top: 2px;
    height: 100%;
    background-color: ${props => props.theme.palette.background};

    }
 
  .showPassIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

  }
  
  .error-text {
    color: red;
    margin-left: 5px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  

  
`

export default Form;