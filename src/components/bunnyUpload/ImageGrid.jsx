'use client'
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Button } from 'primereact/button';
import { useDropzone } from 'react-dropzone';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { deleteBunny, uploadBunny } from '@/utils/bunny_cdn';

import { OverlayPanel } from 'primereact/overlaypanel';
import Image from 'next/image';
import styled from 'styled-components';
import { Toast } from 'primereact/toast';



export const ImageGrid = ({ uploadedFiles, setUploadedFiles, data, onDelete, onAdd, loading}) => {
    const [visible, setVisible] = useState(false)
    const toast = useRef(null);


    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 4000 });
    }

   

    useEffect(() => {
        setUploadedFiles([])
    }, [])

    //UPLOAD FILE STATE IS AN ARRAY OF OBJECTS {file: file, name: name}
    //THE file is the uplaoded file that will be turned into binary to send to bunny cdn
    //In case we need to change the name of the file that wll be uploaded we change the value stored in the "name" key in the state object
    console.log('data', data)
    const handleDelete  = async (name, _id) => {
         await onDelete(name, _id)
        let bunny_delete = await deleteBunny(name);
        if(bunny_delete.HttpCode == 200) {
            showSuccess('Η φωτογραφία διαγράφηκε επιτυχώς')
        } else {
            showError('Αποτυχία διαγραφής φωτογραφίας στο bunny cdn')
        }
    }
    const Header = () => {
        return (
            <div >
                  <Toast ref={toast} />
                <Button icon="pi pi-plus" label="προσθήκη" severity='secondary' onClick={() => setVisible(true)} />
                <FileUpload
                    onAdd={onAdd}
                    visible={visible}
                    setVisible={setVisible}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}

                />
            </div>
        )
    }
    const header = Header()

    const Actions = ({ name, _id }) => {
       
        return (
            <div>
                <i onClick={() =>  handleDelete(name, _id)} className="pi pi-trash cursor-pointer" style={{ fontSize: '1rem' }}></i>
            </div>
        )
    }

    return (
        < DataTableContainer>
            <DataTable
                // className='p-datatable-sm'
                value={data}
                header={header}
                loading={loading}
            >
                <Column body={ImageTemplate} field="path" header="Φωτογραφία"></Column>
                <Column style={{ width: '80px' }} body={Actions}></Column>
            </DataTable>
        </DataTableContainer>
       

    )
}





const ImageTemplate = ({ name }) => {


    const op = useRef(null);
    return (
        <div className='flex'>
            <ImageDiv>
                <Image
                    alt="product-images"
                    src={`https://kolleris.b-cdn.net/images/${name}`}
                    fill={true}
                    sizes="50px"

                />
            </ImageDiv>
            <div className='flex align-items-center cursor-pointer ml-3'>
                {/* <i className="pi pi-image mr-2 " style={{ fontSize: '1rem' }}></i> */}
                <span
                    onMouseEnter={(e) => op.current.show(e)}
                    onMouseLeave={(e) => op.current.hide(e)}
                    className='font-medium'>{name}</span>
                <OverlayPanel ref={op}>
                    <ImageDiv>
                        <Image
                            alt="product-images"
                            src={`https://kolleris.b-cdn.net/images/${name}`}
                            fill={true}
                            sizes="50px"
                        />
                    </ImageDiv>

                </OverlayPanel>
            </div>

        </div>
    )
}





const FileUpload = ({ visible, setVisible, uploadedFiles, setUploadedFiles, onAdd }) => {
    const [loading, setLoading] = useState(false)
    const toast = useRef(null);


    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    }

    const { getRootProps, getInputProps } = useDropzone({
        // ON drop add any new file added to the previous stat
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/jpg': [],
            'image/svg+xml': [],
        },
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
            let newfiles = acceptedFiles.map(file => {
                return {
                    file: file,
                    name: file.path
                }
            })
            setUploadedFiles(prev => [...prev, ...newfiles])
        },
    });



    const onSubmit = async () => {
        setLoading(true)
        //Turn the file into binary and use the uploadBunny function in utils to send it to bunny cdn
        for (let item of uploadedFiles) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                //onAdd is the passed function that will be called after the upload is complete, to save the image data to our database

                let res = await onAdd()
                if (!res.success) {
                    showError(res.message)
                }
                if (res.success) {
                    const arrayBuffer = event.target.result;
                    let result = await uploadBunny(arrayBuffer, item.name)
                    if (result.HttpCode == 201 || result.Message === "File uploaded.") {
                        showSuccess('Η φωτογραφία ανέβηκε επιτυχώς')
                    }

                }
                setLoading(false)

            };
            reader.readAsArrayBuffer(item.file);
            setLoading(false)
        }




    };
    const removeImage = async ({ name }) => {
        console.log('name')
        console.log(name)
        let newFiles = uploadedFiles.filter(file => file.name !== name)
        setUploadedFiles(newFiles)
       

    }



    return (
        <Dialog header="Uploader" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <Toast ref={toast} />
            <div className='cursor-pointer' {...getRootProps()}>
                <input {...getInputProps()} />
                <Button {...getInputProps()} label="drag and drop" />
                <div className='h-6rem border-round p-3 pointer-cursor border-1 border-dashed flex align-items-center justify-content-center'>
                    <p className='text-md'>Σείρετε ή επιλέξτε αρχεία για ανέβασμα</p>
                </div>

            </div>
            {uploadedFiles.map((item, index) => (
                <ImageItem
                    fileItem={item}
                    key={index}
                    removeImage={removeImage}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles} />
            ))}
            {uploadedFiles.length ? (<Button loading={loading} label="Ολοκλήρωση" onClick={onSubmit} className='mt-2' />) : null}
        </Dialog>


    );
};


const ImageItem = ({ fileItem, index, removeImage, uploadedFiles, setUploadedFiles }) => {
    const [localValue, setLocalValue] = useState(fileItem.name)
    const handleEdit = (e) => {
        setLocalValue(e.target.value)
        let newFiles = uploadedFiles.map(mapitem => {
            console.log(mapitem)
            if (mapitem.file.path === fileItem.file.path) {
                console.log('found')
                return {
                    ...mapitem,
                    name: e.target.value
                }
            }
            return mapitem
        })
        setUploadedFiles(newFiles)



    }
    return (
        <div className=' flex  justify-content-between p-2 border-round surface-200 mb-1 mt-2' key={index} >
            <InputText onChange={handleEdit} className='w-full border-none' placeholder="Search" value={localValue} />
            <div className='flex bg-surface-200 align-items-center'>
                <i onClick={() => removeImage(fileItem)} className="pi pi-trash text-surface-400  p-2 border-round cursor-pointer ml-1" style={{ fontSize: '1.2rem' }}></i>
            </div>
        </div>
    )
}


const DataTableContainer  = styled.div`
    width: 100%;
    @media (max-width: 1552px) {
        width: 800px;
    }
    @media (max-width: 1163px) {
        width: 600px;
    }

`
const ImageDiv = styled.div`
    width: 50px;
    height: 50px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    & img {
        object-fit: contain;
    }

`

export default ImageGrid;