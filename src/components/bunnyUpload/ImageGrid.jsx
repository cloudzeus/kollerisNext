import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDropzone } from 'react-dropzone';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { uploadBunny } from '@/utils/bunny_cdn';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import Image from 'next/image';
import styled from 'styled-components';
import { set } from 'mongoose';

const TopLayer = ({id}) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])

    const createImagesURL =  (files) => {
        let imagesNames = [];
        for (let file of files) {
            imagesNames.push(file.name)
        }
        return imagesNames;
    }



    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProduct', { action: "getImages", id: id }, { timeout: 50000 })
        console.log(data)
        setData(data)
    }

    const onDelete = async (name) => {
        let { data } = await axios.post('/api/product/apiProduct', { action: "deleteImage", id:id, imageName: name })
        console.log(data)
    
    }

    const onAdd = async () => {
        // let imagesNames = [];
        // for (let file of uploadedFiles) {
        //     imagesNames.push(file.name)
        // }
        let imagesURL = createImagesURL(uploadedFiles)
        let { data } = await axios.post('/api/images', { action: 'product', id: '651bc00b65e267b6c9aa67f9', imagesURL: imagesURL})
        console.log(data)
    }


    useEffect(() => {
        handleFetch()
    }, [])
    return (
        <ImageGrid
            data={data}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onDelete={onDelete}
            onAdd={onAdd}
            
        />
    )
}



const ImageGrid = ({ uploadedFiles, setUploadedFiles, data, onDelete, hasLogo, onAdd   }) => {
    const [visible, setVisible] = useState(false)

    //UPLOAD FILE STATE IS AN ARRAY OF OBJECTS {file: file, name: name}
    //THE file is the uplaoded file that will be turned into binary to send to bunny cdn
    //In case we need to change the name of the file that wll be uploaded we change the value stored in the "name" key in the state object
    

    const newdata = [

        {
            path: 'bin-jaleel-almanza-VKI8S_O-pYg-unsplash.jpg',
            name: 'bin-jaleel-almanza-VKI8S_O-pYg-unsplash.jpg',
        },
        {
            path: '10011110302-1.webp',
            image: '10011110302-1.webp',
        },
        {
            path: '10011110497-0.webp',
            image: '10011110497-0.webp'
        },
        {
            path: '10011110497-1.webp',
            image: '10011110497-1.webp',
        },



    ]

    const Header = () => {
        return (
            <div>
                <Button label="upload" onClick={() => setVisible(true)} />
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

    const Actions = ({ path, name,  }) => {
       
        return (
            <div>
                <i onClick={() => onDelete(name)} className="pi pi-trash cursor-pointer" style={{ fontSize: '1rem' }}></i>
            </div>
        )
    }


    return (
        <DataTable
            value={newdata}
            tableStyle={{ minWidth: '50rem' }}
            header={header}
        >
            <Column body={ImageTemplate} field="path" header="Φωτογραφία"></Column>
            { hasLogo ? (<Column body={Logo} field="path" header="Φωτογραφία"></Column>) : null}
            <Column style={{ width: '80px' }} body={Actions}></Column>
        </DataTable>

    )
}



const Logo = ({ path, name }) => {
    return (
        <div className='bg-green-400 border-round flex align-items-center justify-content-center p-3 text-white' style={{width: '80px', height: '25px'}}>
            <p>logo</p>
        </div>
    )
}

const ImageTemplate = ({ path, name }) => {

 
    const op = useRef(null);
    return (
        <div className='flex'>
             <ImageDiv>
                    <Image
                        src={`https://kolleris.b-cdn.net/images/${path}`}
                        fill={true}

                />
                    </ImageDiv>
            <div className='flex align-items-center cursor-pointer ml-3'>
                {/* <i className="pi pi-image mr-2 " style={{ fontSize: '1rem' }}></i> */}
                <span 
                  onMouseEnter={(e) => op.current.show(e)}
                  onMouseLeave={(e) => op.current.hide(e)}
                className='font-medium'>{path}</span>
                <OverlayPanel ref={op}>
                    <ImageDiv>
                    <Image
                        src={`https://kolleris.b-cdn.net/images/${path}`}
                        fill={true}
                />
                    </ImageDiv>
             
            </OverlayPanel>
            </div>
          
        </div>
    )
}





const FileUpload = ({ visible, setVisible, uploadedFiles, setUploadedFiles, onAdd }) => {
    
    const [state, setState] = useState({
        loading: false,
    })

    useEffect(() => {
        console.log(uploadedFiles)
    }, [uploadedFiles])

    const { getRootProps, getInputProps } = useDropzone({
        // ON drop add any new file added to the previous stat
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
        setState({ ...state, loading: true })
        //Turn the file into binary and use the uploadBunny function in utils to send it to bunny cdn
        
        for (let item of uploadedFiles) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                let result = await uploadBunny(arrayBuffer, item.name)
                console.log(result)
            };
            reader.readAsArrayBuffer(item.file);
        }
        setState({ ...state, loading: false })
        onAdd()
    };
    const removeImage = ({ path, name }) => {
        let newFiles = uploadedFiles.filter(file => file.path !== path)
        setUploadedFiles(newFiles)
    }

  
    
    return (
        <Dialog header="Uploader" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button {...getInputProps()} label="drag and drop" />
                <div className='border-round p-3 pointer-cursor border-1 border-dashed	'>
                    <i className="pi pi-image" style={{ fontSize: '2rem' }}></i>

                </div>

            </div>
            {uploadedFiles.map((item, index) => (
                <ImageItem 
                   fileItem={item} 
                    key={index} 
                    removeImage={removeImage} 
                    uploadedFiles={uploadedFiles} 
                    setUploadedFiles={setUploadedFiles}/>
            ))}
            {uploadedFiles.length ? (<Button loading={state.loading} label="submit" onClick={onSubmit}  className='mt-2' />) : null}
        </Dialog>


    );
};


const ImageItem = ({fileItem, index, removeImage, uploadedFiles,  setUploadedFiles}) => {
    const [localValue, setLocalValue] = useState(fileItem.name)
    const handleEdit = (e) => {
        setLocalValue(e.target.value)
        let newFiles = uploadedFiles.map(mapitem => {
            console.log(mapitem)
            if(mapitem.file.path === fileItem.file.path) {
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
        <InputText onChange={handleEdit}  className='w-full border-none' placeholder="Search" value={localValue} />
        <div className='flex bg-surface-200 align-items-center'>
            <i onClick={() => removeImage(file)} className="pi pi-trash text-surface-400  p-2 border-round cursor-pointer ml-1" style={{ fontSize: '1.2rem' }}></i>
        </div>
    </div>
    )
}


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

export default TopLayer