import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import * as yup from "yup";
import React from 'react'
import Button from "@/components/Buttons/Button";
import { InputVar1 } from "@/components/Forms/newInputs/InputClassic";
import { useSelector } from "react-redux";
import { ImageInput } from "@/components/Forms/newInputs/ImageInput";
import YupForm from "@/components/Forms/YupForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { AddMoreInput } from "@/components/Forms/newInputs/AddMoreInput";
import FileDropzone from "@/components/Forms/newInputs/MultipleImageInput";
import { setUploadImages, resetUploadImages } from "@/features/upload/uploadSlice";
import axios from "axios";
import { GridContainer, FormWrapper } from "@/componentsStyles/grid/gridStyles";
import { toast } from 'react-toastify';
import { setAction } from "@/features/grid/gridSlice";
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

const registerSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
    description: yup.string().required('Συμπληρώστε το επώνυμο'),

});




export const FormEdit = () => {
    const { gridRowData } = useSelector(state => state.grid)
    const { uploadedImages } = useSelector(state => state.upload)
    console.log('ON edit upload imagese ' + JSON.stringify(uploadedImages))
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            _id: gridRowData?._id,
            name: gridRowData?.name,
            description: gridRowData?.description,
            facebookUrl: gridRowData?.facebookUrl,
            instagramUrl: gridRowData?.instagramUrl,
            officialCatalogueUrl: gridRowData?.officialCatalogueUrl,
            softOneMTRMARK: gridRowData?.softOne?.MTRMARK,
            softOneName: gridRowData?.softOne?.NAME,
            softOneCode: gridRowData?.softOne?.CODE,
            softOneSODCODE: gridRowData?.softOne?.SODCODE,
            softOneISACTIVE: gridRowData?.softOne?.ISACTIVE,
            pimUrl: gridRowData?.pimAccess?.pimUrl,
            pimUserName: gridRowData?.pimAccess?.pimUserName,
            pimPassword: gridRowData?.pimAccess?.pimPassword,

        }
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const [videoList, setVideoList] = useState([
        {
            name: '',
            videoUrl: ''
        }
    ]);


    useEffect(() => {
        let array = [];
        dispatch(resetUploadImages())
        for (let element of gridRowData.photosPromoList) {
            array.push(element.photosPromoUrl)
        }

        dispatch(setUploadImages(array))
        if (gridRowData?.photosPromoList?.photosPromoUrl) {
            dispatch(setUploadImages(gridRowData.photosPromoList.photosPromoUrl))
        }

        if (gridRowData.videoPromoList.length < 1) {
            setVideoList([{
                name: '',
                videoUrl: ''
            }])
        } else {
            setVideoList([...gridRowData?.videoPromoList])
        }

        setSelectedFile(gridRowData?.logo)

    }, [dispatch, gridRowData])





    const onSubmit = async (data, event) => {
        event.preventDefault();
      
        let dataImages = []
        for(let i of uploadedImages) {
            dataImages.push({
                name: i,
                photosPromoUrl: i
            })
        }
        

        let dataObj = {
            ...data,
            logo: selectedFile,
            videoPromoList: videoList,
            photosPromoList: dataImages,

        }



        let res = await axios.post('/api/admin/markes/markes', { action: 'update', data: dataObj })
        if(res.data.success) {
            toast.success('Η μάρκα ενημερώθηκε επιτυχώς')
            dispatch(setAction(null))
        } else {
            toast.error('Κάτι πήγε στραβά')
        }
       

    }



    return (
        // grid-form-styles-form : /components/Grids/GridMarkes/styles.js
        <div>
            < FormWrapper noValidate>
                <div>
                    <h2 className="grid-form_header">Διόρθωση Μάρκας</h2>
                </div>
                <GridContainer>
                    <InputVar1
                        label="Όνομα"
                        name="name"
                        type="text"
                        register={register}
                        error={errors.name}
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
                        label="URL facebook"
                        name="facebookUrl"
                        type="text"
                        register={register}
                    />
                    <InputVar1
                        label="URL Instagram"
                        name="instagramUrl"
                        type="text"
                        register={register}
                    />

                </GridContainer>
                <GridContainer>
                    <InputVar1
                        label="URL Official Καταλόγου"
                        name="officialCatalogueUrl"
                        type="text"
                        register={register}
                    />
                    <InputVar1
                        label="URL Ιστοσελίδας"
                        name="webSiteUrl"
                        type="text"
                        register={register}
                    />

                </GridContainer>
                <h2 className="grid-form_subheader">Softone</h2>
                <InputVar1
                    label="softOneName"
                    name="softOneName"
                    type="text"
                    register={register}
                />

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
                <GridContainer>

                    <ImageInput
                        label="Λογότυπο"
                        logo={gridRowData?.logo}
                        setSelectedFile={setSelectedFile}
                        selectedFile={selectedFile}
                        mb={'20px'}
                        edit={true}
                    />
                </GridContainer>
                <div>
                    <h2 className="grid-form_subheader">Βίντεο</h2>
                    <AddMoreInput
                        label="Video"
                        htmlName1="name"
                        htmlName2="videoUrl"
                        setFormData={setVideoList}
                        formData={videoList}
                    />
                </div>
                
                <h2 className="grid-form_subheader">Φωτογραφίες Μάρκας</h2>
                <FileDropzone />
                <div className="grid-form_buttondiv">
                <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Διόρθωση Νέου</Button>
                <button
                    className="grid-form_back" 
                    onClick={() => dispatch(setAction(null))} >
                    <MdOutlineKeyboardBackspace />
                </button>
            </div>
            </FormWrapper>
        </div>
    )
}








