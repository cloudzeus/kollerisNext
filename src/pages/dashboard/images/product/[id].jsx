import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ImageGrid } from '@/components/bunnyUpload/ImageGrid';
import { useRouter } from 'next/router';
import { deleteBunny } from '@/utils/bunny_cdn';
import { Toast } from 'primereact/toast';
import { toast } from 'react-toastify';
const ProductImagesComp = ({ id }) => {
    const router = useRouter();
    const toast = useRef(null);

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

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
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
        let bunny_res = await deleteBunny(name)
        if(bunny_res.HttpCode == 200 ) {
            showSuccess('Η φωτογραφία διαγράφηκε επιτυχώς')
        }
        console.log('bunny res')
        console.log(bunny_res)
        setRefetch(prev => !prev)
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