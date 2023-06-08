import styled from "styled-components";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { set } from "mongoose";
export const AddMoreInput = ({ setFormData, formData, label, htmlName1, htmlName2, }) => {
    const [rows, setRows] = useState([{}]);
 

    const handleAddRow = (index) => {
        setRows(prev => {
            return [...prev, {id: prev.length + 1}]
        })
    };

    const handleCancel = (index) => {
        
        
    };

    const handleFirstInput = (e, index) => {
        let value= e.target.value;
        const updatedFormData = { ...formData }
        updatedFormData[index] = { [htmlName2]: updatedFormData[index][htmlName2], [htmlName1]: value }
    }

    const handleSecondInput = (e) => {
        let value= e.target.value;
        // setFormData(prev => {
        //     return [...prev, {...prev.htmlName1, htmlName2: value }]
        // })
    }

    return (
  
        <Container>
             <div className="add_more_double_input_div">
                        <input 
                            type="text" 
                            placeholder="Όνομα" 
                            name={htmlName1} 
                            onChange={(e) =>handleFirstInput(e, 1)} 
                            // value={formData.name} 
                            />
                        <input 
                            type="text" 
                            name={htmlName2} 
                            placeholder="https://" 
                            // value={formData.videoUrl} 
                            onChange={(e) => handleSecondInput(e)} />
                        <AddIcon onClick={handleAddRow} />
                    </div>
            {rows.map((row, index) => {
                return (
                    <div className="add_more_double_input_div">
                        <input type="text" placeholder="Όνομα"  value={formData.name} name={htmlName1} onChange={(e) => handleFirstInput(e)} />
                        <input type="text" name={htmlName2} placeholder="https://" value={formData.videoUrl} onChange={(e) => handleSecondInput(e)} />
                        <DeleteForeverIcon onClick={() => handleCancel(index)}  />
                    </div>
                )
            })}
        </Container>
    )
}


const borderColor = '#e8e8e8';
const Container = styled.div`
    align-items: center;
   
    .add_more_double_input_div {
        display: grid;
        grid-template-columns: 1fr 2fr 40px;
        grid-gap: 10px;
        margin-bottom: 10px;
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

  
`


