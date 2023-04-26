import React, { useState } from 'react';
import { CheckBoxDiv } from './styles';



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






export default CheckboxInput;