'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ImageGrid } from '@/components/bunnyUpload/ImageGrid';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { setSubmitted } from '@/features/productsSlice';
import { useDispatch } from 'react-redux';


const ProductImagesComp = ({ id }) => {
    const router = useRouter();
    const toast = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(false)
    const dispatch = useDispatch();

    const createImagesURL = (files) => {
        let imagesNames = [];
        for (let file of files) {
            imagesNames.push({ name: file.name })
        }
        return imagesNames;
    }

   
    const handleFetch = async () => {
        console.log('fetch again')
        setLoading(true)
        let { data } = await axios.post('/api/product/apiProduct', { action: "getImages", id: id })
  
        let images = data.result
        setData(images)
        setLoading(false)
    }

    const onDelete = async (name, _id) => {
        //THis is not the product id but the image id
        let { data } = await axios.post('/api/product/apiProduct', { action: "deleteImage", parentId: id, imageId: _id, name: name })
        console.log(data)
        setRefetch(prev => !prev)
        dispatch(setSubmitted())
    }

    const onAdd = async () => {
        let imagesURL = createImagesURL(uploadedFiles)
        let { data } = await axios.post('/api/product/apiProduct', { action: 'addImages', id: id, imagesURL: imagesURL })
        console.log('data')
        console.log(data)
        setRefetch(prev => !prev)
        
        return data;
    }


    useEffect(() => {
        handleFetch()
    }, [refetch])
    return (
       <>
       <Toast ref={toast} />
         <ImageGrid
            width={'1200px'}
            data={data}
            loading={loading}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onDelete={onDelete}
            onAdd={onAdd}

        />
       </>

    )
}

export default ProductImagesComp