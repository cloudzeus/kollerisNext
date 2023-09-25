
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useForm } from "react-hook-form";
import axios from 'axios';

import { useFormContext } from 'react-hook-form';
// ... (rest of your imports)

const TranslateInput = ({ label, name, mb, mt, control, required, error, type, disabled, targetLang }) => {
    const [localValue, setLocalValue] = useState('');
    const { setValue } = useForm();

    const handleTranslate = async (value) => {
        console.log('Translating:', value);
        // Assuming translateAPI is a function to translate the text.
        let res = await axios.post('/api/deepL', { text: value, targetLang: targetLang })
        setLocalValue(res.data.translatedText);
        setValue(name, res.data.translatedText);  // Update the field value using the setValue function
    }

    return (
        <InputContainer mb={mb} mt={mt} error={error}>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={name} className={classNames({ 'p-invalid': fieldState.error })} >
                                {label} {required && <span className="required">*</span>}
                        </label>
                        <div className='grid'>
                                <InputText
                                    type={type}
                                    id={field.name}
                                    value={localValue || field.value}  // Use localValue if available, otherwise use field.value
                                    disabled={disabled}
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setLocalValue(e.target.value);
                                    }}  // Update both local state and field value on change
                                />
                                 <Button className='mt-2 mb-2 btn' label={'Translate'} onClick={() => { handleTranslate(localValue || field.value) }} />
                        </div>
                        {/* ... (rest of your markup) */}
                       
                    </>
                )}
            />
        </InputContainer>
    );
};




export const InputContainer = styled.div`
 
    width: 100%;
    input {
        height: 40px;
    }
    
    & label {
        color: ${props => props.error ? 'red' : null};
        font-size: 14px;
        display: block;
        margin-bottom: 5px;
        margin-left: 0;
    }
    .grid {
        display: grid;
        grid-template-columns: 70% 25%;
        height: 40px;
        justify-content: center;
        align-items: center;
        grid-gap: 10px;
        margin-bottom: 20px;
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
    .btn {
        height: 40px;
    }
`   

export default TranslateInput;