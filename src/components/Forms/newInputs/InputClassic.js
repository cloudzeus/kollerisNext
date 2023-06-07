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


//NORMAL INPUT DOES NOT USE USEFORM PACKAGE:
export const Input = ({
	name,
	type,
	label,
	placeholder,
	register,
	error,
	value,
	disabled 
}) => {
	const [focus, setFocus] = useState(false)
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
					value={value}
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

// const ImageContainer = styled.div`
//     display: flex;
//     align-items: center;
//     border: 2px solid ${props => props.theme.palette.border};
//     border-radius: 4px;
//     padding: 4px;
// 	position: relative;

// 	div:nth-child(1) {
// 		height: 100%;
// 		width: 100%;
// 		display: flex;
// 		align-items: center;
// 		cursor: pointer;
// 	}
// 	&:hover {
// 		border-color: ${props => props.theme.palette.primary.main};
// 	}
//     div.imageAndDetails {
//         width: 40px;
//         height: 40px;
//         object-fit: contain;
//         border-radius: 4px;
//         position: relative;
//         overflow: hidden;
//         color: black;
//     }
//     p {
//         margin-left: 10px;
//         font-size: 14px;
// 		font-style: italic;

//     }
	
// 	svg {
// 		position: absolute;
// 		right: 10px;
// 		top: 50%;
// 		transform: translateY(-50%);
// 		color: ${props => props.theme.palette.primary.main};
// 	}
// 	input[type="file"] {
//         display: none; 
//     }
    
// `
// export const ImageInput = (props) => {
// 	const dispatch = useDispatch()
// 	const handleFileChange = () => {
//         let fileEl = document.getElementById('customFileUpload2');
//         let file = fileEl.files[0];
// 		console.log('file in ImageInput')
// 		console.log(file)
// 		dispatch(setSelectedFile(file.name))

//       };
// 	  const handleClick = (e) => {
// 		console.log('click')
//         e.preventDefault()
//         document.getElementById('customFileUpload2').click()
// 		console.log(document.getElementById('customFileUpload2'))
//       }
//     return (
//         <ImageContainer >
// 			<div onClick={handleClick}>
// 				<div className='imageAndDetails'  >
// 					<Image
// 						src={`/static/imgs/${props.logo}`}
// 						alt="mountain"
// 						fill={true}
// 					/>
// 				</div>
// 				<p>{props.logo}</p>
// 				<DriveFolderUploadIcon />
// 			</div>
// 			<input 
//                 type="file" 
//                 id="customFileUpload2"
//                 onChange={handleFileChange}
//             />
//         </ImageContainer>
//     )
// }
