

import React, { useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputContainer } from "./PrimeInput";
export default function PrimeSelect({control, values, label, name, placeholder, required}) {
    return (
        <InputContainer>
           <label htmlFor={name} >
                        {label } {required && <span className="required">*</span>}
                        </label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                optionLabel={name}
                                placeholder={placeholder}
                                options={values}
                                // defaultValue={values[0]}
                                focusInputRef={field.ref}
                                onChange={(e) => field.onChange(e.value)}
                             
                            />
                    )}
                />
        </InputContainer>
    )
}
        