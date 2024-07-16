'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ImageGrid } from '@/components/bunnyUpload/ImageGrid';
import { useToast } from '@/_context/ToastContext';


const ProductImagesComp = ({ id }) => {
    const {showMessage} = useToast();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(false)

    const createImagesURL = (files) => {
        let imagesNames = [];
        for (let file of files) {
            imagesNames.push({ name: file.name })
        }
        return imagesNames;
    }

   
    const handleFetch = async () => {
        setLoading(true)
        try {
            let { data } = await axios.post('/api/product/apiProduct', { action: "getImages", id: id })
            let images = data.result
            setData(images)
        } catch(e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e?.response?.data?.message || e.message
            })
        } finally {
            setLoading(false)
        }
       
    }

    const onDelete = async (name, _id) => {
        try {
            let { data } = await axios.post('/api/product/apiProduct', { action: "deleteImage", parentId: id, imageId: _id, name: name })
            showMessage({
                severity: "success",
                summary: "Επιτυχία",
                message: data?.message || "Η διαγραφή έγινε με επιτυχία"
            })
        } catch (e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e?.response?.data?.message || e.message
            })
        } finally {
            setRefetch(prev => !prev)

        }
       
    
    }

    const onAdd = async () => {
        let imagesURL = createImagesURL(uploadedFiles)
        let { data } = await axios.post('/api/product/apiProduct', { action: 'addImages', id: id, imagesURL: imagesURL })
        setRefetch(prev => !prev)
        setUploadedFiles([])
        return data;
    }


    useEffect(() => {
        handleFetch()
    }, [refetch])
    return (
         <ImageGrid
            width={'1000px'}
            data={data}
            loading={loading}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onDelete={onDelete}
            onAdd={onAdd}
        />

    )
}

export default ProductImagesComp