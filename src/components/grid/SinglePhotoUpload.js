import React, { useState, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import Image from 'next/image';
import axios from 'axios';

import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { createAsyncThunk } from '@reduxjs/toolkit';




const SinglePhotoUpload = ({ image, state, setState }) => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(image);


    const onUpload = async (event) => {
        const file = event.target.files[0];
        let formData = new FormData();
        formData.append('files', file);
      
        try {
            const response = await fetch('/api/uploads/saveImageMulter', {
                method: 'POST',
                body: formData,
            });
           
           
            if (response.ok) {
                const { urls } = await response.json();
                if(urls) {
                    setState(urls[0])
                   
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Toast ref={toast}></Toast>
            <div className='flex flex-start justify-content-between align-content-center relative	'>

                <div className='relative' >
                    <ImageContainer onClick={() => setVisible(true)}>
                        <Image
                            src={`/uploads/${state}`}
                            alt="logo"
                            fill={true}
                            sizes="50px"
                        />
                    </ImageContainer>
                    <ImageButton>
                        <input  ref={fileInputRef} type="file" name="file" onChange={onUpload}  />
                        <i onClick={() => fileInputRef.current.click()} className="pi pi-camera"></i>
                    </ImageButton>
                </div>

            </div>
          
        </>
    )
}

export default SinglePhotoUpload;











const ImageContainer = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #ececec;
    object-fit: contain;
    overflow: hidden;
    img {
        object-fit: cover;
        object-position: center;
    }
    &.selected {
        border: 4px solid #007bff;
    }
`



const ImageButton = styled.div`
    position: absolute;
    top: 50%;
    right: -14px;
    transform: translateY(-50%);
    background-color:#dcdcdb;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    
    cursor: pointer;
    outline: none;

    input {
        display: none;
    }

`