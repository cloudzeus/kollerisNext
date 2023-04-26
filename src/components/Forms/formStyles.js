import styled from "styled-components"
import { IconButton } from "@mui/material"

const Container = styled.div`
  padding: 30px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  width: 450px;
  @media (max-width: 499px) {
      width: auto;
  } 
`


const TextBtn = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.palette.primary.main};
  &.black  {
    color : ${props => props.theme.palette.grey.main};
    font-weight: 300;
  }
 
`


//CheckBox:
const CheckBoxDiv = styled.div`
    label {
      display: flex;
      align-items: center;
      height: 50px;
    }
    span {
      margin-left: 10px;
      color: ${props => props.theme.palette.grey.main};
      font-weight: 300;
      font-size: 14px;
    }
`
export { TextBtn, CheckBoxDiv, Container }