import React from "react"
import { CircularProgress } from "@mui/material"
import styled from "styled-components";

const Button = ({children, onClick, loading, size, type, edit, mt, mb}) => {
  return (
    <Btn 
      mt={mt}
      size={size} 
      type={type} 
      onClick={onClick} 
      edit={edit} 
      mb={mb}
      disabled={loading}
      >
      {loading ? <CircularProgress  size={'20px'}/>  : <>{children}</>}
    </Btn>
  )
}







export const Btn = styled.button`
  width: ${props => props.size ? `${props.size}` : '140px'};
  margin-top: ${props => props.mt ?  `${props.mt}px` : '0'};
  margin-bottom: ${props => props.mb ? `${props.mb}px` : '0'};
  background-color: ${props => props.edit ? '#7cbef4' : props.theme.palette.primary.main};
  border-radius: 4px;
  outline: none;
  height: 40px;
  border-style: none;
  color: white;
  font-weight: 300;
  font-family: 'Roboto' , sans-serif;
  font-size: 13px;
  letter-spacing: 0.4px;
  transition: transform 0.3s, background-color 0.8s;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
    background-color: ${props => props.theme.palette.primary.light50};
  }
    
  &:disabled {
    background-color: #7cbef4;
  }
`


export const IconBtn = styled.button`
    border: none;
    padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: ${props => props.theme.palette.primary.light};
		border-radius: 5px;
		color: white;
		font-size: 12px;
		margin-right: 10px;
		cursor: pointer;
		transition: transform 0.3s, background-color 0.3s;
		box-shadow: rgba(0, 0, 0, 0.10) 0px 1px 2px;
		&:active {
			transform: scale(0.8);
			background-color: ${props => props.theme.palette.primary.light50};
			border-radius: 8px;
		}
`


export default Button;