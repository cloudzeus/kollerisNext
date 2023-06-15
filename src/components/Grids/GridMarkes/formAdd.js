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
import { GridContainer } from "@/componentsStyles/grid/gridStyles";

const registerSchema = yup.object().shape({
	name: yup.string().required('Συμπληρώστε το όνομα'),
	MTRMARK: yup.string().required('Συμπληρώστε την Μάρκα'),
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
        let dataImages = []
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
        console.log('-------- body ----------')
        console.log(body)   

        let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: body})
        await axios.post('/api/admin/markes/markes', { action: 'sync'})
        if(res.data.success) {
            
            dispatch(setAction(null))
            dispatch(fetchNotSynced())
            toast.success('Επιτυχής προσθήκης μάρκας')
            

        } else {
            toast.error('Aποτυχία προσθήκης μάρκας')
        }
 
    }

    return (
        // grid-form-styles-form : /components/Grids/GridMarkes/styles.js
        <form className="grid-styles-form" noValidate  >
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
                required={true}
                label={'Λογότυπο'}
                setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
            />
            <h2>SOFTONE Info</h2>
            <GridContainer >
                <InputVar1
                    label="MTRMARK"
                    name="MTRMARK"
                    type="text"
                    required={true}
                    register={register}
                />
                <InputVar1
                    label="ΟΝΟΜΑ"
                    name="NAME"
                    type="text"
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
                />

            <h2>Pim Access</h2>
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
              <h2>Βίντεο Προϊόντος</h2>
            <AddMoreInput  
                label="Video"
                htmlName1="name"
                htmlName2="videoUrl"
                setFormData={setVideoList}
                formData={videoList} />
           </div>
            <h2>Φωτογραφίες Προϊόντος</h2>
           <FileDropzone />
            <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
        </form>
    )
}







