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

   

  

    
    const handleDelete  = async (name, _id) => {
         await onDelete(name, _id)
        // let bunny_delete = await deleteBunny(name);
        // if(bunny_delete?.HttpCode == 200) {
        //     showSuccess('Η φωτογραφία διαγράφηκε επιτυχώς')
        // } else {
        //     showError('Αποτυχία διαγραφής φωτογραφίας στο bunny cdn')
        // }
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
                    quality={30} 
                    

                />
            </ImageDiv>
            <div className='flex align-items-center cursor-pointer ml-3'>
                {/* <i className="pi pi-image mr-2 " style={{ fontSize: '1rem' }}></i> */}
                <span
                    onMouseEnter={(e) => op.current.show(e)}
                    onMouseLeave={(e) => op.current.hide(e)}
                    className='font-medium'>{name}</span>
                <OverlayPanel ref={op}>
                    <ImageOverlay>
                        <Image
                            alt="product-images"
                            src={`https://kolleris.b-cdn.net/images/${name}`}
                            fill={true}
                            sizes="50px"
                            
                        />
                    </ImageOverlay>

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
        const readAsArrayBuffer = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
        
                reader.onload = (event) => {
                    resolve(event.target.result);
                };
        
                reader.onerror = (error) => {
                    reject(error);
                };
        
                reader.readAsArrayBuffer(file);
            });
        };
        
        //Turn the file into binary and use the uploadBunny function in utils to send it to bunny cdn
        for (let item of uploadedFiles) {
            console.log(item)
            try {
                const arrayBuffer = await readAsArrayBuffer(item.file);
                const result = await uploadBunny(arrayBuffer, item.name);
                if (result.HttpCode === 201 || result.Message === "File uploaded.") {
                    
                        showSuccess('Η φωτογραφία ανέβηκε επιτυχώς');
                        setUploadedFiles([]);
                } else {
                    showError('Αποτυχία μεταφόρτωσης φωτογραφίας στο Bunny CDN');
                }
            } catch (error) {
                showError('Σφάλμα κατά τη μεταφόρτωση στο Bunny CDN');
            } finally {
                setLoading(false);
            }
            
        }
        let res = await onAdd()
        setUploadedFiles([]);


    };
    const removeImage = async ({ name }) => {
      
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
            if (mapitem.file.path === fileItem.file.path) {
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

const ImageOverlay = styled.div`
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    position: unset !important;
    width: 100%;
    height: 100%;
    img {
        object-fit: contain;
        width: 100% !important;
        position: relative !important;
        height: unset !important;
    }
`
export default ImageGrid;