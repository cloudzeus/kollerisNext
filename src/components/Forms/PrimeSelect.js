

import React, { useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputContainer } from "./PrimeInput";
export default function PrimeSelect({control, values, label, name, required}) {
    return (
        <InputContainer>
           <label htmlFor={name} >
                        {label } {required && <span className="required">*</span>}
                        </label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => {
                        console.log(field.value)
                        return (
                            <Dropdown
                            id={field.name}
                            value={field.value}
                            optionLabel={name}
                            options={values}
                            focusInputRef={field.ref}
                            placeholder={field.value}
                            onChange={(e) => field.onChange(e.value)}
                        />
                        )
                    }}
                />
        </InputContainer>
    )
}
        