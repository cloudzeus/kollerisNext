'use client'
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
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Divider } from '@/componentsStyles/dialogforms';
import { resetGridRowData } from '@/features/grid/gridSlice';

const EditDialog = ({dialog, hideDialog, setSubmitted }) => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([])
    const [logo, setLogo] = useState([])
    const toast = useRef(null);
    const {gridRowData} = useSelector(store => store.grid)
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });

    console.log('gridRowData')
    console.log(gridRowData)
    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
      }, [gridRowData, reset]);

  
    const [videoList, setVideoList] = useState(gridRowData?.videoPromoList)
    useEffect(() => {
        setVideoList(gridRowData?.videoPromoList)
        //handle images:
        let newArray = []
        if(gridRowData?.photosPromoList && gridRowData?.photosPromoList.length > 0) {

            for(let image of gridRowData?.photosPromoList) {
                newArray.push(image.photosPromoUrl)    
            }
            setImages(newArray)
        }
    }, [gridRowData])


    const handleEdit = async (data) => {
      
        const object = {
            ...data,
            videoPromoList: videoList,
            logo: logo[0]
        }

        try {
            let resp = await axios.post('/api/product/apiMarkes', {action: "update", data: object, id: gridRowData._id, mtrmark: gridRowData?.softOne?.MTRMARK})
                if(!resp.data.success) {
                    showError()
                }
                if(resp.data.success) {
                    showSuccess()
                    setSubmitted(true)
                }
               
        } catch (e) {
            console.log(e)
        }
       
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }


    const handleClose = () => {
        dispatch(resetGridRowData())
        hideDialog()
    }

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Ακύρωση" icon="pi pi-times" severity="info"  outlined onClick={handleClose} />
            <Button label="Αποθήκευση" icon="pi pi-check" severity="info"  onClick={handleSubmit(handleEdit)} />
        </React.Fragment>
    );

    return (
        <form>
            <Toast ref={toast} />
              <Dialog 
                visible={dialog} 
                style={{ width: '32rem', maxWidth: '80rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Διόρθωση Προϊόντος" 
                modal 
                className="p-fluid" 
                footer={productDialogFooter} 
                onHide={hideDialog}
                maximizable 
                >
            <FormTitle>Λεπτομέριες</FormTitle>     
            <Input
                label={'Όνομα'}
                name={'name'}
                required={true}
                register={register}
                defaultValue={gridRowData.name}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                required={true}
                register={register}
                defaultValue={gridRowData.description}
            />
             < Divider />
             <FormTitle>Λογότυπο	</FormTitle>
              <PrimeUploads
                    setState={setLogo}
                    multiple={false}
                    // mb={'30px'}
                    />
            < Divider />
            <FormTitle>Φωτογραφίες</FormTitle>
            <GallerySmall  
                images={images}
                updateUrl={'/api/product/apiImages'}
                id={gridRowData._id}
            />
             < Divider />
              <FormTitle>Βίντεο</FormTitle>
             <AddMoreInput
                    setFormData={setVideoList}
                    formData={videoList}
                    mb={'30px'}
                />
                  < Divider />
                 <FormTitle>Pim Access:</FormTitle>
                 <Input
                label={'Pim url:'}
                name={'pimAccess.pimUrl'}
                required={true}
                register={register}
                defaultValue={gridRowData?.pimAccess?.pimUrl}
                />
                 <Input
                label={'Pim url:'}
                name={'pimAccess.pimUserName'}
                required={true}
                register={register}
                defaultValue={gridRowData?.pimAccess?.pimUserName}
                />
                 <Input
                label={'Pim url:'}
                name={'pimAccess.pimPassword'}
                required={true}
                register={register}
                defaultValue={gridRowData?.pimAccess?.pimPassword}
                />
                 < Divider />
                <FormTitle>Url</FormTitle>
                <Input
                label={'Url Ιστοσελίδας:'}
                name={'websSiteUrl'}
                required={true}
                register={register}
                defaultValue={gridRowData?.webSiteUrl}
                />
                <Input
                label={'Url Καταλόγου:'}
                name={'officialCatalogueUrl'}
                required={true}
                register={register}
                defaultValue={gridRowData?.officialCatalogueUrl}
                />
                <Input
                label={'Url Facebook:'}
                name={'facebookUrl'}
                required={true}
                register={register}
                defaultValue={gridRowData?.facebookUrl}
                />
                <Input
                label={'Url Instagram:'}
                name={'instagramUrl'}
                required={true}
                register={register}
                defaultValue={gridRowData?.instagramUrl}
                />
           
        </Dialog>
        </form>
    )
}



const addSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
});


const AddDialog = ({
    dialog,
    hideDialog,
    setSubmitted,
}) => {
   

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(addSchema),
    });
    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
    const [logo, setLogo] = useState('')
    const [images, setImages] = useState([])
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])





    const handleAdd = async (data) => {
        setDisabled(false)
        let dataImages = []
        for (let i of images) {
            dataImages.push({
                name: i,
                photosPromoUrl: i
            })
        }
        const body = {
            ...data,
            photosPromoList: dataImages,
            videoPromoList: videoList,
            logo: logo[0],
        }

        console.log('body')
        console.log(body)
        let res = await axios.post('/api/product/apiMarkes', { action: 'create', data: body })
        console.log('res data:')
        console.log(res.data)
            if(!res.data.success) return showError(res.data.softoneError)
            setDisabled(true)
            setSubmitted(true)
            showSuccess()
    
       
    }



    const productDialogFooter = (
        <>
            <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Αποθήκευση" icon="pi pi-check" type='submit' onClick={handleSubmit(handleAdd)} disabled={disabled}/>
        </>
    );

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης : ' + message, life: 5000 });
    }

    // const {brandDialog} = useSelector(state => state.brand)
    return (
        <form noValidate>
              <Toast ref={toast} />
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
                    // saveToState={setLogo}
                    setState={setLogo}
                    multiple={false}
                    mb={'30px'} />
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
                    setState={setImages}
                    multiple={true}
                    mb={'30px'} />
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





export { EditDialog, AddDialog }
