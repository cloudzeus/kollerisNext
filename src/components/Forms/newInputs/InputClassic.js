import React, { useState } from 'react'
import styled from 'styled-components';




export const InputVar1 = ({
	name,
	type,
	label,
	placeholder,
	register,
	error,
	mt,
	defaultValue,
	disabled }) => {
	const [focus, setFocus] = useState(false)
	console.log(focus)
	const handleFocus = () => {
		setFocus(prev => !prev)
	}
	return (
		
		<InputContainer error={error} disabled={disabled} isFocus={focus}>
				<label
					htmlFor={name}>
					{label}
				</label>
				<input
					id={name}
					name={name}
					type={type}
					placeholder={placeholder}
					defaultValue={defaultValue}
					{...register(name)}
					disabled={disabled}
					onBlur={handleFocus}
					onFocus={handleFocus}
				/>
			{error && <span className="error-text">{error.message}</span>}
		</InputContainer>
	)
}



export const errorColor = '#ff0033'
export const disabledColor = '#949695'
const mainColor = '#c9c9c8'
const borderColor = '#d1d1d1'

export const InputContainer = styled.div`
display: flex;
flex-direction: column;
margin-bottom: 20px;
label {
    font-size: 14px;
	font-weight: ${props => props.isFocus ? '500' : '400'};
	letter-spacing: 0.3px;
    margin-bottom: 5px;
	color: ${props => props.isFocus ? props.theme.palette.primary.main : '#818281'};
}

input {
    height: 45px;
	padding: 0 10px;
    border-radius: 4px;
    border: 2px solid ${props => props.theme.palette.border};
	outline: none;
	/* background-color: ${props =>props.isFocus ?  props.theme.palette.background : 'white'}; */
	/* background-color: #F7F7F7; */
    /* box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; */
}
 input:focus{
  border-color:${props => props.error ? errorColor : props.theme.palette.primary.main};
  border-width: 2px;
}
//change the label when the input is focused
input:focus + label {
  color: red;
}
.showPassIcon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

}

.error-text {
  color: red;
  margin-left: 5px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}


`