"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";


export default function PrimeSelect({
  control,
  label,
  name,
  required,
  error,
  options,
  optionLabel,
  optionValue,
  placeholder,
  showClear = false
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <div>
              <label className={`custom_label ${error ? "text-red-600" : null}`}>
            {label}
            {required && <span className="ml-1 font-bold text-red-500">*</span>}
            </label>
            <Dropdown
              showClear={showClear}
              id={field.name}
              name={name}
              optionLabel={optionLabel}
              optionValue={optionValue}
              options={options}
              placeholder={placeholder}
              focusInputRef={field.ref}
              value={field.value}
              className={ `custom_dropdown ${error ? classNames({ "p-invalid": true }) : null}`}
              onChange={(e) => {
                field.onChange(e.value);
              }}
            />
            <div className="error-div">
              {error && <span className="error-text text-red-600">{error}</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
