import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React from 'react'
import { InputWhite } from "@/components/Forms/newInputs/Inputs";
import styled from "styled-components";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from "axios";

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
        <InputWhite
            label="Όνομα"
            name="name"
            type="text"
            register={register}
        />
        <InputWhite
            label="Περιγραφή"
            name="description"
            type="text"
            register={register}
        />
        <InputWhite
            label="logo"
            name="logo"
            type="text"
            register={register}
        />
        <InputWhite
            label="softOneMTRMARK"
            name="softOneMTRMARK"
            type="text"
            register={register}
        />

        {/* <UploadInput  
    title="λογότυπο"
    selectedFile={selectedFile}
    setSelectedFile={setSelectedFile}
    /> */}
        <button onClick={handleSubmit(onSubmit)} type="submit">Save</button>
    </form>
    )
}

