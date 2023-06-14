import styled from "styled-components";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { setVideoUrl } from "@/features/grid/gridSlice";

export const AddMoreInput = ({ setFormData, formData, label, htmlName1, htmlName2, register }) => {





    const handleNameChange = (event, index) => {
        const updatedVideoList = [...formData];
        updatedVideoList[index] = {
            ...updatedVideoList[index],
            name: event.target.value
        };
        setFormData(updatedVideoList);
    };

    const handleVideoUrlChange = (event ,index) => {
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
        <Container>
            <div >
                {formData.map((video, index) => (
                    <div key={index} className="add_more_double_input_div">
                        <input
                            type="text"
                            value={video.name}
                            onChange={event => handleNameChange(event, index)}
                            placeholder="Ονομα:"
                        />
                        <input
                            type="text"
                            value={video.videoUrl}
                            onChange={event => handleVideoUrlChange(event, index)}
                            placeholder="https://"
                        />
                        {index > 0 && <DeleteForeverIcon className="add_more_double_input_delete_icon" onClick={() => deleteInputFields(index)}  />}
                    </div>
                ))}
                <AddIcon onClick={addVideo} />
                {/* <button onClick={(e) => addVideo(e)}>Add Video</button> */}
            </div>
        </Container>
    )
}




const borderColor = '#e8e8e8';
const Container = styled.div`
    border: 1px solid ${({ theme }) => theme.palette.border};
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


