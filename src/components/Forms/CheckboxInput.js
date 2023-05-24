import React, { useState } from 'react';
import styled from 'styled-components';

const CheckboxInput = ({ label }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }

  return (
    <CheckBoxDiv>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="checkbox-input"
        />
        <span className="checkbox-custom"> {label}</span>

      </label>
    </CheckBoxDiv >
  );
}

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





export default CheckboxInput;