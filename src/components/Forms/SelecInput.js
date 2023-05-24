import React, {useState} from 'react'
import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { InputContainer } from './FormInput';
import { Input } from '@mui/material';
import { disabledColor } from './FormInput';

const SelectInput = ({items, label, onChange, id, value, edit}) => {
  const [show, setShow] = useState(false)

  const handleChange = (item) => {
    onChange(id, item)
  }
  return (
    <InputContainer >
      <ContainerUl edit={edit}  onClick={() => setShow(prev => !prev)}>
      <span>{label}</span>
      <span>{value}</span>
      {show && !edit && (
         <ul>
         {items.map((item) => {
           return (
            <li 
            key={item}
             onClick={() => handleChange(item)}>
              {item}
            </li>
           )
         })}
         </ul>
      )}
      <KeyboardArrowDownIcon className={'dropIcon'} />
    </ContainerUl>
    </InputContainer>
    
  )
}






const ContainerUl = styled.div`
    margin-bottom: 5px;
    height: 56px;
    background-color: ${props => props.theme.palette.background};
    width: 100%;
    outline: none;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    span {
      display: block;
    }
    span:first-child {
    font-size: 10px;
    letter-spacing: 0.9px;
    font-weight: 600;
    margin-bottom: 1px;
    color: ${props => props.edit? disabledColor : null};
    }

    span:nth-child(2) {
    bottom: 0px;
    font-size: 14px;
    font-weight: ${props => props.edit? '300' : '400'};;
    margin-top: 2px;
    color: ${props => props.edit? disabledColor : null};

    }

    ul {
      list-style: none;
      position: absolute;
      left: 0;
      top: 115%;
      width: 100%;
      z-index: 10;
      background-color: white;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
      border-radius: 4px;
    } 

    li {
      height: 100%;
      font-size: 14px;
      border-bottom: 1px solid #eaeaea ;
      padding: 10px;

      cursor: pointer;
    }

    & .dropIcon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

 
    
`

export default SelectInput