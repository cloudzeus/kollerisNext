import React from 'react'
import styled from 'styled-components';


const StyledInput = ({ label }) => {
  return (
    <InputDiv>
      <input className="customInput" name="name" id="my-name" type='text' />
      <label className="customLabel" htmlFor="my-name">{label}</label>
    </InputDiv>
  )
}




export default StyledInput;



export const InputDiv = styled.div`
  width: 100%;
  position: relative;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  display: flex;
  font-family: 'Roboto', sans-serif;
  input {
    outline: none;
    width: 100%;
    display: flex;
    padding-top: 25px;
    padding-left: 15px;
    /* padding-bottom: 10px; */
    border: 1px solid #eaeaea;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 400;
    height: 50px;
    background-color: ${props => props.theme.palette.background};
      &:focus {
        outline: none;
        border: 2px solid ${props => props.theme.palette.primary.light};
      }
      
    }

  
  label {
    position: absolute;
    top: 12px;
    font-size: 11px;
    letter-spacing: 0.8px;
    color: ${props => props.theme.palette.grey.light};
    left: 15px;
    font-weight: 300;
  }

  input:focus + label {
  color: ${props => props.theme.palette.primary.main};
  }

`


