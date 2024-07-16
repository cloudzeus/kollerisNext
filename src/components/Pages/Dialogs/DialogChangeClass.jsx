"use client";
import React, {useEffect} from "react";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import axios from "axios";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import {setSubmitted} from "@/features/productsSlice";
import DropdownCategories from "@/components/Forms/DropdownCategories";
import DropdownGroups from "@/components/Forms/DropdownGroups";
import DropdownSubroups from "@/components/Forms/DropdownSubgroups";
import {useToast} from "@/_context/ToastContext";

const addSchema = yup.object().shape({
    MTRCATEGORY: yup.object().required("Υποχρεωτικό πεδίο").typeError("Υποχρεωτικό πεδίο"),
    MTRGROUP: yup.object().required("Υποχρεωτικό πεδίο").typeError("Υποχρεωτικό πεδίο"),
});

const defaultValues = {
    MTRCATEGORY: null,
    MTRGROUP: null,
    CCCSUBGROUP2: null,
};

export const DialogChangeClass = ({dialog, hideDialog, data}) => {
    const dispatch = useDispatch();
    const {selectedProducts} = useSelector(store => store.products);
    const {showMessage} = useToast();
    const methods = useForm({
        resolver: yupResolver(addSchema),
        defaultValues: defaultValues,
    });
    const {
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
    } = methods;
    const values = methods.watch();

    const categoryRef = React.useRef(null);


    const handleSubmitForm = async (formData) => {
        try {
            let res = await axios.post("/api/product/apiProduct", {
                action: "updateClass",
                products: selectedProducts,
                MTRCATEGORY: formData?.MTRCATEGORY?.softOne?.MTRCATEGORY,
                CATEGORY_NAME: formData?.MTRCATEGORY?.categoryName,
                MTRGROUP: formData?.MTRGROUP?.softOne?.MTRGROUP,
                GROUP_NAME: formData?.MTRGROUP?.groupName,
                CCCSUBGROUP2: formData?.CCCSUBGROUP2?.softOne?.cccSubgroup2,
                SUBGROUP_NAME: formData?.CCCSUBGROUP2?.subGroupName,
            });
            showMessage({
                severity: "success",
                summary: "Επιτυχία",
                message: res.data.message,
            });
        } catch (e) {
            console.error({e})
            showMessage({

                severity: "error",
                summary: "Αποτυχία",
                message: e?.response?.data?.error || e.message,
            });
        } finally {
            hideDialog();
            dispatch(setSubmitted());
        }
    };

    const handleCategoryClear = () => {
        setValue("MTRCATEGORY", null);
        setValue("MTRGROUP", null);
        setValue("CCCSUBGROUP2");
    };
    const handleGroupClear = () => {
        setValue("MTRGROUP", null);
        setValue("CCCSUBGROUP2", null);
    };
    const handleSubgroupClear = () => {
        setValue("CCCSUBGROUP2", null);
    };
    const onHide = () => {
        hideDialog();
    };
    return (
        <div className="dialog_container">
            <Dialog
                visible={dialog}
                breakpoints={{"1100px": "80vw", "640px": "90vw"}}
                style={{width: "40rem", minHeight: "40vh"}}
                header={"Μαζική Αλλαγή Κατηγοριοποίησης"}
                modal
                className="p-fluid"
                footer={() => (
                    <React.Fragment>
                        <Button
                            label="Ακύρωση"
                            icon="pi pi-times"
                            severity="info"
                            outlined
                            onClick={onHide}
                        />
                        <Button
                            label="Αποθήκευση"
                            icon="pi pi-check"
                            severity="info"
                            onClick={handleSubmit(handleSubmitForm)}
                        />
                    </React.Fragment>
                )}
                onHide={onHide}
                maximizable
            >
                <form
                    className="form"
                    noValidate
                    onSubmit={handleSubmit(handleSubmitForm)}
                >
                    <DropdownCategories
                        componentRef={categoryRef}
                        isEdit={true}
                        state={values.MTRCATEGORY}
                        handleState={(e) => setValue("MTRCATEGORY", e)}
                        error={errors?.MTRCATEGORY?.message}
                        handleClear={handleCategoryClear}
                    />
                    <DropdownGroups
                        isEdit={true}
                        state={values.MTRGROUP}
                        handleState={(e) => setValue("MTRGROUP", e)}
                        error={errors?.MTRGROUP?.message}
                        categoryId={values?.MTRCATEGORY?.softOne?.MTRCATEGORY}
                        handleClear={handleGroupClear}
                    />
                    <DropdownSubroups
                        isEdit={true}
                        state={values.CCCSUBGROUP2}
                        handleState={(e) => setValue("CCCSUBGROUP2", e)}
                        error={errors?.CCCSUBGROUP2?.message}
                        groupId={values?.MTRGROUP?.softOne?.MTRGROUP}
                        categoryId={values?.MTRCATEGORY?.softOne?.MTRCATEGORY}
                        handleClear={handleSubgroupClear}
                    />
                </form>
            </Dialog>
        </div>
    );
};
