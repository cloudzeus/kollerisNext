
import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';


const Input = ({ label, name, mb, mt, control, required, error, type }) => {
    return (

        < InputContainer mb={mb} mt={mt} error={error}>
            <Controller
                name={name}
                control={control}
                // rules={rules}
                render={({ field, fieldState }) => (
                    <>
                       
                        <label htmlFor={name} className={classNames({ 'p-invalid': fieldState.error })} >
                        {label } {required && <span className="required">*</span>}
                        </label>
                        <span >
                            <InputText
                                type={type}
                                id={field.name}
                                value={field.value}
                                className={classNames({ 'p-invalid': fieldState.error })}
                                onChange={(e) => field.onChange(e.target.value)} />
                        </span>
                        <div className="error-div">
                            {error && <span className="error-text">{error.message}</span>}
                        </div>
                    </>
                )}
            />

        </ InputContainer >
    )
}



export const TextAreaInput = ({ label, name, mb, mt, control, error, autoResize, rows, cols, disabled, required }) => {
    return (

        < InputContainer mb={mb} mt={mt} error={error}>
            <Controller
                name={name}
                control={control}
                // rules={rules}
                render={({ field, fieldState }) => (
                    <>
                       
                        <label htmlFor={name} className={classNames({ 'p-invalid': fieldState.error })} >
                            {label } {required && <span className="required">*</span>}
                        </label>
                        <span >
                            <InputTextarea
                                rows={rows}
                                cols={cols}
                                disabled={disabled}
                                autoResize={autoResize}
                                id={field.name}
                                value={field.value}
                                className={classNames({ 'p-invalid': fieldState.error })}
                                onChange={(e) => field.onChange(e.target.value)} />
                        </span>
                        <div className="error-div">
                            {error && <span className="error-text">{error.message}</span>}
                        </div>
                    </>
                )}
            />

        </ InputContainer >
    )
}


export const InputContainer = styled.div`
    margin-bottom: ${props => props.mb ? props.mb : '10px'};
    margin-top: ${props => props.mt ? props.mt : '0px'};
    
    
    
    & label {
        color: ${props => props.error ? 'red' : null};
        font-size: 14px;
        display: block;
        margin-bottom: 5px;
        letter-spacing: 0.2px;
    }
    
    .error-div {
        color: red;
        margin-top: 4px;
        font-size: 14px;
    }
    .required {
        color: red;
        font-weight: bold;
    }
`

export default Input;