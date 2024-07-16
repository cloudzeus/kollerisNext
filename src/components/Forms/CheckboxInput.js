import React, { useState } from 'react';

const CheckboxInput = ({ label }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }

  return (
    <div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="checkbox-input"
        />
        <span className="checkbox-custom"> {label}</span>

      </label>
    </div >
  );
}



export default CheckboxInput;