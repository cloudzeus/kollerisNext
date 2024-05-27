import AdminLayout from "@/layouts/Admin/AdminLayout"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import Input from '@/components/Forms/PrimeInput';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from 'primereact/toast';
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import StepHeader from "@/components/StepHeader";
import { Categories, Groups, SubGroups, ManufacturerSelect } from "@/components/grid/Product/ΑddProductConfig";
import { FormTitle } from "@/componentsStyles/dialogforms";
import { useRouter } from "next/router";
import { removeProductForSoftone } from "@/features/productsSlice";
import { Dropdown } from "primereact/dropdown";
import PrimeInputNumber from "@/components/Forms/PrimeInputNumber";
import DropdownCountries from "@/components/Forms/DropdownCountries";
import DropdownVat from "@/components/Forms/DropdownVat";

const addSchema = yup.object().shape({
    // name: yup.string().required('Συμπληρώστε το όνομα'),
    NAME: yup.string().required('Συμπληρώστε το όνομα'),
    PRICER: yup.number().required('Συμπληρώστε την τιμή λιανικής'),
    PRICEW: yup.number().required('Συμπληρώστε την τιμή αποθήκης'),
    VAT: yup.object().shape({
        NAME: yup.string().required("Συμπληρώστε το ΦΠΑ"),
    }),
    COUNTRY: yup.object().shape({
        NAME: yup.string().required("Συμπληρώστε την χώρα"),
    })
});


