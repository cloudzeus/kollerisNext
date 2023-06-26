
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import styled from 'styled-components';

const Input = ({label, submitted, value, required, onChange, name}) => {
    
    return (
    < InputContainer >
        <label htmlFor={name} >
            {label}
        </label>
        <InputText id={name} name={name} value={value} onChange={onChange} required={required} autoFocus className={classNames({ 'p-invalid': submitted && !value })} />
        {submitted && !value && <small className="p-error">Name is required.</small>}
    </ InputContainer >
    )
}


const InputContainer = styled.div`
 margin-bottom: 10px;
    
    input {
        margin-top: 5px;
    }
`

export default Input;