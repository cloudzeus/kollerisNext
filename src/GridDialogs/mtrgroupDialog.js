'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import axios from 'axios';
import PrimeUploads from '@/components/Forms/PrimeImagesUpload';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Container } from '@/componentsStyles/dialogforms';
import { useSession } from "next-auth/react"
import PrimeSelect from '@/components/Forms/PrimeSelect';
import DialogGallery from '@/components/DialogGallery';
import SingleImageUpload from '@/components/bunnyUpload/FileUpload';
import { Dropdown } from 'primereact/dropdown';
import TranslateInput from '@/components/Forms/TranslateInpit';

const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const { gridRowData } = useSelector(store => store.grid)
    const [translateName, setTranslateName] = useState('')
    
  
    const [parent, setParent] = useState([])
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: gridRowData
    });

    const handleTranslate =  async (value) => {
        setTranslateName(value)
    }

    useEffect(() => {
        reset({ ...gridRowData });
    }, [gridRowData, reset]);


    
    
    useEffect(() => {
        setTranslateName(gridRowData?.englishName)
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiGroup', { action: 'findCategoriesNames' })
            setParent(res.data.result)
            
        }
        handleFetch()
        // setCategory({categoryName: gridRowData?.CATEGORY_NAME , softOne: {MTRCATEGORY: gridRowData?.MTRCATEGORY}})

        //In the database empty logo is saved as an empty string, so we need to convert it to an empty array
        // setLogo(gridRowData?.groupIcon ? [gridRowData?.groupIcon] : [])
        // setImage(gridRowData?.groupImage ? [gridRowData?.groupImage] : [])
    }, [gridRowData])



    const handleEdit = async (data) => {
        console.log(translateName)
        const { groupIcon, groupImage, categoryid,...rest } = data;
        let originalCategory =  gridRowData?.category?._id
        let newCategory =  categoryid || gridRowData?.category?._id
        let user = session.user.user.lastName
        const object = {...rest, updatedFrom: user, englishName: translateName }

        try {
       
            let resp = await axios.post('/api/product/apiGroup',
                {
                    action: "update",
                    data: object,
                    groupid: gridRowData._id,
                    originalCategory: originalCategory,
                    newCategory: newCategory,
                })
                console.log('edit response')
                console.log(resp.data)
            setSubmitted(prev=> !prev)
            // showSuccess(resp.data.message)
            hideDialog()


        } catch (e) {
            console.log(e)
        }

    }

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 6000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }


    const handleClose = () => {
        hideDialog()
    }

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Ακύρωση" icon="pi pi-times" severity="info" outlined onClick={handleClose} />
            <Button label="Αποθήκευση" icon="pi pi-check" severity="info" onClick={handleSubmit(handleEdit)} />
        </React.Fragment>
    );

    return (
        < Container>
            <form >
                <Toast ref={toast} />
                <Dialog
                    visible={dialog}
                    style={{ width: '32rem', maxWidth: '80rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Διόρθωση Ομάδας"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                    <PrimeSelect
                        control={control}
                        name="categoryid"
                        required
                        label={'Κατηγορία'}
                        options={parent}
                        optionLabel={'label'}
                        optionValue={'value._id'}
                        placeholder={gridRowData?.category?.categoryName}
                    // error={errors.categoryName}
                    />
                    
                    
                    <Input
                        label={'Όνομα Ομάδας'}
                        name={'groupName'}
                        control={control}
                        required
                        // error={errors.categoryName}
                    />
                      <TranslateInput
                            label={'Όνομα κατηγορίας αγγλικά'}
                            state={translateName}
                            handleState={handleTranslate}
                            targetLang="en-GB"
                        />


                    <div>
                    <FormTitle>Φωτογραφίες</FormTitle>
                        <UploadImage id={gridRowData._id} image={gridRowData.groupImage} />
                    </div>
                    <div>
                    <FormTitle>Λογότυπο</FormTitle>
                        <UploadLogo id={gridRowData._id} image={gridRowData.groupImage} />
                    </div>
                </Dialog>
            </form>
        </Container>

    )
}


const UploadImage = ({ id, }) => {

    console.log(id)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [visible, setVisible] = useState(false)
    const [refetch, setRefetch] = useState(false)
    const [data, setData] = useState(false)

    const onAdd = async () => {
        let { data } = await axios.post('/api/product/apiGroup', { action: 'addImage', imageName: uploadedFiles[0].name, id: id })
        console.log(data)
        setRefetch(prev => !prev)
        return data;
    }

    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiGroup', { action: 'getImages', id: id })
        setData(data.result.groupImage)
    }
    const onDelete = async () => {
        let { data } = await axios.post('/api/product/apiGroup', { action: 'deleteImage', id: id })
        setRefetch(prev => !prev)
    }

    useEffect(() => {
        handleFetch()
    }, [refetch])
    return (
        <div>
            <SingleImageUpload
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                visible={visible}
                data={data}
                setVisible={setVisible}
                onAdd={onAdd}
                onDelete={onDelete}

            />
        </div>

    )
}
const UploadLogo = ({ id }) => {

    const [uploadedFiles, setUploadedFiles] = useState([])
    const [visible, setVisible] = useState(false)
    const [refetch, setRefetch] = useState(false)
    const [data, setData] = useState(false)

    const onAdd = async () => {
        let { data } = await axios.post('/api/product/apiGroup', { action: 'addLogo', imageName: uploadedFiles[0].name, id: id })
        setRefetch(prev => !prev)
        return data;
    }

    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiGroup', { action: 'getImages', id: id })
        console.log('data')
        console.log(data)
        setData(data.result?.groupIcon)

    }
    const onDelete = async () => {
        let { data } = await axios.post('/api/product/apiGroup', { action: 'deleteLogo', id: id })
        setRefetch(prev => !prev)
    }

    useEffect(() => {
        handleFetch()
    }, [refetch])
    return (
        <div>
            <SingleImageUpload
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                visible={visible}
                data={data}
                setVisible={setVisible}
                onAdd={onAdd}
                onDelete={onDelete}

            />
        </div>

    )
}

