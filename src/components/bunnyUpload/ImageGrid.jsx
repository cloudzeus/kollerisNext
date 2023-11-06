import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDropzone } from 'react-dropzone';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { uploadBunny } from '@/utils/bunny_cdn';
import axios from 'axios';


const TopLayer = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])

    const fetchImages = () => {

    }

    return (
        <ImageGrid 
            data={data} 
            uploadedFiles={uploadedFiles} 
            setUploadedFiles={setUploadedFiles} 
        />
    )
}



const ImageGrid = ({uploadedFiles, setUploadedFiles, data}) => {
    const [visible, setVisible] = useState(false)

    

    const Header = () => {
        return (
            <div>
                <Button label="upload" onClick={() => setVisible(true)} />
                <FileUpload 
                    visible={visible} 
                    setVisible={setVisible} 
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                />
            </div>
        )
    }
    const header = Header()



    return (
        <DataTable
            value={data}
            tableStyle={{ minWidth: '50rem' }}
            header={header}
        >
            <Column field="imageURL" header="Φωτογραφία"></Column>
        </DataTable>

    )
}







const FileUpload = ({ visible, setVisible, uploadedFiles, setUploadedFiles }) => {
    
    const [state, setState] = useState({
        loading: false,
    })

    const handleAddImage = async () => {
        let imagesNames = [];
        for(let file of uploadedFiles) {
            imagesNames.push(file.name)
        }
        let {data} = await axios.post('/api/images', {action: 'product', id: '651bc00b65e267b6c9aa67f9', imagesURL: imagesNames})
        console.log(data)
    }



    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setUploadedFiles(prev => [...prev, ...acceptedFiles]);
        },
    });

    const removeImage = ({path, name}) => {
        console.log(path)
        let newFiles = uploadedFiles.filter(file => file.path !== path)
        setUploadedFiles(newFiles)
    }

    
    const onSubmit = async () => {
        setState({ ...state, loading: true })
        for(let file of uploadedFiles) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                let result = await uploadBunny(arrayBuffer, file.name)
                console.log(result)
            };
            reader.readAsArrayBuffer(file);
        }
        setState({ ...state, loading: false })
        handleAddImage()
    };
    return (
        <Dialog header="Uploader" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button {...getInputProps()} label="drag and drop" />
                <div className='border-round p-3 pointer-cursor border-1 border-dashed	'>
                    <i className="pi pi-image" style={{ fontSize: '2rem' }}></i>
                    
                </div>
              
            </div>
            {uploadedFiles.map((file, index) => (
                        <div className=' flex  justify-content-between p-2 border-round surface-200 mb-1 mt-2' key={file.name}>
                            <InputText  onChange={(e) => editImage(file, e.target.value)} className='w-full border-none' placeholder="Search" value={file.name} />
                            <div className='flex bg-surface-200 align-items-center'>
                             
                                <i onClick={() => removeImage(file)} className="pi pi-trash text-surface-400  p-2 border-round cursor-pointer" style={{ fontSize: '1.2rem' }}></i>
                            </div>
                        </div>
                    ))}
            <Button loading={state.loading} label="submit" onClick={onSubmit} className='mt-2' />
        </Dialog>


    );
};



export default TopLayer