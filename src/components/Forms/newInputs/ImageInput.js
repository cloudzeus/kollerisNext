import Image from "next/image";
import { useState } from "react";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import styled from "styled-components";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import ImageIcon from '@mui/icons-material/Image';




export const ImageInput = ({logo, setSelectedFile, label, required, mb}) => {
    const [imageName, setImageName] = useState(logo);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async () => {
        let fileEl = document.getElementById('customFileUpload2');
        let file = fileEl.files[0];
        // console.log('file', file)
        setLoading(true)


        const formData = new FormData();
        formData.append("myFile", file);
        const { data } = await axios.post("/api/saveImage", formData);
        if(data.done === 'ok') {
            //props.setSelected files, to save the fileName to the database
            console.log(data.newFilename)
            setSelectedFile(data.newFilename);
            setImageName(data.newFilename)
            setLoading(false)
        } else {
            setImageName("Aποτυχία Upload")
            setLoading(false)
        }
      

    };
    const handleClick = (e) => {
        console.log('click')
        e.preventDefault()
        document.getElementById('customFileUpload2').click()
    }
    return (
        <Container mb={mb}>
            <p className="label">
                {label}
                <span>{required ? '*' : ''}
                </span> 
            </p>
            <ImageContainer >
            
            {loading ? <CircularProgress /> : (
                <>  
                    <div onClick={handleClick}>
                       
                        <div className='imageAndDetails'  >
                           {imageName ? (
                             <Image
                             src={`/uploads/${imageName}`}
                             alt="mountain"
                             fill={true}
                             priority={false}
                             sizes="40px"
                         />
                           ) : (
                            <div>
                                <ImageIcon className="upload-image-placeholder" />
                            </div>
                           )}
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
        </Container>
        
    )
}


const Container = styled.div`

    p.label {
        font-size: 14px;
	font-weight: ${props => props.isFocus ? '500' : '400'};
	letter-spacing: 0.3px;
    margin-bottom: 5px;
    & span {
        color: red;
        margin-left: 2px;
    }
    }

    margin-bottom: ${props => props.mb ? props.mb : ''};
    
`

const ImageContainer = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid ${props => props.theme.palette.border};
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
        font-size: 12px;
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

    .upload-image-placeholder {
        font-size: 30px;
        color: #e3e3e3;
    }
    
`