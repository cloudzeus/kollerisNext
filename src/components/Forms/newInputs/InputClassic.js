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
	return (
		<InputContainer error={error} disabled={disabled}>
				<label
					htmlFor={name}>
					{label}
				</label>
				<input
					name={name}
					type={type}
					placeholder={placeholder}
					defaultValue={defaultValue}
					{...register(name)}
					disabled={disabled}
				/>
			{error && <span className="error-text">{error.message}</span>}
		</InputContainer>
	)
}


export const errorColor = '#ff0033'
export const disabledColor = '#949695'
const mainColor = '#c9c9c8'
const borderColor = '#e8e8e8'
export const InputContainer = styled.div`
display: flex;
flex-direction: column;
margin-bottom: 20px;
label {
    font-size: 12px;
    margin-bottom: 3px;
}

input {
    height: 40px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    /* box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; */
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