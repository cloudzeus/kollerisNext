import React, { useState, useRef } from 'react'

import styled from 'styled-components';
import Image from 'next/image';
import { ProgressSpinner } from 'primereact/progressspinner';

import { Toast } from 'primereact/toast';




const SinglePhotoUpload = ({  state, setState }) => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const onUpload = async (event) => {
        const file = event.target.files[0];
        let formData = new FormData();
        formData.append('files', file);
        console.log(file)
        setLoading(true);
        try {
            const response = await fetch('/api/uploads/saveImageMulter', {
                method: 'POST',
                body: formData,
            });
           
           
            if (response.ok) {
                const { urls } = await response.json();
                if(urls) {
                    console.log(urls)
                    setState(urls)
                    setLoading(false);
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
                    <ImageContainer onClick={() => fileInputRef.current.click()}>
                        
                        {state.length === 0 ? (
                             <i className="pi pi-image " style={{ fontSize: '3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                        ) : (
                            <>
                            {loading ? (
                               <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="2"  animationDuration=".5s" />

                            ) : (
                                <Image
                                src={`public/uploads/${state}`}
                                alt="logo"
                                fill={true}
                                sizes="50px"
                            />
                            )}
                              
                            </>
                           
                        )}
                     
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #ececec;
    object-fit: cover;
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
    border: 3px solid white;

    input {
        display: none;
    }

`