import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import * as yup from "yup";
import React from 'react'
import styled from "styled-components";
import Button from "@/components/Buttons/Button";
import { InputVar1 } from "@/components/Forms/newInputs/InputClassic";
import { useSelector } from "react-redux";
import { ImageInput } from "@/components/Forms/newInputs/ImageInput";
import YupForm from "@/components/Forms/YupForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { AddMoreInput } from "@/components/Forms/newInputs/AddMoreInput";
import FileDropzone from "@/components/Forms/newInputs/MultipleImageInput";
import { setUploadImages } from "@/features/upload/uploadSlice";

const registerSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
    description: yup.string().required('Συμπληρώστε το επώνυμο'),

});




export const FormEdit = () => {
    const { gridRowData, gridSelectedFile} = useSelector(state => state.grid)
    const dispatch = useDispatch();
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])
   

    useEffect(() => {
        let array = [];
        for(let element of gridRowData.photosPromoList) {
            array.push(element.photosPromoUrl)
            dispatch(setUploadImages(array))
        }
        if(gridRowData?.photosPromoList?.photosPromoUrl) { 
            dispatch(setUploadImages(gridRowData.photosPromoList.photosPromoUrl))
        }
      
        if(gridRowData.videoPromoList.length  < 1) {
            setVideoList([{
                name: '',
                videoUrl: ''
            }])
        } else {
            setVideoList([...gridRowData?.videoPromoList])
        }
     
    }, [])
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
            logo: gridRowData?.logo,

        }
    });
    const [selectedFile, setSelectedFile] = useState(null);




    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log('videoList')
        console.log(videoList)

        // let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: {...data, ...formData, logo: selectedFile ? selectedFile.name : ''} })
        // let res = await axios.post('/api/admin/markes/markes', { action: 'create' })
        // console.log('------------------------- Res --------------------------')
        // console.log(res)

    }



    return (
        // grid-form-styles-form : /components/Grids/GridMarkes/styles.js
        <div>
            <YupForm className="grid-styles-form">
                <div>
                    <span></span>
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
                        label="Facebook Url"
                        name="facebookUrl"
                        type="text"
                        register={register}
                    />
                    <InputVar1
                        label="Instagram Url"
                        name="instagramUrl"
                        type="text"
                        register={register}
                    />

                </GridContainer>
                <InputVar1
                    label="officialCatalogueUrl"
                    name="officialCatalogueUrl"
                    type="text"
                    register={register}
                />

                <h2>SoftOne Info</h2>
                <GridContainer >
                    <InputVar1
                        label="MTRMARK"
                        name="softOneMTRMARK"
                        type="text"
                        register={register}
                    />
                    <InputVar1
                        label="softOneName"
                        name="softOneName"
                        type="text"
                        register={register}
                    />

                </GridContainer>
                <GridContainer >
                    <InputVar1
                        label="softOneCode"
                        name="softOneCode"
                        type="text"
                        register={register}
                    />
                    <InputVar1
                        label="softOneSODCODE"
                        name="softOneSODCODE"
                        type="text"
                        register={register}
                    />

                </GridContainer>

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
                    <h2>Βίντεο Προϊόντος</h2>
                    <AddMoreInput
                        label="Video"
                        htmlName1="name"
                        htmlName2="videoUrl"
                        setFormData={setVideoList}
                        formData={videoList}
                        />
                </div>
                <FileDropzone />
                <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
            </YupForm>
        </div>
    )
}



const GridContainer = styled.div`
    display: grid;
    grid-template-columns: ${props => props.repeat ? `repeat(${props.repeat}, 1fr)` : 'repeat(2, 1fr)'} ;
    grid-column-gap: 30px;
    @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
    }
`




