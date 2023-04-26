import React from 'react'
import styled from 'styled-components';


const StyledInput = ({label}) => {
  return (
    <Div>
      <input className="customInput" name="name" id="my-name" type="text" />
      <label className="customLabel" htmlFor="my-name">{label}</label>
     
    </Div>
  )
}


export default StyledInput;

const Div = styled.div`
  width: 100%;
  position: relative;
  height: 40px;
  font-weight: 600;
  input {
    outline: none;
    width: 100%;
    display: block;
    padding-top: 25px;
    padding-left: 15px;
    padding-bottom: 10px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
      &:focus {
        outline: none;
        border: 2px solid ${props => props.theme.palette.primary.main};
        box-shadow: 0 0 3px ${props => props.theme.palette.primary.main};
      }
      
    }
  
  label {
    position: absolute;
    top: 10px;
    font-size: 11px;
    letter-spacing: 0.8px;
    color: grey;
    left: 15px;
    font-weight: 600;


  }
  input:focus + label {
    color: ${props => props.theme.palette.primary.main};
  }

`


