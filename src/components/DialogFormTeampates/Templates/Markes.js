import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputStyled } from "@/components/Forms/FormInput";
import React from 'react'
import DialogContainer from "../Container/DialogContainer";
import { InputWhite } from "@/components/Forms/newInputs/Inputs";
import styled from "styled-components";
const Dialog = ({handleClick}) => {
	const { register, handleSubmit, formState: { errors }, reset } = useForm({
		
	});

    const onSubmit = (data) => {
        handleCrud(data, 'add')
    }

    const handleCrud = async (data, action) => {
        try {
            const res = await axios.post('/api/admin/users', { action: action, ...data })
            handleFetchUser()
            if (res.data.success) {
               
            }

            if (res.data.success == false) {
            
                toast.error(res.data.error)
                setError(res.data.error)
            }
        } catch (e) {
            console.log(e)
        }
    }
   
    return ( 
        <DialogContainer>
           	<form noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputWhite
                        label="Όνομα"
                        name="firstName"
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
                        label="webSiteUrl"
                        name="firstName"
                        type="text"
                        register={register}
                        error={errors.firstName}
                    />
                <InputWhite
                        label="officialCatalogueUrl"
                        name="officialCatalogueUrl"
                        type="text"
                        register={register}
                        error={errors.firstName}
                    />
                <UploadInput  title="λογότυπο"/>
                <button type="submit" onClick={onSubmit}>Save</button>
            </form>
        </DialogContainer>
    )
}


const UploadInput = ({title}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
      };
    return (
        <UploadInputContainer >
            <p>{`Ανέβασμα ${title}`}</p>
            <input 
                type="file" 
                id="customFileUpload"
                onChange={handleFileChange}
                />
            <button onClick={() => document.getElementById('customFileUpload').click()}>Browse</button>
            <span>{selectedFile ? selectedFile.name : ''}</span>
        </UploadInputContainer>
    )
}

const UploadInputContainer = styled.div`
    p {
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 5px;
        letter-spacing: 0.7px;
    }
    button {
        background-color: #fff;
        padding: 10px;
    }
    input[type="file"] {
        display: none; 
    }
    span {
        font-size: 12px;
    }
`

export default Dialog;