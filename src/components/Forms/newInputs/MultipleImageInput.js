import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import styled from 'styled-components'
import axios from "axios";



const FileDropzone = () => {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            console.log(acceptedFiles)
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const Thumbs = files.map((file, index) => {
        console.log(index)
        return (
            <div>
                <Image
                src={file.preview}
                alt="mountain"
                width={40}
                height={40}
                priority={false}
                sizes="40px"   />
                <button onClick={(e) => handleDeleteImg(e, index)}>delete</button>
            </div>
        )
    });

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        console.log(files)
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const handleDeleteImg = (e, index) => {
        e.preventDefault()
    }
    const handleUpload = async (e) => {
        console.log(files[0])
        e.preventDefault()
        const formData = new FormData();
        formData.append("myFile", files[0]);
        const { data } = await axios.post("/api/saveImages", formData);
    }

    return (
        <Container >
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <div className="upload-dragndrop-images">
                {Thumbs}
            </div>
            <button 
                onClick={handleUpload}
                type="submit">
                upload
            </button>
        </Container>
    )

}


const Container = styled.div`
    .upload-dragndrop-images {
        
    }
`
export default FileDropzone;