import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'primereact/button';

import axios from 'axios';

import { ImageGrid } from '@/components/bunnyUpload/ImageGrid';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
const TopLayer = () => {
    const router = useRouter();
    const { id } = router.query;
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(false)

    const createImagesURL =  (files) => {
        let imagesNames = [];
        for (let file of files) {
            imagesNames.push({name: file.name})
        }
        return imagesNames;
    }



    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/product/apiProduct', { action: "getImages", id: id })
        let images = data.result
        setData(images)
        setLoading(false)
    }

    const onDelete = async (name, _id) => {
        //THis is not the product id but the image id
        let { data } = await axios.post('/api/product/apiProduct', { action: "deleteImage", parentId:id, imageId :_id, name: name })
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
            loading={loading}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onDelete={onDelete}
            onAdd={onAdd}
            
        />
        </AdminLayout>
      
    )
}









export default TopLayer