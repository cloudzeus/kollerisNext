

import React, { useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputContainer } from "./PrimeInput";
export default function PrimeSelect({ 
        control, 
        label, 
        name, 
        required, 
        error, 
        options, 
        optionLabel, 
        optionValue,
        placeholder
        }) {

    return (
        <InputContainer>
           
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => {
               
                    return (
                       <>
                        <label htmlFor={name} className={classNames({ 'p-invalid': fieldState.error })} >
                        {label } {required && <span className="required">*</span>}
                        </label>
                            <Dropdown
                                id={field.name}
                                optionLabel={optionLabel}
                                optionValue={optionValue}
                                options={options}
                                placeholder={placeholder}
                                focusInputRef={field.ref}
                                value={field.value}
                                className={error ? classNames({ 'p-invalid': true }) : null}
                                onChange={(e) => {
                                    field.onChange(e.value)
                                }}
                            />
                       </>
                    )
                }}
            />
            <div className="error-div">
                {error && <span className="error-text">{error.message}</span>}
            </div>
        </InputContainer>
    )
}
