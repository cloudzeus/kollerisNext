import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import * as yup from "yup";
import React from 'react'
import styled from "styled-components";
import AddIcon from '@mui/icons-material/Add';
import Button from "@/components/Buttons/Button";
import { InputVar1 } from "@/components/Forms/newInputs/InputClassic";
import { useSelector } from "react-redux";
import { ImageInput } from "@/components/Forms/newInputs/ImageInput";
import YupForm from "@/components/Forms/YupForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { editGridItem } from "@/features/grid/gridSlice";
import { useDispatch } from "react-redux";


const registerSchema = yup.object().shape({
	name: yup.string().required('Συμπληρώστε το όνομα'),
	description: yup.string().required('Συμπληρώστε το επώνυμο'),
	
});




export const FormEdit = () => {
    const { gridRowData, gridSelectedFile, editData } = useSelector(state => state.grid)
    console.log('EDIT DATA')
    console.log(editData)
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            _id: editData?._id,
            name: editData?.name,
            description:  editData?.description,
            facebookUrl:  editData?.facebookUrl,
            instagramUrl:  editData?.instagramUrl,
            officialCatalogueUrl:  editData?.officialCatalogueUrl,
            softOneMTRMARK: editData?.softOneMTRMARK,
            softOneName: editData?.softOneName,
            softOneCode:  editData?.softOneCode,
            softOneSODCODE:  editData?.softOneSODCODE,
            softOneISACTIVE:  editData?.softOneISACTIVE,
            pimUrl:  editData?.pimAccess?.pimUrl,
            pimUserName:  editData?.pimAccess?.pimUserName,
            pimPassword:  editData?.pimAccess?.pimPassword,
            logo:  editData?.logo,

        }
    });
    const [selectedFile, setSelectedFile] = useState(null);

    
    useEffect(() => {
        const handleFetchOne =  async () => {
            dispatch(editGridItem({id: gridRowData?._id}))
        }
        handleFetchOne();
    }, [])

    const onSubmit = async (data, event) => {
        event.preventDefault();
       
        // let res = await axios.post('/api/admin/markes/markes', { action: 'create', data: {...data, ...formData, logo: selectedFile ? selectedFile.name : ''} })
        // let res = await axios.post('/api/admin/markes/markes', { action: 'create' })
        // console.log('------------------------- Res --------------------------')
        // console.log(res)

    }

    // const handleUpload = () => {
    //     try {


    //     }
    // }

    return (
        // grid-form-styles-form : /components/Grids/GridMarkes/styles.js
        <YupForm className="grid-styles-form">
            <h2 className="grid-styles-form__header">Διόρθωση Μάρκας:<span>{editData?.softOne.MTRMARK}</span></h2>
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
                    logo={gridRowData?.logo}
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                />
            </GridContainer>
           
            <Button mt={'20'} onClick={handleSubmit(onSubmit)} type="submit">Aποθήκευση Νέου</Button>
        </YupForm>
    )
}


const borderColor = '#e8e8e8';





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




