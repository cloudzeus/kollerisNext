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
import { AddMoreInput } from "@/components/Forms/newInputs/AddMoreInput";


const registerSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
    description: yup.string().required('Συμπληρώστε το επώνυμο'),

});




export const FormEdit = () => {
    const { gridRowData, gridSelectedFile, editData } = useSelector(state => state.grid)
    console.log('EDIT DATA')
    console.log(editData)
    const dispatch = useDispatch();
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])

    useEffect(() => {
        for(let i of gridRowData?.videoPromoList) {
            setVideoList(prev => [...prev, i])
        }
    }, [])
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            _id: gridRowData?._id,
            name: gridRowData?.name,
            description: gridRowData?.description,
            facebookUrl: gridRowData?.facebookUrl,
            instagramUrl: editData?.instagramUrl,
            officialCatalogueUrl: editData?.officialCatalogueUrl,
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
                        logo={gridRowData?.logo}
                        setSelectedFile={setSelectedFile}
                        selectedFile={selectedFile}
                    />
                </GridContainer>
                <div>
                    <h2>Βίντεο Προϊόντος</h2>
                    <AddMoreInput
                        label="Video"
                        htmlName1="name"
                        htmlName2="videoUrl"
                        setFormData={setVideoList}
                        formData={videoList} />
                </div>
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




