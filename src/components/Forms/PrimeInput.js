
import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import styled from 'styled-components';


const Input = ({label, required, name, error, mb, mt, register}) => {

    return (
    < InputContainer mb={mb} mt={mt} error={error}>
        <label htmlFor={name} >
            {label}
        </label>
        <InputText 
            id={name} 
            name={name} 
            // value={value} 
            {...register(name)}
            // onChange={onChange} 
            required={required} 
            autoFocus 
            className={error ? 'p-invalid' : null  }
            error={error}
            />

             <div className="error-div">
			{error && <span className="error-text">{error.message}</span>}
			</div>
    </ InputContainer >
    )
}


const InputContainer = styled.div`
    margin-bottom: ${props => props.mb ? props.mb : '10px'};
    margin-top: ${props => props.mt ? props.mt : '0px'};
    
    input {
        margin-top: 7px;
    }
   
    label {
        color: ${props => props.error ? 'red' : null};
    }
    .error-div {
        color: red;
        margin-top: 4px;
        font-size: 14px;
    }
`

export default Input;