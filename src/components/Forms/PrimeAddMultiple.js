import styled from "styled-components";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';


export const AddMoreInput = ({ setFormData, formData, label, mb, mt }) => {
    const handleNameChange = (event, index) => {
        const updatedVideoList = [...formData];
        updatedVideoList[index] = {
            ...updatedVideoList[index],
            name: event.target.value
        };
        setFormData(updatedVideoList);
    };

    const handleVideoUrlChange = (event, index) => {
        const updatedVideoList = [...formData];
        updatedVideoList[index] = {
            ...updatedVideoList[index],
            videoUrl: event.target.value
        };
        setFormData(updatedVideoList);
    };

    const addVideo = (e) => {
        e.preventDefault();
        setFormData(prevList => [
            ...prevList,
            {
                name: '',
                videoUrl: ''
            }
        ]);
    };
    const deleteInputFields = (index) => {
        const updatedList = [...formData];
        updatedList.splice(index, 1);
        setFormData(updatedList);
    };

    return (
        <Container mb={mb} mt={mt}>
            <label>
                {label}
            </label>
            <div className="content">
                {formData.map((video, index) => (
                    <div key={index} className="add_more_double_input_div">
                        <InputText
                            type="text"
                            value={video.name}
                            onChange={event => handleNameChange(event, index)}
                            placeholder="Ονομα:"

                        />
                        <InputText
                            type="text"
                            value={video.videoUrl}
                            onChange={event => handleVideoUrlChange(event, index)}
                            placeholder="https://"
                        />
                        <div className="delete_row_button">
                        {index > 0 && <Button icon="pi pi-times" size="small" severity="danger" aria-label="Cancel" onClick={() => deleteInputFields(index)} />}
                        </div>
                    </div>
                ))}
                <div className="button-container">
                    <Button
                        size="small"
                        onClick={addVideo}
                        label="Προσθηκη" raised />
                </div>

            </div>


            {/* <button onClick={(e) => addVideo(e)}>Add Video</button> */}
        </Container>
    )
}




const borderColor = '#e8e8e8';
const Container = styled.div`
    margin: 10px 0;
    /* border: 1px solid ${({ theme }) => theme.palette.border}; */
    border-radius: 4px;
    position:relative;
    margin-bottom: ${props => props.mb ? props.mb : '0px'};
    margin-top: ${props => props.mt ? props.mt : '0px'};
    .add_more_double_input_div {
        display: flex;
        flex-direction: column;
        /* grid-template-columns: 1fr 2fr  40px;
        grid-gap: 10px; */
        margin: 5px 0;
        position: relative;
        border: 1px solid ${borderColor};
        padding: 10px;
    }

    .button-container {
        width: 100px;
        margin: 10px 0px;
    }
    .content {
      
        margin-top: 5px;
    }

    .delete_row_button {
        width: 15%;
    }

    input {
        margin-bottom: 5px;
        margin-top: 5px;
    }
   
   input::placeholder {
    font-weight: bold;
    opacity: 0.5;
    font-size: 14px;
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


