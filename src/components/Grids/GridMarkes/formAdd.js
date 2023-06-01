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
import theme from "@/theme/theme";
import CloseIcon from '@mui/icons-material/Close';

export const FormAdd = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        videoPromoList: [{
            name: '',
            videoUrl: ''
        }],
        photosPromoList: [{
            name: '',
            photoUrl: ''
        }],

    })

    console.log(formData)
    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log('On Submit')
        console.log(data)
        console.log(selectedFile)

        // let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: {...data, ...formData, logo: selectedFile ? selectedFile.name : ''} })
        let res = await axios.post('/api/admin/markes/markes', { action: 'create'})
        console.log('------------------------- Res --------------------------')
        console.log(res)
 
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
                <UploadInput
                    title="λογότυπο"
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
            </GridContainer>
            <h2>VideoPromoList</h2>
            <AddMoreInput  
                label="Video"
                attr1="name"
                attr2="videoUrl"
                objName="videoPromoList" 
                setFormData={setFormData} 
                formData={formData} />
            <h2>PhotoPromoList</h2>
            <AddMoreInput 
                label="Photo"
                objName="photosPromoList" 
                attr1="name"
                attr2="photoUrl"
                setFormData={setFormData} 
                formData={formData} />
            {/* EndForm */}
            <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
        </form>
    )
}

const AddMoreInput = ({setFormData, formData, label, atrr1, attr2, objName}) => {
    const [rows, setRows] = useState(1);
    const [cancel, setCancel ] = useState(false);

    const handleAddRow = () => {
        setRows(prevRows => prevRows + 1);
    };
    const handleCancel = () => {
        setCancel(prev => !prev);
        setRows(setRows(prevRows => prevRows - 1))
    };

    const handleFormData = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        console.log(name)
        console.log(value)
        setFormData(prev => ({...prev, [objName]: {...prev.videoPromoList, [name]: [value]}}))
    }
   

    return (
        <AddMoreInputContainer >
            <label htmlFor="">{label}</label>
            <div>
                <input type="text" placeholder="Όνομα" name={atrr1} onChange={(e) => handleFormData(e)} />
                <input type="text" name={attr2} placeholder="https://" value={formData.name}  onChange={(e) => handleFormData(e)}/>
                <AddIcon onClick={handleAddRow} />
            </div>
        </AddMoreInputContainer>
    )
}


const borderColor = '#e8e8e8';

const AddMoreInputContainer = styled.div`
    width: 100%;
    height: 40px;
  
    margin-bottom: 10px;
    div {
        display:  flex;
    }
    label {
        font-size: 12px;
        margin-bottom: 8px;
    }
    /* background-color: pink; */
   input {
    height: 40px;
    padding: 10px;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    height: 100%;
    margin-right: 10px;
   }
   input:nth-child(2) {
    flex: 1;
   }
   svg {
    border: 1px solid ${borderColor};
    border-radius: 4px;
    padding: 10px;
    height: 100%;
    width: 40px;
    font-size: 20px;
    color: ${props => props.theme.palette.primary.main};
    cursor: pointer;
    
   }
   svg:hover,svg:active  {
    scale: 0.9;
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


