
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import GallerySmall from '@/components/GalleryListSmall';
import { AddMoreInput } from '@/components/Forms/PrimeAddMultiple';
import axios from 'axios';
import styled from 'styled-components';
import PrimeUploads from '@/components/Forms/PrimeImagesUpload';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from 'react-redux';
import { setUploadImages, setLogo } from '@/features/upload/uploadSlice';



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



const addSchema = yup.object().shape({
	name: yup.string().required('Συμπληρώστε το όνομα'),
});


const AddDialog = ({ 
    dialog, 
    hideDialog, 
    submitted, 
    setSubmitted, 
    setDialog 
    }) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(addSchema),
    });
    const {uploadedImages, logo} = useSelector(state => state.upload)
    const [submitImages, setSubitImages] = useState(false);
    const [submitLogo, setSumbitLogo] = useState(false);
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])
 
    

  

    const handleAdd = async (data) => {
     
        let dataImages = []
        for(let i of uploadedImages) {
            dataImages.push({
                name: i,
                photosPromoUrl: i
            })
        }
        const body = {
            ...data,
            photosPromoList: dataImages,
            videoPromoList: videoList,
            logo: logo,
        }

        console.log('body')
        console.log(body)
        let res = await axios.post('/api/product/apiMarkes', {action: 'create', data: body})
        console.log('res')
        console.log(res);
        setSubmitted(true)
    }
    
    
   
    const productDialogFooter = (
        <>
            <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Αποθήκευση" icon="pi pi-check" type='submit' onClick={handleSubmit(handleAdd)} />
        </>
    );

  
    // const {brandDialog} = useSelector(state => state.brand)
    return (
        <form  noValidate>
        <Dialog 
            visible={dialog} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Προσθήκη Μάρκας" 
            modal 
            className="p-fluid" 
            footer={productDialogFooter} 
            onHide={hideDialog}>
            
            <Input
                label={'Όνομα'}
                name={'name'}
                required={true}
                mb={'10px'}
                register={register}
                error={errors.name}
            />
        
            <Input
                label={'Περιγραφή'}
                name={'description'}
                required={true}
                mb={'20px'}
                register={register}
            />

             <PrimeUploads 
                label='Λογότυπο'
                saveToState={setLogo}
                multiple={false}
                mb={'30px'}/>
            <AddMoreInput
                label="Video"
                htmlName1="name"
                htmlName2="videoUrl"
                setFormData={setVideoList}
                formData={videoList} 
                mb={'30px'}
                />

            <PrimeUploads 
                label={'Φωτογραφίες'} 
                saveToState={setUploadImages}
                multiple={true} 
                mb={'30px'}/>
            <FormTitle>Pim Access</FormTitle>
            <Input
                label={'Pim URL'}
                name={'pimURL'}
                required={true}
                mb={'20px'}
                register={register}
            />
            <Input
                label={'Pim Username'}
                name={'pimUserName'}
                required={true}
                mb={'20px'}
                register={register}
            />
            <Input
                label={'Pim Password'}
                name={'pimPassword'}
                required={true}
                mb={'20px'}
                register={register}
            />
            <FormTitle>Urls:</FormTitle>
            <Input
                label={'URL Ιστοσελίδας'}
                name={'webSiteUrl'}
                required={true}
                mb={'10px'}
                register={register}
            />
            <Input
                label={'URL Kαταλόγου'}
                name={'officialCatalogueUrl'}
                required={true}
                mb={'10px'}
                register={register}
            />
            <Input
                label={'URL facebook'}
                name={'facebookUrl'}
                required={true}
                mb={'10px'}
                register={register}
            />
            <Input
                label={'URL instagram'}
                name={'instagramUrl'}
                required={true}
                mb={'10px'}
                register={register}
            />

        </Dialog>
        </form>
    )

}

const FormTitle = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 15px;
    margin-top: 10px;
    position: relative;
    &:after {
        content: '';
        display: block;
        width: 20px;
        height: 3px;
        border-radius: 30px;
        position: absolute;
        left: 0;
        bottom: -7px;
        background-color: ${props => props.theme.palette.primary.main};
    }
`

export { EditDialog, AddDialog }
