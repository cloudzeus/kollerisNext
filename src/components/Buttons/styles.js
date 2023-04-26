import styled from "styled-components";




export const Btn = styled.button`
  width: 100%;
  background-color: ${props => props.theme.palette.primary.main};
  height: 45px;
  border-radius: 4px;
  outline: none;
  border-style: none;
  color: white;
  letter-spacing: 0.9px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
`
