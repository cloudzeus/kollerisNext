
import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import styled from 'styled-components';


const Input = ({label, value, required, onChange, name, error, mb, mt}) => {

    
    return (
    < InputContainer mb={mb} mt={mt}>
        <label htmlFor={name} >
            {label}
        </label>
        <InputText 
            
            id={name} 
            name={name} 
            value={value} 
            onChange={onChange} 
            required={required} 
            autoFocus 
            />
        {/* {error && (
          <span>{error}</span>
        )} */}
        {error && error.map((err, index) => (
            <span key={index}>{err}</span>
        ))}
    </ InputContainer >
    )
}


const InputContainer = styled.div`
    margin-bottom: ${props => props.mb ? props.mb : '10px'};
    margin-top: ${props => props.mt ? props.mt : '0px'};
    
    input {
        margin-top: 5px;
    }
`

export default Input;