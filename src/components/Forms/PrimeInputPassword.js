import React from "react";
import { Password } from "primereact/password";
import { Controller } from "react-hook-form";
import { classNames } from "primereact/utils";

export function PrimeInputPass({ name, control, error, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="w-full">
          <label className={`custom_label ${error ? "text-red-600" : null}`} htmlFor={field.name}>
            {label}
          </label>
          <Password
            feedback={false}
            toggleMask
            id={field.name}
            value={field.value}
            inputRef={field.ref}
            style={{ width: "100%" }}
            onChange={(e) => field.onChange(e.target.value)}
            className={`custom_input ${classNames({
              "p-invalid": fieldState.error,
            })}`}
          />
          <div className="mt-2">
            {error && <span className="text-red-600">{error.message}</span>}
          </div>
        </div>
      )}
    />
  );
}
