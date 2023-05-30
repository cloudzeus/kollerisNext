import React, { useState } from 'react'
import styled from 'styled-components';




export const InputWhite = ({
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
			<div mt={mt} className="input" error={error}  >
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
			</div>
			{error && <span className="error-text">{error.message}</span>}
		</InputContainer>
	)
}


export const errorColor = '#ff0033'
export const disabledColor = '#949695'


export const InputContainer = styled.div`
min-height: 65px;
/* background-color: lightblue; */
margin-bottom: 5px;
.input {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  font-weight: 600;
  height: 45px;
  margin-bottom: 5px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  background-color: white;
  border-bottom: 2px solid ${props => props.error ? errorColor : '#e6e6e6'};
}

//change the border color when the input is focused
& .input:focus-within{
  border-color:${props => props.error ? errorColor : props.theme.palette.primary.main};
  background-color: white
}
//change the label when the input is focused
& .input:focus-within label{
  color: ${props => props.error ? errorColor : props.theme.palette.primary.main};
  background-color: white
}

& .focusDiv label:valid {
  border-color: pink;
}


label {
    font-size: 12px;
    letter-spacing: 0.7px;
    font-weight: 600;
	//disabled 
    color: ${props => {
		if(props.disabled) return disabledColor;
		if(props.error) return errorColor;
	}};
}
input {
  outline: none;
  width: 100%;
  display: flex;
  border-style: none;
  font-size: 14px;
  letter-spacing: 0.3px;
  font-family: 'Roboto', sans-serif;
  font-weight: ${props => props.disabled ? '300' : '400'};
  margin-top: 2px;
  height: 100%;
  color: ${props => {
		if(props.disabled) return disabledColor;
	}};
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