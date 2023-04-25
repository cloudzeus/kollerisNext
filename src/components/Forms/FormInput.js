import React from 'react'

const CustomTextField = styled(TextField)`
  & .MuiInputBase-input {
    color: #333;
  }

  & .MuiInputLabel-root {
    color: #555;
  }

  & .MuiOutlinedInput-root {
    border-radius: 4px;
    border-color: #ccc;
  }

  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #aaa;
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: #ccc;
  }

  & .MuiFormHelperText-root {
    color: #aaa;
  }
`;

export default CustomTextField;