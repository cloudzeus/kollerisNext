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


const UploadInput = ({title, selectedFile, setSelectedFile}) => {

    const handleFileChange = () => {
        let fileEl = document.getElementById('customFileUpload');
        let file = fileEl.files[0];
        setSelectedFile(file);

      };

      const handleClick = (e) => {
        e.preventDefault()
        document.getElementById('customFileUpload').click()
      }

     

    return (
        <UploadInputContainer >
            <p>{`Ανέβασμα ${title}`}</p>
            <input 
                type="file" 
                id="customFileUpload"
                onChange={handleFileChange}
                />
           
            <button onClick={handleClick}>
                <AddPhotoAlternateIcon />
            </button>
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
        background-color: transparent;
        border: none;

    }
    input[type="file"] {
        display: none; 
    }
    span {
        font-size: 12px;
    }

    svg {
        color: ${({theme}) => theme.palette.primary.main};
        transition: all 0.3s ease-in-out;
    }
    svg:active {
        scale: 0.9;
    }
`

export default Dialog;