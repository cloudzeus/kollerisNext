
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import Image from 'next/image';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';
import axios from 'axios';



export default function PrimeUploads({label, multiple, mt, mb, setState, singleUpload, state}) {
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [didUpload, setDidUpload] = useState(false)

    const handleDeleteImage = async (name) => {
        try {
          const response = await axios.post(`/api/uploads/deleteImage`, {name: name});
          console.log(response)
        } catch (error) {
          console.error('Failed to delete image:');
        }
      };

    const uploadHandler = async (e) => {

        let formData = new FormData();
        let acceptedFiles = e.files
        formData.append('files', e.files);
        acceptedFiles.forEach((file) => {
            formData.append('files', file);
        });
        try {
            setDidUpload(false)
            setLoading(true)
            console.log('form Data ' + JSON.stringify(formData))
            const response = await fetch('/api/uploads/saveImageMulter', {
                method: 'POST',
                body: formData,
            });
           
           
            if (response.ok) {
                const { urls } = await response.json();
                if(urls) {
                    console.log(urls)
                    if(singleUpload) {
                        setState(urls)
                    } else {
                        setState([...state, ...urls])
                    }
                  
                    setDidUpload(true)
                }
            } else {
                setDidUpload(false)
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

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });
        setLoading(true)
        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
        setDidUpload(false)
        handleDeleteImage(file.name)

     
    };

    const onTemplateClear = () => {
        setTotalSize(0);
        setDidUpload(false)
    };

  


    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
               
            </div>

        );
    };

    const handleFileName = (name) => {
        if(name.length > 30) {
            return name.substring(0, 30) + '...'
        } else {
            return name;
        }
    }
    const itemTemplate = (file, props) => {
        return (
            <ItemTemplate>
                <div className="left-content">
                    <ImageContainer>
                    <Image 
                        alt={file.name} 
                        role="presentation" 
                        src={file.objectURL} 
                        fill={true} 
                        sizes="80px"
                        />
                    </ImageContainer>
                    <div className="details">
                        <span>
                            { handleFileName(file.name)}
                        </span>
                        <Tag value={props.formatSize} severity="warning" rounded className="px-3 p-3 w-6rem"  />
                    </div>
                    
                </div>
                {!didUpload ? (
                    <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-danger" style={{width: '30px', height: '30px'}} onClick={() => onTemplateRemove(file, props.onRemove)} />
                ) : null}
            </ItemTemplate>
        );
    };


return (
    <Container mb={mb} mt={mt} >
        <Toast ref={toast}></Toast>
        <p>
           {label}
        </p>
        <FileUpload
            
            ref={fileUploadRef}
            name="demo[]"
            multiple={multiple}
            accept="image/*"
            maxFileSize={1000000}
            url="/api/uploads/saveImageMulter"
            customUpload
            uploadHandler={uploadHandler}
            onUpload={onTemplateUpload}
            onSelect={onTemplateSelect}
            onError={onTemplateClear}
            onClear={onTemplateClear}
            itemTemplate={itemTemplate}
            headerTemplate={headerTemplate}
            chooseOptions={{icon: 'pi pi-fw pi-images', className: 'p-button-primary p-mr-2', iconOnly: true, style:{ width: '40px' } }}
            uploadOptions={{icon: 'pi pi-fw pi-upload', className: 'p-button-primary p-mr-2', iconOnly: true, style:{ width: '40px' } }}
            cancelOptions={{icon: 'pi pi-fw pi-times', className: 'p-button-primary p-mr-2', iconOnly: true, style:{ width: '40px' } }}
            emptyTemplate={<p className="m-0">Σείρετε εικόνες για ανέβασμα.</p>}
        />
         <div className="card flex justify-content-center">
            {didUpload ? (
                <Message className='w-full' severity="success" text="Eπιτυχής ανέβασμα" />
            ) : (
                null
            )}
            {totalSize > 0 && !didUpload ? (
                    <Message className='w-full' severity="warn" text="Πατήστε upload" />
            ) : null}
        </div>
    </Container >
)
}



const Container = styled.div`
    margin-top: ${props => props.mt ? props.mt : '0px'};
    margin-bottom: ${props => props.mb ? props.mb : '0px'};
    p {
        margin-bottom: 5px;
    }
`

const ImageContainer = styled.div`
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0,0,0,0.4);
`

const ItemTemplate = styled.div`
    display: flex;
    width: 100%;
    align-items: center;  
    justify-content: space-between;
    margin-bottom: 8px;
    .left-content {
        display: flex;
    }
    .details {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
       
        & span {
            font-size: 14px;
        }

        .p-tag {
            margin-top: 5px;
            width: 80px;
            height: 25px;
        
            & span {
                font-size: 11px;
            }
        }
    }
    button {
        width: 40px;
    }
`