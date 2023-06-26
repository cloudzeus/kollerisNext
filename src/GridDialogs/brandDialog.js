
import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import ImageUploads from '@/components/Forms/PrimeImagesUpload';
import Gallery from '@/components/GalleryList';
import GallerySmall from '@/components/GalleryListSmall';
import UploadFiles from '@/components/uploadFiles';
import { AddMoreInput } from '@/components/Forms/PrimeAddMultiple';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import styled from 'styled-components';
import axios from 'axios';
import PrimeUploads from '@/components/Forms/PrimeImagesUpload';

const EditDialog = ({ data, dialog, hideDialog, saveProduct, submitted, setData }) => {
    console.log(data)
    console.log('brand data: ' + JSON.stringify(data))


    const onInputChange = (e) => {
        const { name, value } = e.target;

        //      setData(prev => ({}))
        setData(prev => ({ ...prev, [name]: value }))
    }


    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );

    return (
        <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <Input
                label={'Name'}
                name={'name'}
                value={data.name}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <GallerySmall />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
        </Dialog>
    )
}


const AddDialog = ({ dialog, hideDialog, submitted, setSubmitted, setDialog }) => {
    const [data, setData] = useState({
        name: '',
        description: '',
    })
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])


    const onInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleAdd = () => {
        console.log('add')
        console.log(data)
        console.log('videoList')
        console.log(videoList)
        console.log()
        setSubmitted(true)
        setDialog(false)
    }

   
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={handleAdd} />
        </React.Fragment>
    );

  
    // const {brandDialog} = useSelector(state => state.brand)
    return (
        <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <Input
                label={'Όνομα'}
                name={'name'}
                value={data.name}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <AddMoreInput
                label="Video"
                htmlName1="name"
                htmlName2="videoUrl"
                setFormData={setVideoList}
                formData={videoList} />
            <PrimeUploads />
                

        </Dialog>
    )

}



export { EditDialog, AddDialog }
