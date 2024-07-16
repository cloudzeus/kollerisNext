import React from "react";
import { InputNumber } from "primereact/inputnumber";

const PrimeInputNumber = ({
  label,
  value,
  id,
  handleValue,
  name,
  required,
  error,
  type,
  disabled,
  mode = "decimal",
  prefix,
  maxFractionDigits = 0,
  minFractionDigits = 0,

}) => {
  return (
        <div className="w-full">
          <label
            htmlFor={name}
            className={`custom_label ${error && "text-red-600"}`}
          >
            {label} {required && <span className="required text-red-500">*</span>}
          </label>
            <InputNumber
              name={name}
              maxFractionDigits={maxFractionDigits}
              minFractionDigits={minFractionDigits}
                mode={mode}
                prefix={prefix}
                type={type}
              
              id={id}
              value={value}
              disabled={disabled}
              className={`custom_number_input ${error && "border-red-600"}`}
              onValueChange={handleValue}
            />
          <div className="error-div">
            {error && <span className="text-red-600">{error.message}</span>}
          </div>
        </div>
  );
};

export default PrimeInputNumber;
