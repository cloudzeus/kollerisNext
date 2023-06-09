import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React from 'react'
import styled from "styled-components";

import axios from "axios";
import Button from "@/components/Buttons/Button";
import { InputVar1 } from "@/components/Forms/newInputs/InputClassic";
import { AddMoreInput } from "@/components/Forms/newInputs/AddMoreInput";

export const FormAdd = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({});
    const [selectedFile, setSelectedFile] = useState(null);

    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])
    const [photoList, setPhotoList] = useState({
        name: '',
        videoUrl: ''
    })
    console.log(videoList)

    const onSubmit = async (data, event) => {
        event.preventDefault();
       

        // let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: {...data, ...formData, logo: selectedFile ? selectedFile.name : ''} })
        let res = await axios.post('/api/admin/markes/markes', { action: 'create'})
     
 
    }

    return (
        <form className="form" noValidate  >
            <GridContainer>
                <InputVar1
                    label="Όνομα"
                    name="name"
                    type="text"
                    register={register}
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
                    label="softOneMTRMARK"
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
            <GridContainer >
                <InputVar1
                    label="softOneISACTIVE"
                    name="softOneISACTIVE"
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
                {/* <UploadInput
                    title="λογότυπο"
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                /> */}
            </GridContainer>
            {/* <h2>VideoPromoList</h2>
            <AddMoreInput  
                label="Video"
                attr1="name"
                attr2="videoUrl"
                objName="videoPromoList" 
                setFormData={setFormData} 
                formData={formData} />
           */}
           <div>
              <h2>VideoPromoList</h2>
            <AddMoreInput  
                label="Video"
                htmlName1="name"
                htmlName2="videoUrl"
                setFormData={setVideoList}
                formData={videoList} />
           </div>
            <h2>PhotosPromoList</h2>
            <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
        </form>
    )
}






const GridContainer = styled.div`
    display: grid;
    height: auto;
    grid-template-columns: ${props => props.repeat ? `repeat(${props.repeat}, 1fr)` : 'repeat(2, 1fr)'};
    grid-column-gap: 30px;
    @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
    }
`


