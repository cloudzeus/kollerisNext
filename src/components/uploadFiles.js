

import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import styled from 'styled-components';
import Image from 'next/image';
import axios from 'axios';

export default function UploadFiles({mb, mt}) {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [files, setFiles] = useState([])
    console.log('the uploaded files are: ' + JSON.stringify(files))
    
    
    const onTemplateSelect = (e) => {
       
        let _totalSize = totalSize;
        let files = e.files;
        console.log('files are: ' + JSON.stringify(files))
        for (let file of files) {
            setFiles(prev => [...prev, file.name])
        }
        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        
        let _totalSize = 0;
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const handleFinalUpload = async (e) => {
        e.preventDefault()
        console.log('click')
      
        await axios.post('/api/uploads/saveImageMulter', { files: files})
    }

  
    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <HeaderTemplate >
                {/* {chooseButton} */}
                {chooseButton}
                {uploadButton}
                {cancelButton}
                {/* <Button icon="pi pi-upload" severity="secondary" onClick={(e) => handleFinalUpload(e)}/> */}
                {/* {cancelButton} */}
                <div>
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </HeaderTemplate>
        );
    };

    const ItemTemplate = (file, props) => {

        return (
            <ItemTemplateContainer>
                <div className="files-thumbnail-container">
                    <ImageContainer>
                        <Image
                            alt={file.name}
                            role="presentation"
                            src={file.objectURL} fill={true} />
                    </ImageContainer>
                    <div className="files-info">
                        <div className="files-top-info" >
                            <p >{file.name}</p>
                        </div>
                        <div className="files-bottom-info">
                             <span >{file.size}KB</span>
                            {/* <Tag value={'completed'} severity="warning" /> */}
                        </div>
                
                    </div>
                </div>
                <Button type="button" icon="pi pi-times" onClick={() => onTemplateRemove(file, props.onRemove)} />
                

            </ItemTemplateContainer>
        );
    };

    const emptyTemplate = () => {
        return (
            <EmptyTemplate>
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </EmptyTemplate>
        );
    };

    return (
        <Container mb={mb} mt={mt}>
            <Toast ref={toast}></Toast>
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
            <FileUpload 
                ref={fileUploadRef} 
                name="demo[]" 
                url="/api/uploads/saveImageMulter" 
                multiple 
                accept="image/*" 
                maxFileSize={1000000}
                onUpload={onTemplateUpload} 
                onSelect={onTemplateSelect} 
                onError={onTemplateClear} 
                onClear={onTemplateClear}
                headerTemplate={headerTemplate} 
                itemTemplate={ItemTemplate} 
                emptyTemplate={emptyTemplate}
                 />
        </Container>
    )
}


const Container = styled.div`
    width: 100%;
    min-width: 400px;
  
    /* border: 1px solid #ccc; */
    margin-bottom: ${props => props.mb ? props.mb : '0px'};
    margin-top: ${props => props.mt ? props.mt : '0px'};

    .p-fluid .p-fileupload .p-button {
        width: 40px;
    }
`
const ImageContainer = styled.div`
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`

const ItemTemplateContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    .files-thumbnail-container {
        width: 100%;
        display: flex;
        padding: 10px;
    }

    .files-info {
      
        padding: 10px;
    }
    .files-top-info {
        /* font-size: 2px; */
    }
    .files-bottom-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

   
`

const HeaderTemplate = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    border: 1px solid #dee2e6;
    padding: 10px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    
`

const EmptyTemplate = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    font-size: 10px;
`