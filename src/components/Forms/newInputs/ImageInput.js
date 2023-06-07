import Image from "next/image";
import { useState } from "react";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import styled from "styled-components";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

export const ImageInput = (props) => {
    const [imageName, setImageName] = useState(props.logo);
    const [loading, setLoading] = useState(false);
    const handleFileChange = async () => {

        let fileEl = document.getElementById('customFileUpload2');
        let file = fileEl.files[0];
       
        setLoading(true)
        const formData = new FormData();
        formData.append("myFile", file);
        const { data } = await axios.post("/api/saveImage", formData);
        console.log(data)
        if(data.done === 'ok') {
            //props.setSelected files, to save the fileName to the database
            props.setSelectedFile(data.newFilename);
            //To change the image on the edit page when the loading is done:
            setImageName(data.newFilename)
            setLoading(false)
        }
      

    };
    const handleClick = (e) => {
        console.log('click')
        e.preventDefault()
        document.getElementById('customFileUpload2').click()
    }
    return (
        <ImageContainer >
            {loading ? <CircularProgress /> : (
                <>
                    <div onClick={handleClick}>
                        <div className='imageAndDetails'  >
                            <Image
                                src={`/static/uploads/${imageName}`}
                                alt="mountain"
                                fill={true}
                            />
                        </div>
                        <p>{imageName}</p>
                        <DriveFolderUploadIcon />
                    </div>
                    <input
                        type="file"
                        id="customFileUpload2"
                        onChange={handleFileChange}
                    />
                </>
            )}

        </ImageContainer>
    )
}


const ImageContainer = styled.div`
    display: flex;
    align-items: center;
    border: 2px solid ${props => props.theme.palette.border};
    border-radius: 4px;
    padding: 4px;
	position: relative;

	div:nth-child(1) {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	&:hover {
		border-color: ${props => props.theme.palette.primary.main};
	}
    div.imageAndDetails {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        color: black;
    }
    p {
        margin-left: 10px;
        font-size: 14px;
		font-style: italic;

    }
	
	svg {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		color: ${props => props.theme.palette.primary.main};
	}
	input[type="file"] {
        display: none; 
    }
    
`