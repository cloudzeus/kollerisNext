
import React, { useState } from "react";
import { Password } from 'primereact/password';
import { InputContainer } from "./PrimeInput";
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';



export function PrimeInputPass({ name, mb, mt, control, required, error, label, onChange }) {

    return (
        <InputContainer mb={mb} mt={mt} error={error}>
            <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} >
                                {label}
                            </label>
                            <Password 
                                toggleMask
                                id={field.name} 
                                {...field}
                                weakLabel="Αδύναμος"
                                mediumLabel="Μέτριος"
                                strongLabel="Ισχυρός"
                                value={field.value}
                                inputRef={field.ref} 
                                onChange={(e) => field.onChange(e.target.value)}
                                className={classNames({ 'p-invalid': fieldState.error })}
                                 />
                        </>
                    )}
                />

        </ InputContainer >
    )
}
