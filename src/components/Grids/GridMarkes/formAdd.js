import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React from 'react'
import styled from "styled-components";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import UploadInput from "../Comps/UploadInput";
import Button from "@/components/Buttons/Button";
import { InputVar1 } from "@/components/Forms/newInputs/InputClassic";
export const FormAdd = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({});
    const [selectedFile, setSelectedFile] = useState(null);

    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log('On Submit')
        console.log(selectedFile)


        let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: data })
        console.log(res)
        // props.setDataRefresh((prev) => !prev)
        // props.setShow((prev) => !prev)
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
                <GridContainer repeat={4}> 
                    <InputVar1
                        label="softOneSODCODE"
                        name="softOneSODCODE"
                        type="text"
                        register={register}
                    />
                     <InputVar1
                        label="softOneName"
                        name="softOneName"
                        type="text"
                        register={register}
                    />
                    <InputVar1
                        label="softOneCode"
                        name="softOneCode"
                        type="text"
                        register={register}
                    />
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
                <UploadInput
                    title="λογότυπο"
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
                </GridContainer>
                <h2>VideoPromoList</h2>
                <AddMoreInput />
                <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
            </form>
    )
}

const AddMoreInput = () => {
    return (
        <AddMoreInputContainer>
            <input type="text" placeholder="URL:" />
            <AddIcon />
        </AddMoreInputContainer>
    )
}


const borderColor = '#e8e8e8'
const AddMoreInputContainer = styled.div`
    width: 100%;
    height: 40px;
    display:  flex;
    /* background-color: pink; */
   input {
    height: 40px;
    padding: 10px;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    width: 90%;
    height: 100%;
   }
   svg {
    border: 1px solid ${borderColor};
    border-radius: 4px;
    padding: 10px;
    height: 100%;
    width: 30px;
    margin-left: 10px;
    font-size: 20px;
   }

`

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: ${props => props.repeat ? `repeat(${props.repeat}, 1fr)` : 'repeat(2, 1fr)'} ;
    grid-gap: 30px;

    @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
    }
`


