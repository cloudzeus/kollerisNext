import React from 'react'
import styled from 'styled-components';



export const InputDiv = styled.div`
  width: 100%;
  position: relative;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  display: flex;
  font-family: 'Roboto', sans-serif;
  input {
    position: relative;
    outline: none;
    width: 100%;
    display: flex;
    padding-top: 13px;
    padding-left: 15px;
    /* padding-bottom: 5px; */
    border: 1px solid #eaeaea;
    border-radius: 5px;
    font-size: 14px;
    letter-spacing: 0.3px;
    height: 50px;
    font-weight: 600;
    color: #373737;
    background-color: ${props => props.theme.palette.background};
    &:focus {
      outline: none;
      border: 2px solid ${props => props.theme.palette.primary.main};
      }
     
    
      
    }

  

  .showPassIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    

  }
  
  label {
    position: absolute;
    top: 10px;
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


