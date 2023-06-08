import styled from "styled-components";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
export const AddMoreInput = ({ setFormData, formData, label, atrr1, attr2, objName }) => {
    const [rows, setRows] = useState([{id: 1}]);
    console.log(rows)

    const handleAddRow = () => {
        setRows(prev => {
            return [...prev, { id: prev.length + 1 }]
        })
    };
    const handleCancel = (id) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    const handleFormData = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setFormData(prev => ({ ...prev, [objName]: { ...prev.videoPromoList, [name]: [value] } }))
    }

    return (
        // <AddMoreInputContainer >
        //             <div className="duplicated-input">
        //                 <label htmlFor="">{label}</label>
        //                 <div className="add_more_input_row">
        //                             <input type="text" name={attr2} placeholder="https://" value={formData.name} onChange={(e) => handleFormData(e)} />
        //                             <AddIcon onClick={handleAddRow} />
        //                         </div>
        //                 {rows.map((row, index) => {
        //                     return (
        //                         <div className="add_more_input_row" key={index}>
        //                             <input type="text" placeholder="Όνομα" name={atrr1} onChange={(e) => handleFormData(e)} />
        //                             <input type="text" name={attr2} placeholder="https://" value={formData.name} onChange={(e) => handleFormData(e)} />
        //                             <AddIcon onClick={handleAddRow} />
        //                         </div>
        //                     )
        //                 })}

        //             </div>
        // </AddMoreInputContainer>
        <Container>
             <div className="add_more_double_input_div">
                        <input type="text" placeholder="Όνομα" name={atrr1} onChange={(e) => handleFormData(e)} />
                        <input type="text" name={attr2} placeholder="https://" value={formData.name} onChange={(e) => handleFormData(e)} />
                        <AddIcon onClick={handleAddRow} />
                    </div>
            {rows.map((row, index) => {
                return (
                    <div className="add_more_double_input_div">
                        <input type="text" placeholder="Όνομα" name={atrr1} onChange={(e) => handleFormData(e)} />
                        <input type="text" name={attr2} placeholder="https://" value={formData.name} onChange={(e) => handleFormData(e)} />
                        <DeleteForeverIcon onClick={() => handleCancel(row.id)}  />
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

const AddMoreInputContainer = styled.div`
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    display: block;
    .add_more_input_row {
        display: flex;
    }
    label {
        font-size: 12px;
        margin-bottom: 8px;
    }
    /* background-color: pink; */
   input {
    height: 40px;
    padding: 10px;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    height: 100%;
    margin-right: 10px;
   }
   input:nth-child(2) {
    flex: 1;
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