const Page = () => {
    const { singleProductForSoftone} = useSelector(store => store.products)

 
    const dispatch = useDispatch();
    const router = useRouter();
    const toast = useRef(null);
    const [selectState, setSelectState] = useState({
        category: null,
        group: null,
        subgroup: null,
        brand: null,
        vat: null,
        manufacturer: null,
    })  




    useEffect(() => {
        if(!singleProductForSoftone) {
            router.back()
        }
        setSelectState( () => {
            return {
                category: {
                    softOne: { MTRCATEGORY: singleProductForSoftone?.MTRCATEGORY },
                    categoryName: singleProductForSoftone?.CATEGORY_NAME
                },
                group: {
                    softOne: { MTRGROUP: singleProductForSoftone?.MTRGROUP },
                    groupName: singleProductForSoftone?.GROUP_NAME
                },
                subgroup: {
                    softOne: { cccSubgroup2: singleProductForSoftone?.CCCSUBGROUP2 },
                    subGroupName: singleProductForSoftone?.SUBGROUP_NAME
                },
            }
        })
    }, [singleProductForSoftone])

    const methods = useForm({
        resolver: yupResolver(addSchema),
        defaultValues: {
            singleProductForSoftone
    }})
    const {control, formState: { errors }, handleSubmit, setValue, } = methods
    const values = methods.watch();

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
    }


    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }








    const handleAdd = async (data) => {
     
        if (!selectState.category?.softOne?.MTRCATEGORY) {
            showError('Δεν μπορείτε να προχωρήσετε: Επιλέξτε Κατηγορία')
            return;
        }
        if (!selectState.manufacturer?.MTRMANFCTR) {
            showError('Δεν μπορείτε να προχωρήσετε: Επιλέξτε ΚΑΤΑΣΚΕΥΑΣΤΗ')
            return;
        }
        if (!selectState.group?.softOne?.MTRGROUP) {
            showError('Δεν μπορείτε να προχωρήσετε: Επιλέξτε Ομάδα')
        }

        let _data = {
            ...data,
            MTRCATEGORY: selectState.category?.softOne?.MTRCATEGORY,
            CATEGORY_NAME: selectState.category?.categoryName,
            MTRGROUP: selectState.group?.softOne?.MTRGROUP,
            GROUP_NAME: selectState.group?.groupName,
            CCCSUBGROUP2: selectState.subgroup?.softOne?.cccSubgroup2 || '',
            SUBGROUP_NAME: selectState.subgroup?.subGroupName,
            MTRMARK: selectState.brand?.softOne?.MTRMARK,
            MTRMANFCTR: parseInt(selectState.manufacturer?.MTRMANFCTR),
            VAT: data.VAT.VAT,
            COUNTRY: data.COUNTRY.COUNTRY,

        }
        console.log({_data})
        // let obj = {
        //     ...data,
        //     MTRCATEGORY: selectState.category?.softOne?.MTRCATEGORY,
        //     MTRGROUP: selectState.group?.softOne?.MTRGROUP,
        //     CCCSUBGROUP2: selectState.subgroup?.softOne?.cccSubgroup2 || '',
        //     MTRMARK: selectState.brand?.softOne?.MTRMARK,
        //     MTRMANFCTR: parseInt(selectState.manufacturer?.MTRMANFCTR),
        //     // VAT: parseInt(selectState.vat?.VAT),
        //    VAT: data.VAT.VAT
        // }
        //
        // const mongoObj = {
        //     MTRCATEGORY: selectState.category?.softOne?.MTRCATEGORY,
        //     CATEGORY_NAME: selectState.category?.categoryName,
        //     MTRGROUP: selectState.group?.softOne?.MTRGROUP,
        //     GROUP_NAME: selectState.group?.groupName,
        //     CCCSUBGROUP2: selectState.subgroup?.softOne?.cccSubgroup2 || '',
        //     SUBGROUP_NAME: selectState.subgroup?.subGroupName,
        //     MTRMANFCTR: parseInt(selectState.manufacturer?.MTRMANFCTR),
        //     ...data
        // }


        let res = await axios.post('/api/product/apiProduct', {
            action: 'addToSoftone',
            data: _data,
            id: singleProductForSoftone?._id,
        })
     
        if(!res.data.success) {
            showError(res.data.message)
            return;
        }
        if (res.data.success) {
            dispatch(removeProductForSoftone(singleProductForSoftone?._id))
            router.back();

        }
      
    }



    const handleCountryChange = (e) => {
        setValue('COUNTRY', e.target.value)
    }

    const handleVatState = (e) => {
        setValue('VAT', e.target.value)
    }

    return (
        <AdminLayout>
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-center w-full" >
                <div className="bg-white p-5 w-10 mt-2">
                    <div className="p-3">
                        <StepHeader text="Εισαγωγή Προϊόντος στο Softone" />
                    </div>
                    <form noValidate onSubmit={handleSubmit(handleAdd)} className="p-3 " >
                        <Toast ref={toast} />
                        <Input
                            label={"Όνομα SOFTONE"}
                            name={'NAME'}
                            control={control}
                            required
                        />
                        <Categories
                            state={selectState.category}
                            setState={setSelectState}
                        />

                        <Groups
                            state={selectState.group}
                            setState={setSelectState}
                            id={selectState.category?.softOne?.MTRCATEGORY}
                        />
                        <SubGroups
                            state={selectState.subgroup}
                            setState={setSelectState}
                            id={selectState.group?.softOne?.MTRGROUP}
                        />
                        <ManufacturerSelect
                            state={selectState.manufacturer}
                            setState={setSelectState}
                        />
                         {/* <Input
                                label={'Μάρκα'} 
                                name={'MTRMARK_NAME'}
                                control={control}
                            /> */}
                        <div>
                            <FormTitle>Λοιπά Υποχρεωτικά Πεδία</FormTitle>

                            <DropdownVat
                                state={values.VAT}
                                required
                                handleState={handleVatState}
                                error={errors?.VAT?.NAME.message}
                            />
                            <DropdownCountries
                                selectedCountry={values.COUNTRY}
                                required
                                onChangeCountry={handleCountryChange}
                                error={errors?.COUNTRY?.NAME.message}
                            />
                            <Input
                                label={'MTRUNIT1'}
                                name={'MTRUNIT1'}
                                control={control}
                            />
                            <Input
                                label={'MTRUNIT3'}
                                name={'MTRUNIT3'}
                                control={control}
                            />
                            <Input
                                label={'MU31'}
                                name={'MU31'}
                                control={control}
                            />
                            <Input
                                label={'MTRUNIT4'}
                                name={'MTRUNIT4'}
                                control={control}
                            />
                            <Input
                                label={'MU41'}
                                name={'MU41'}
                                control={control}
                            />

                                    <PrimeInputNumber
                                     label={'Τιμή Λιανικής'}
                                     name={'PRICER'}
                                     control={control}
                                />
                               
                                 <PrimeInputNumber 
                                    label={'Τιμή Αποθήκης'}
                                    name={'PRICEW'}
                                    control={control}
                                />
                                <PrimeInputNumber 
                                    label={'Τιμή Scroutz'}
                                    name={'PRICER05'}
                                    control={control}
                                />



                            <FormTitle>Λοιπά Πεδία</FormTitle>
                            <Input
                                label={'Κωδικός ΕΑΝ'}
                                name={'CODE1'}
                                control={control}
                            />
                            <Input
                                label={'Κωδικός εργοστασίου'}
                                name={'CODE2'}
                                control={control}
                            />
                               <PrimeInputNumber 
                                    label={'ΚΩΔΙΚΟΣ ΜΟΝΑΔΑΣ ΜΕΤΡΗΣΗΣ ΑΓΟΡΩΝ'}
                                    name={'GWEIGHT'}
                                    control={control}
                                />
                           
                           

                            <Input
                                label={'MTRUNIT4: ΚΩΔΙΚΟΣ ΜΟΝΑΔΑΣ ΜΕΤΡΗΣΗΣ ΠΩΛΗΣΗΣ'}
                                name={'MTRUNIT4'}
                                control={control}
                            />

                          
                             <PrimeInputNumber 
                                    label={'Διάσταση 1'}
                                    name={'DIM1'}
                                    control={control}
                                />
                             <PrimeInputNumber 
                                    label={'Διάσταση 2'}
                                    name={'DIM2'}
                                    control={control}
                                />
                             <PrimeInputNumber 
                                    label={'Διάσταση 3'}
                                    name={'DIM3'}
                                    control={control}
                                />
                       
                            <Button label="Προσθήκη" />
                        </div>
                    </form>
                </div>

            </div>

        </AdminLayout>


    )

}


const OptionsVat = ({ state, setState}) => {
    const [vatOptions, setVatOptions] = useState([])
    const [data, setData] = useState([])

    const VatTemplate = ((option) => {
        for (let item of data) {
            if (item.VAT === option.VAT) {
                return (
                    <p>{option.VAT + " -- " + item.NAME}</p>
                )
            }
        }

        return (
            <div className="flex align-items-center">
                <div>{option.VAT}</div>
            </div>
        );
    })


    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiProductFilters', {
            action: 'findVats',
        })
        let newArray = [];
        for (let item of data.result) {
            newArray.push({ VAT: item.VAT })
        }
        setData(data.result)
        setVatOptions(newArray)
    }
    useEffect(() => {
        handleFetch();
    }, [])

    return (
        <div className="card mb-3">
            <span className='mb-2 block'>Aλλαγή ΦΠΑ</span>

            <Dropdown itemTemplate={VatTemplate} value={state} onChange={(e) => setState(prev => ({ ...prev, vat: e.value }))} options={vatOptions} optionLabel="VAT"
                placeholder="ΦΠΑ" className="w-full" />
        </div>
    )
}



export default Page
