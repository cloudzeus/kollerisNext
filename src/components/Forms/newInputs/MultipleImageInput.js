import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import styled from 'styled-components';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadImages, resetUploadImages } from '@/features/upload/uploadSlice';
import ClearIcon from '@mui/icons-material/Clear';
const ImageUploader = () => {
    const { uploadedImages } = useSelector((state) => state.upload);
    console.log('uploadedImages')
    console.log(uploadedImages)
    const dispatch = useDispatch();

    const deleteImage = (e, imageUrl) => {
        dispatch(resetUploadImages())
        e.preventDefault();
        let newImages = uploadedImages.filter((image) => image !== imageUrl);
        dispatch(setUploadImages(newImages))
        console.log('newImages')
        console.log(newImages)
    }

    const handleDrop = async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append('files', file);
        });


        try {
            const response = await fetch('/api/uploads/saveImageMulter', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const { urls } = await response.json();
                dispatch(setUploadImages(urls))
            } else {
                console.error('Error uploading files');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <UploaderStyled>
            <Dropzone onDrop={handleDrop}
                accept="image/*"
                multiple>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CameraAltIcon />
                        <p>Σύρετε ή πατήστε και επιλέξτε φωτογραφίες</p>

                    </div>
                )}
            </Dropzone>
            {uploadedImages && uploadedImages.map((imageUrl, index) => (
                <div className="drag-n-drop_container" key={index}>
                    <div className="drag-n-drop_image">
                        <Image
                            src={`/uploads/${imageUrl}`}
                            alt={`Uploaded ${index + 1}`}
                            fill={true}
                            sizes={50}
                        />
                        <button
                            onClick={(e) => deleteImage(e, imageUrl)}
                            className="delete-button">
                            <ClearIcon />
                        </button>
                    </div>
                    <div className="drag-n-drop_inputdiv">
                            <input
                                className="drag-n-drop_input"
                                type="text"
                                placeholder="Ονομα"
                            />
                        </div>
                </div>
            ))}
            {/* <div className="container">
                {uploadedImages && uploadedImages.map((imageUrl, index) => (
                   <div className="test">sss</div>
                ))}
            </div> */}
        </UploaderStyled>
    );
}


{/* <div className='multiple-upload-image_container'>
<div className="multiple-upload-images" key={index}>
        <Image
            src={`/uploads/${imageUrl}`}
            alt={`Uploaded ${index + 1}`}
            fill={true}
            sizes={50}
        />
      
    <button
        onClick={(e) => deleteImage(e, imageUrl)}
        className="delete-button">
        <ClearIcon />
    </button>
</div>
<input
            type="text"
            placeholder="Ονομα"
        />

</div> */}


const UploaderStyled = styled.div`
    .drag-n-drop_container {
        width: 100%;
        border: 1px solid ${({ theme }) => theme.palette.border};
        padding: 15px;
        margin-bottom: 10px;
    }
    .test {
        width: 100%;
        background-color: pink;
    }
    .drag-n-drop_image {
        width: 60px;
        height: 60px;
        position: relative;
        margin-right: 16px;
        border-radius: 4px;
        position: relative;
        border-radius: 5px;
        z-index: 0;
    }
    .drag-n-drop_inputdiv {
        width: 100%;
        margin-left: 10px;
    }
    .drag-n-drop_inputdiv input.drag-n-drop_input {
        width: 100%;
        padding: 10px;
        /* border: 1px solid ${({ theme }) => theme.palette.border}; */

    }
    border: 1px dashed ${({ theme }) => theme.palette.primary.light10};
    padding: 10px;
    border-radius: 4px;
    & div {
        display: flex;
        align-items: center;
        padding: 5px;
        width:  100%;

    }
    p {
        font-size: 14px;
    }
    svg {
        color: ${({ theme }) => theme.palette.primary.light10};
        margin-right: 10px;
    }

    .multiple-upload-image_container {
        display: block;
        width: 1;
        border: 1px solid ${({ theme }) => theme.palette.border};
        padding: 15px;
    }

    .multiple-upload-images {
        width: 60px;
        height: 60px;
        position: relative;
        margin-right: 16px;
        border-radius: 4px;
        position: relative;
        border-radius: 5px;
        z-index: 0;

    }
    .delete-button {
        outline: none;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 50%;
        position: absolute;
        background-color: ${({ theme }) => theme.palette.primary.light50};
        top: -8px;
        right: -8px;
        z-index: 899;
        box-shadow: 1px 1px 5px 2px rgba(0,0,0,0.2);
        svg {
            font-size: 14px;
            color: red;
            margin-right: 0;
        }
    }
`
export default ImageUploader;