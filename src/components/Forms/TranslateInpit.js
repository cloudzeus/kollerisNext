
import React from 'react';
import styled from 'styled-components';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import axios from 'axios';

const TranslateInput = ({ label, name, state, handleState, targetLang }) => {
    console.log('state')
    console.log(state)
    const onChange = (e) => {
        handleState(e.target.value)
    }

    const handleTranslate = async (value) => {
        let {data} = await axios.post('/api/deepL', { text: state, targetLang: targetLang })
        console.log(data)
        handleState(data.translatedText)
    }
    
    return (
        <InputContainer>
            <label  >
                {label}
            </label>
            <div>
                <InputTextarea
                    autoResize={true}
                    value={state}
                    onChange={onChange}
                />
                <Button className='mt-2 mb-2 btn w-10rem' label={'Translate'} onClick={handleTranslate} />
            </div>
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