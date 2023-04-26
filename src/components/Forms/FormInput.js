import React from 'react'
import styled from 'styled-components';
// import TextField from '@mui/material/TextField';
// const CustomTextField = styled(TextField)`
//   & .MuiInputBase-input {
//     color: #333;
//     padding:10px ;
//   }

//   & .MuiInputLabel-root {
//     color: #555;
//   }

//   & .MuiOutlinedInput-root {
//     /* border-radius: 4px;
//     height: 40px;
//     align-items: center;
//     justify-content: center; */
//     padding: 0;

//   }

//   & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
//     border-color: #aaa;
//   }

//   & .MuiOutlinedInput-notchedOutline {
//     border-color: #ccc;
//   }

//   & .MuiFormHelperText-root {
//     color: #aaa;
//   }
// `;

// export default CustomTextField;

const StyledInput = ({label}) => {
  return (
    <Div>
      <label className="customLabel" htmlFor="my-name">{label}</label>
      <input className="customInput" name="name" id="my-name" type="text" />
    </Div>
  )
}


export default StyledInput;

const Div = styled.div`
  width: 100%;
  position: relative;
  height: 40px;
  font-weight: 600;
  & .customInput {
    /* outline: none; */
    /* height: 45px; */
    width: 100%;
    display: block;
    /* padding: 10px; */
    padding-top: 30px;
    padding-left: 10px;
    padding-bottom: 10px;
    border: 1px solid grey;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    
  }
  & .customLabel {
    position: absolute;
    top: 5px;
    font-size: 13px;
    letter-spacing: 0.8px;
    color: grey;
    left: 10px;
  }



`


