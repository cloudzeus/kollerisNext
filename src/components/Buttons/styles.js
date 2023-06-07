import styled from "styled-components";




export const Btn = styled.button`
  width: 100%;
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
  &:active {
    transform: scale(0.90);
  }
`
