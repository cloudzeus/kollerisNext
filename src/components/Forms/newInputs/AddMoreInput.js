import styled from "styled-components";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from 'react-toastify';


export const AddMoreInput = ({ setFormData, formData, label, htmlName1, htmlName2, register}) => {
    const addInputFields = () => {
        setFormData([...formData, { name: '', videoUrl: '' }]);
        
      };

  

    const handleInputChange = (event,index) => {
        const { name, value } = event.target;
        const updatedList = [...formData];
        updatedList[index][name] = value;
        setFormData(updatedList);
      };


      const deleteInputFields = (index) => {
        const updatedList = [...formData];
        updatedList.splice(index, 1);
        setFormData(updatedList);
      };

    return (
        <Container>
            {formData.map((row, index) => {
                console.log(row)
                return (
                    <div key={index} className="add_more_double_input_div">
                        <input type="text" placeholder="Όνομα"  value={row.name} name={htmlName1} onChange={(e) =>handleInputChange (e, index)}/>
                        <input type="text" name={htmlName2} placeholder="https://" value={row.videoUrl} onChange={(e) =>handleInputChange (e, index)} />
                        <AddIcon onClick={addInputFields} />
                        {index > 0 && <DeleteForeverIcon className="add_more_double_input_delete_icon" onClick={() => deleteInputFields(index)}  />}
                    </div>
                )
            })}
        </Container>
    )
}


const borderColor = '#e8e8e8';
const Container = styled.div`
    border: 1px solid ${({theme}) => theme.palette.border};
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    .add_more_double_input_div {
        display: grid;
        grid-template-columns: 1fr 2fr 40px 40px;
        grid-gap: 10px;
        margin: 5px 0;
    }
    input {
        width: 100%;
        border-radius: 4px;
        border: 1px solid ${borderColor};
        padding: 10px;
   }
        input:focus{
        border-color:${props => props.error ? errorColor : props.theme.palette.primary.main};
        border-width: 2px;
        }
    svg {
        border: 1px solid ${borderColor};
        border-radius: 4px;
        padding: 10px;
        height: 100%;
        width: 40px;
        font-size: 20px;
        color: ${props => props.theme.palette.primary.main};
        cursor: pointer;
   }
   svg:hover,svg:active  {
    scale: 0.9;
   }
   svg.add_more_double_input_delete_icon {
        color: red;
   }
  
`


