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
            <div className="multiple-upload-images-container" >
                {uploadedImages && uploadedImages.map((imageUrl, index) => (
                    <>
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

                    </>
                ))}
            </div>
        </UploaderStyled>
    );
}





const UploaderStyled = styled.div`

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
    .multiple-upload-images {
        width: 50px;
        height: 50px;
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