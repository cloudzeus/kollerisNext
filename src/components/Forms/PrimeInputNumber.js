
import React from 'react';
import styled from 'styled-components';
import { Controller} from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';



const PrimeInputNumber = ({ label, name, mb, mt, control, required, error, type, disabled }) => {
    return (

        < InputContainer mb={mb} mt={mt} error={error}>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <>
                       
                        <label htmlFor={name} className={classNames({ 'p-invalid': fieldState.error })} >
                        {label } {required && <span className="required">*</span>}
                        </label>
                        <span >
                            <InputNumber
                                type={type}
                                id={field.name}
                                value={field.value}
                                disabled={disabled}
                                className={classNames({ 'p-invalid': fieldState.error })}
                                onValueChange={(e) => field.onChange(e)} />
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
    width: 100%;
    
    * input {
    width: 100%;
    }
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


export default PrimeInputNumber;