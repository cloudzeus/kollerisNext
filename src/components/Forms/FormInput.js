import React from 'react'
import styled from 'styled-components';

export const Input = ({ id, type, value, onChange, label }) => {
  return (
      <InputDiv mt={10}>
          <label htmlFor={id}>{label}</label>
          <input name={id} id={id} type={type} value={value} onChange={onChange} />
      </InputDiv>
  )
}




export const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* position: relative; */
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  background-color: ${props => props.theme.palette.background};
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 10px;
 
  &:focus {
      outline: none;
      border: 2px solid ${props => props.theme.palette.primary.main};
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
    background-color: transparent;
    margin-top: 1px;
    }
  

  .showPassIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    

  }
  


  input:focus + label {
  color: ${props => props.theme.palette.primary.main};
  }
  
   

  
`


