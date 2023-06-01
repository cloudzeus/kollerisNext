import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputStyled } from "@/components/Forms/FormInput";
import React from 'react'
import DialogContainer from "../Container/DialogContainer";
import { InputWhite } from "@/components/Forms/newInputs/Inputs";
import styled from "styled-components";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from "axios";

const Dialog = (props) => {
	const { register, handleSubmit, formState: { errors }, reset } = useForm({});
    const [selectedFile, setSelectedFile] = useState(null);

    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log('On Submit')
        console.log(selectedFile)
       
       
        
        //  axios.post(`${process.env.BASE_URL}/src/assets/imgs/`, selectedFile, {
        //   onUploadProgress: progressEvent => {
        //     console.log(progressEvent)
        //     const percentCompleted = Math.round(
        //       (progressEvent.loaded * 100) / progressEvent.total
        //     );
        //     console.log(`upload process: ${percentCompleted}%`);
        //   }
        // })
        //   .then(res => {
        //     console.log(res.data)
        //     console.log(res.data.url)
        //   })
        let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: data })
        console.log(res)
        props.setDataRefresh((prev) => !prev)
        props.setShow((prev) => !prev)
    }

    // const handleCrud = async (data, action) => {
    //     try {
    //         const res = await axios.post('/api/admin/users', { action: action, ...data })
    //         handleFetchUser()
    //         if (res.data.success) {
               
    //         }

    //         if (res.data.success == false) {
            
    //             toast.error(res.data.error)
    //             setError(res.data.error)
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
   
    return ( 
        <DialogContainer>
           	<form noValidate  >
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
                
                <UploadInput  
                title="λογότυπο"
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                />
                <button onClick={handleSubmit(onSubmit)}  type="submit">Save</button>
            </form>
         </DialogContainer>
    )
}




export default Dialog;