const addSchema = yup.object().shape({
    groupName: yup.string().required('Συμπληρώστε το όνομα'),
    categoryid: yup.string().required('Η Κατηγορία είναι υποχρεωτική'),
});


const AddDialog = ({
    dialog,
    hideDialog,
    setSubmitted,
   
}) => {


    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(addSchema),
        defaultValues: {
            groupName: '',
            categoryid: '',
        }
    });
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
    const [logo, setLogo] = useState('')
    const [images, setImages] = useState([])
    const [parent, setParent] = useState([])
    const cancel = () => {
        hideDialog()
        reset()
    }


    useEffect(() => {
        setDisabled(false)
        const handleFetch = async () => {
            let res = await axios.post('/api/product/apiGroup', { action: 'findCategoriesNames' })
            setParent(res.data.result)

        }
        handleFetch()
    }, [])



    const handleAdd = async (data) => {

        let user = session.user.user.lastName
        const body = {
            ...data,
            createdFrom: user
        }


        let res = await axios.post('/api/product/apiGroup', { action: 'create', data: body })
        if (!res.data.success) return showError(res.data.softoneError)
        let parent = res.data.parent
        setDisabled(true)
        setSubmitted(true)
        showSuccess('Επιτυχής εισαγωγή στην βάση')
        showSuccess('Eπιτυχής Update στην Κατηγορία: ' + parent)
        hideDialog()
        reset();
    }



    const productDialogFooter = (
        <>
            <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={cancel} />
            <Button label="Αποθήκευση" icon="pi pi-check" type="submit" onClick={handleSubmit(handleAdd)} disabled={disabled} />
        </>
    );

    const showSuccess = (detail) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: detail, life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης : ' + message, life: 5000 });
    }

    return (
        <form noValidate onSubmit={handleSubmit(handleAdd)}>
            <Toast ref={toast} />
            <Dialog
                visible={dialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Προσθήκη Ομάδας"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}>
                <FormTitle>Λεπτομέριες</FormTitle>
                <PrimeSelect
                    control={control}
                    name="categoryid"
                    required
                    label={'Κατηγορία'}
                    options={parent}
                    optionLabel={'label'}
                    placeholder='Επίλεξε κατηγορία'
                    optionValue={'value._id'}
                    error={errors.categoryName}
                />
                <Input
                    toolip="Σε ποιά κατηγορία ανήκει;"
                    label={'Όνομα Κατηγορίας'}
                    name={'groupName'}
                    control={control}
                    required
                    error={errors.groupName}
                />
            </Dialog>
        </form>
    )

}


export const Categories = ({ state, setState }) => {
    const [options, setOptions] = useState([])
   
    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProductFilters', { action: 'findCategories' })
        setOptions(data.result)
    }
    useEffect(() => {
        handleFetch();
    }, [])


    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Επιλογή Kατηγορίας</span>
            <div className='flex align-items-center'>
                <Dropdown value={state} onChange={(e) => setState(e.value)} options={options} optionLabel="categoryName"
                    placeholder="Κατηγορία" className="w-full" />
            </div>


        </div>
    )
}



export { EditDialog, AddDialog }
