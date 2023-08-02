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




const DialogGallery = ({ images, url, id, user }) => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [addPhotosVisible, setAddPhotosVisible] = useState(false)
    const [selectedImages, setSelectedImages] = useState([])
    const [localImages, setLocalImages] = useState(images)
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Επιτυχής διαγραφή', life: 3000});
    }
    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Αποτυχία Διαγραφής', life: 3000});
    }


    const handleSelected = (image) => {
        let newImages = [...selectedImages]
        if (!newImages.includes(image)) {
            setSelectedImages([...newImages, image])
        }
        if (newImages.includes(image)) {
            newImages = newImages.filter(prev => prev !== image)
            setSelectedImages(newImages)
        }


    }


    const handleDelete = async () => {
        console.log('handle delete')
        const imagestoupdate = images.filter(image => !selectedImages.includes(image))
        setLocalImages(imagestoupdate)
        let newImages = []
        for (let i of imagestoupdate) {
            newImages.push({
                photosPromoUrl: i,
                photosPromoName: i
            })
        }
        try {
            let res = await axios.post(url, { action: "updateImages", images: newImages, updatedFrom: user, id: id })
            console.log(res.data)
            if (res.data.result.modifiedCount === 1) {
                setLocalImages(imagestoupdate)
                showSuccess();
    
            }
        } catch (e) {
            console.log(e)
            showError();
        }
    }
    return (
        <>  
            <Toast ref={toast}></Toast>
            <div className='flex align-content-center '>
                <Button className='' icon="pi pi-pencil" severity="secondary" onClick={() => setVisible(true)} style={{ width: '40px', height: '40px' }} />
                <Button className=' ml-1' icon="pi pi-plus" onClick={() => setAddPhotosVisible(true)} style={{ width: '40px', height: '40px' }} />
            </div>
            <div className='flex flex-start justify-content-between align-content-center'>
                <AvatarGroup className='mt-4 mb-3'>
                    {localImages.map((image, index) => {
                        if (index < 4 ) {
                            return (
                                <AvatarImages key={index}>
                                    <Image
                                        src={`/uploads/${image}`}
                                        alt="Large"
                                        fill={true}
                                        sizes="50px"
                                    />
                                </AvatarImages>
                            )
                        }
                      
                    })}
                    {localImages.length > 4 && <LastImage>{`${localImages.length - 4}+`}</LastImage>}
                </AvatarGroup>
                
            </div>
            <div className="card flex justify-content-center">

                <Dialog header="Διαγραφή Φωτογραφιών" visible={visible} style={{ width: '95%', height: "100%" }} onHide={() => setVisible(false)}>
                    <Button onClick={handleDelete} label="Διαγραφή" severity="danger" icon="pi pi-trash" className='ml-2' />
                    <Container>
                        {localImages.map((image, index) => {
                            return (
                                <ImageContainer onClick={() => handleSelected(image)} className={selectedImages.includes(image) ? "selected" : null} >
                                    <Image
                                        src={`/uploads/${image}`}
                                        alt="Large"
                                        fill={true}
                                        sizes="220px"

                                    />
                                </ImageContainer>
                            )
                        })}
                    </Container>
                </Dialog>
                <Dialog className='flex flex-column' header="Προσθήκη Φωτογραφιών" visible={addPhotosVisible} style={{ width: '95%'}} onHide={() => setAddPhotosVisible(false)}>
                    <AddImages 
                        state={localImages} 
                        setState={setLocalImages} 
                        url={url}
                        id={id}
                        user={user}
                        setAddPhotosVisible={setAddPhotosVisible}
                    />
                </Dialog>
            </div>
        </>
    )
}

export default DialogGallery





 function AddImages({state, setState, url, user, id, setAddPhotosVisible}) {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [urls , setUrls] = useState([])

    
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Message Content', life: 3000});
    }
    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Message Content', life: 3000});
    }

    const uploadHandler = async (e) => {
        console.log(e)
        let formData = new FormData();
        let acceptedFiles = e.files
        formData.append('files', e.files);
        acceptedFiles.forEach((file) => {
            console.log(file)
            formData.append('files', file);
        });

        try {
            console.log('form Data ' + JSON.stringify(formData))
            const response = await fetch('/api/uploads/saveImageMulter', {
                method: 'POST',
                body: formData,
            });
           
           
            if (response.ok) {
                const { urls } = await response.json();
                if(!urls) return showError()
                let images = [...state, ...urls]
                let newImages = [];
                for (let i of images) {
                    newImages.push({
                        photosPromoUrl: i,
                        photosPromoName: i
                    })
                }
                try {
                    let res = await axios.post(url, { action: "updateImages", images: newImages, updatedFrom: user, id: id })
                    console.log(res.data)
                    if (res.data.result.modifiedCount === 1) {
                        showSuccess();
                        setTotalSize(0);
                        setState([...state, ...urls])
                        setAddPhotosVisible(false)
                    }
                } catch (e) {
                    console.log(e)
                }
            } else {
            }
        } catch (error) {
            console.error(error);
        }

    }


    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = async (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        handleDeleteImage(file.name)
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };
    const handleDeleteImage = async (name) => {
        console.log('delete name ' + JSON.stringify(name))
        try {
          const response = await axios.post(`/api/uploads/deleteImage`, {name: name});
          console.log(response)
        } catch (error) {
          console.error('Failed to delete image:');
        }
      };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                <UploadImageContainer>
                    <Image 
                        alt={file.name} 
                        role="presentation" 
                        src={file.objectURL} 
                        fill={true} />
                    </UploadImageContainer>
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div>
            <Toast ref={toast}></Toast>
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" multiple accept="image/*" maxFileSize={1000000}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                uploadHandler={uploadHandler}
                customUpload
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )
}




const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    
`

const ImageContainer = styled.div`
 position: relative;
    width: 150px;
    height: 150px;
    margin: 10px;
    border: 1px solid #dfdedf;
    object-fit: contain;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.06);
    img {
        object-fit: contain;
    }
    &.selected {
        border: 4px solid #007bff;
    }
`

const AvatarImages = styled.div`
    position: relative;
    width: 50px;
    height: 50px;
    margin-right: -15px;
    border-radius: 50%;
    border: 2px solid #cacbcb;
    overflow: hidden;
    img {
        object-fit: contain;

    }
`

const LastImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.palette.primary.main};
    color: white;
    font-weight: bold;
    width: 50px;
    height: 50px;
    margin-right: -15px;
    border-radius: 50%;
    border: 2px solid #cacbcb;
    overflow: hidden;
    z-index: 5;
`


const UploadImageContainer = styled.div`
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0,0,0,0.4);
`