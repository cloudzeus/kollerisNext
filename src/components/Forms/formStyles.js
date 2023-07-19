import styled from "styled-components"

const Container = styled.div`
  padding: 30px;
  width: 450px;
  @media (max-width: 499px) {
    width: 90%;
  } 

  .linkBtn {
        font-size: 14px;
    }

    .center-div {
        display: flex;
        align-items: center;
        justify-content: center;
    }

`





//CheckBox:
const CheckBoxDiv = styled.div`
    label {
      display: flex;
      align-items: center;
      height: 40px;
    }
    span {
      margin-left: 10px;
      color: ${props => props.theme.palette.grey.main};
      font-weight: 300;
      font-size: 14px;
    }
`


const StyledHeader = styled.h1`
  font-size: 1.2rem;
  color: ${props => props.theme.palette.primary.main};
  font-weight: 900;
`

const Subheader = styled.h2`
  font-size: 0.9rem;
  color: ${props => props.theme.palette.text.light};
  font-weight: 300;
`


export {  CheckBoxDiv, Container, StyledHeader, Subheader  }