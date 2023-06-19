import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React from 'react'
import axios from "axios";
import Button from "@/components/Buttons/Button";
import { InputVar1 } from "@/components/Forms/newInputs/InputClassic";
import { AddMoreInput } from "@/components/Forms/newInputs/AddMoreInput";
import { ImageInput } from "@/components/Forms/newInputs/ImageInput";
import FileDropzone from "@/components/Forms/newInputs/MultipleImageInput";
import { useSelector } from "react-redux";
import {toast} from 'react-toastify';
import { useDispatch } from "react-redux";
import { fetchNotSynced, setAction } from "@/features/grid/gridSlice";
import { setUploadImages, resetUploadImages} from "@/features/upload/uploadSlice";
import { useEffect } from "react";
import { GridContainer, FormWrapper } from "@/componentsStyles/grid/gridStyles";
import {MdOutlineKeyboardBackspace} from 'react-icons/md';

const registerSchema = yup.object().shape({
	name: yup.string().required('Συμπληρώστε το όνομα'),
});




export const FormAdd = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(registerSchema),
    });
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const {uploadedImages} = useSelector((state) => state.upload);
    console.log(uploadedImages)
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])

   useEffect(() => {
         dispatch(resetUploadImages())
   }, [dispatch])


    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log('data')
        console.log(data)
        let dataImages = [{
            name: '',
            photosPromoUrl: ''
            
        }]
        for(let i of uploadedImages) {
            dataImages.push({
                name: i,
                photosPromoUrl: i
            })
        }
        
        let body = {
            ...data,
            logo: selectedFile,
            videoPromoList: videoList,
            photosPromoList: dataImages
        }
       

        let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: body})
        await axios.post('/api/admin/markes/markes', { action: 'sync'})
        if(res.data.success) {
            dispatch(setAction(null))
            // dispatch(fetchNotSynced())
            toast.success('Επιτυχής προσθήκης μάρκας')
            

        } else {
            toast.error('Aποτυχία προσθήκης μάρκας')
        }
 
    }

    return (
        // grid-form-styles-form : /components/Grids/GridMarkes/styles.js
        <FormWrapper  noValidate  >
            <h2 className="grid-form_header">Προσθήκη Μάρκας</h2>
            <GridContainer>
                <InputVar1
                    label="Όνομα"
                    name="name"
                    type="text"
                    register={register}
                    error={errors.name}
                    required={true}
                />
                <InputVar1
                    label="Περιγραφή"
                    name="description"
                    type="text"
                    register={register}
                />
            </GridContainer>
            <GridContainer>

            </GridContainer>
            <GridContainer>
                <InputVar1
                    label="Facebook URL"
                    name="facebookUrl"
                    type="text"
                    register={register}
                />
                <InputVar1
                    label="Instagram URL"
                    name="instagramUrl"
                    type="text"
                    register={register}
                />

            </GridContainer>
            <GridContainer>
            <InputVar1
                label="Official Catalogue URL"
                name="officialCatalogueUrl"
                type="text"
                register={register}
            />
            <InputVar1
                label="Webiste URL"
                name="webSiteUrl"
                type="text"
                register={register}
            />

            </GridContainer>
            
            < ImageInput 
                // required={true}
                label={'Λογότυπο'}
                setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
            />
            <h2 className="grid-form_subheader">Softone</h2>
            {/* <InputVar1
                    label="ΟΝΟΜΑ"
                    name="softOneName"
                    type="text"
                    register={register}
                /> */}
            {/* <GridContainer >
                <InputVar1
                    label="MTRMARK"
                    name="MTRMARK"
                    type="text"
                    required={true}
                    register={register}
                />
                
               
            </GridContainer>
            <GridContainer >
            <InputVar1
                    label="CODE"
                    name="CODE"
                    type="text"
                    register={register}
                />
                <InputVar1
                    label="SODCODE"
                    name="SODCODE"
                    type="text"
                    register={register}
                />
               
            </GridContainer>
            <InputVar1
                    label="COMPANY"
                    name="COMPANY"
                    type="text"
                    register={register}
                /> */}

            <h2 className="grid-form_subheader">Pim access</h2>
            <GridContainer>
                <InputVar1
                    label="pimUrl"
                    name="pimUrl"
                    type="text"
                    register={register}
                />
                <InputVar1
                    label="pimUserName"
                    name="pimUserName"
                    type="text"
                    register={register}
                />
            </GridContainer>
            <InputVar1
                label="pimPassword"
                name="pimPassword"
                type="text"
                register={register}
            />
           <div>
           <h2 className="grid-form_subheader">Βίντεο</h2>
            <AddMoreInput  
                label="Video"
                htmlName1="name"
                htmlName2="videoUrl"
                setFormData={setVideoList}
                formData={videoList} />
           </div>
           <h2 className="grid-form_subheader">Φωτογραφίες Προϊόντος</h2>
           <FileDropzone />
            <div className="grid-form_buttondiv">
                <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
                <button
                    className="grid-form_back" 
                    onClick={() => dispatch(setAction(null))} >
                    <MdOutlineKeyboardBackspace />
                </button>
            </div>
          
        </FormWrapper>
    )
}







