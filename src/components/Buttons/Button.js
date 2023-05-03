import React from "react"
import { CircularProgress } from "@mui/material"
import { useSelector } from "react-redux"
import styled from "styled-components";

const Button = ({children, onClick}) => {
  const {isLoading} = useSelector(store => store.user)
  return (
    <Btn onClick={onClick}>
      {isLoading ? <CircularProgress color={'white'} size={'25px'}/>  : <>{children}</>}
    </Btn>
  )
}







export const Btn = styled.button`
  width: ${props => props.size ? `${props.size}px` : '140px'};
  margin-top: ${props => props.mt ? `${mt}px` : '0'};
  margin-top: ${props => props.bt ? `${mb}px` : '0'};
  background-color: ${props => props.theme.palette.primary.main};
  border-radius: 4px;
  outline: none;
  height: 40px;
  border-style: none;
  color: white;
  letter-spacing: 0.7px;
  transition: all 0.03s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  cursor: pointer;
  &:hover {

  }
  &:active {
    transform: scale(0.90);
  }
`



export default Button;