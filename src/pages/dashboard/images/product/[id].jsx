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
import { ImageGrid } from '@/components/bunnyUpload/ImageGrid';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
const TopLayer = () => {
    const router = useRouter();
    const { id } = router.query;
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)

    const createImagesURL =  (files) => {
        let imagesNames = [];
        for (let file of files) {
            imagesNames.push({name: file.name})
        }
        return imagesNames;
    }



    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProduct', { action: "getImages", id: id })
        let images = data.result
        setData(images)
    }

    const onDelete = async (name) => {
        let { data } = await axios.post('/api/product/apiProduct', { action: "deleteImage", id:id, name: name })
        setRefetch(prev => !prev)
    }

    const onAdd = async () => {
        let imagesURL = createImagesURL(uploadedFiles)
        let { data } = await axios.post('/api/product/apiProduct', { action: 'addImages', id: id, imagesURL: imagesURL})
         setRefetch(prev => !prev)
        return data;
    }


    useEffect(() => {
        handleFetch()
    }, [id, refetch])
    return (
        <AdminLayout>
            <Button className='mb-3' icon="pi pi-arrow-left" label="Πίσω" onClick={() => router.back()} />
              <ImageGrid
            data={data}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onDelete={onDelete}
            onAdd={onAdd}
            
        />
        </AdminLayout>
      
    )
}









export default TopLayer