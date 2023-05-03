import React, {useState} from 'react'
import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



const SelectInput = ({items, label, onChange, id}) => {
  const [show, setShow] = useState(false)
  const [chosen , setChosen] = useState(null)

  const handleChange = (item) => {
    onChange(id, item)
    setChosen(item)
  }
  return (
    <ContainerUl onClick={() => setShow(prev => !prev)}>
      <span>{label}</span>
      <span>{chosen}</span>
      {show && (
         <ul>
         { items.map((item) => {
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
  )
}






const ContainerUl = styled.div`
    background-color: ${props => props.theme.palette.background};
    width: 100%;
    outline: none;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
    height: 54px;
    span {
      display: block;
    }
    span:first-child {
    font-size: 11px;
    letter-spacing: 0.8px;
    color: ${props => props.theme.palette.grey.light};
    font-weight: 400;
    margin-bottom: 1px;
    }

    span:nth-child(2) {
    bottom: 0px;
    font-size: 14px;
    letter-spacing: 0.8px;
    font-weight: 600;
   
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
      /* border: 1px solid ${props => props.theme.palette.primary.main}; */
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