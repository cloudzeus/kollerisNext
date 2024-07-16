"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input from "@/components/Forms/PrimeInput";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";
import { useSession } from "next-auth/react";
import { useToast } from "@/_context/ToastContext";
import CountriesDropdown from "@/components/Forms/DropdownCountries";
import axios from "axios";
//VALIDATION SCHEMA:
const schema = yup.object().shape({
    NAME: yup.string().required('Το Όνομα είναι υποχρεωτικό'),
    CODE: yup.string().required('O Κωδικός είναι υποχρεωτικός'),
    AFM: yup.string().required('Το ΑΦΜ είναι υποχρεωτικό'),
    COUNTRY: yup.object().required('Η Χώρα είναι υποχρεωτική'),
});



//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
    NAME: '',
    PHONE01: '',
    PHONE02: '',
    EMAIL: '',
    ADDRESS: '',
    ZIP: '',
    AFM: '',
    DIASCODE: '',
    COUNTRY: '',
    code: '',
};

//ADD/EDIT COMPONENT:
export const DialogClient = ({
  isEdit,
  dialog,
  hideDialog,
  setSubmitted,
  data,
}) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useToast();
  const user = session?.user?.lastName;
  const toast = useRef(null);
  const methods = useForm({
    resolver: yupResolver( schema),
    defaultValues: DEFAULT_VALUES,
  });
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const values = methods.watch();

  useEffect(() => {
    if (isEdit && data) {
      reset({
        ...data,
        COUNTRY:data.COUNTRY,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);

  const handleSubmitDialog = async (data) => {
    if (isEdit) {
      await handleEdit(data);
    } else {
      await handleAdd(data);
    }
  };

  const handleEdit = async (formData) => {
    try {
        const {data} = await axios.put('/api/clients/apiClients', { 
            action: "updateOne",
            TRDR:formData.TRDR,
            CODE: formData.CODE,
            NAME:formData.NAME,
            AFM: formData.AFM,
            ADDRESS:formData.ADDRESS,
            COUNTRY: formData.COUNTRY.COUNTRY,
            SOCURRENCY: formData.COUNTRY.SOCURRENCY,
            PHONE01: formData.PHONE01,
            PHONE02: formData.PHONE02,
            EMAIL: formData.EMAIL,
            ZIP: formData.ZIP,
            id: formData._id,
            })
            showMessage({
                severity: "success",
                summary: "Επιτυχία",
                message: data.message
            })
    } catch (e) {
        showMessage({
            severity: "error",
            summary: "Σφάλμα",
            message: e.response?.data?.error || e.message
        })
    } finally {
        setSubmitted(true)
        hideDialog()
    }

  }
  const handleAdd = async (formData) => {
    try {
        const {data}= await axios.post('/api/clients/apiClients', { 
            action: 'addClient',
            CODE: formData.CODE,
            COUNTRY: formData.COUNTRY?.COUNTRY,
            SOCURRENCY: formData.COUNTRY?.SOCURRENCY,
            DIASCODE: formData.DIASCODE,
            NAME:formData.NAME,
            AFM: formData.AFM,
            ADDRESS:formData.ADDRESS,
            PHONE01: formData.PHONE01,
            PHONE02: formData.PHONE02,
            EMAIL: formData.EMAIL,
            ZIP: formData.ZIP,
            id: formData._id,
         })
        showMessage({
            severity: "success",
            summary: "Επιτυχία",
            message: res.data.message
        })
    } catch (e) {
        showMessage({
            severity: "error",
            summary: "Σφάλμα",
            message: e?.response?.data?.error || e?.message
        })
    } finally {
        setSubmitted(true)
        hideDialog()
    }
  }

  return (
    <div className="dialog_container">
      <Toast ref={toast} />
      <Dialog
        visible={dialog}
        style={{ width: "35rem" }}
        header={isEdit ? "Τροποποίηση Πελάτη" : "Προσθήκη Πελάτη"}
        modal
        className="p-fluid"
        footer={() => (
          <React.Fragment>
            <Button
              label="Ακύρωση"
              icon="pi pi-times"
              severity="info"
              outlined
              onClick={hideDialog}
            />
            <Button
              loading={loading}
              type="submit"
              label="Αποθήκευση"
              icon="pi pi-check"
              severity="info"
              onClick={handleSubmit(handleSubmitDialog)}
            />
          </React.Fragment>
        )}
        onHide={hideDialog}
        maximizable
      >
        <form className="form mb-5">
             <CountriesDropdown
             isEdit={isEdit}
             state={values.COUNTRY}
             handleState={(value) => setValue("COUNTRY", value)}
             error={errors?.COUNTRY?.message}
           />
          <Input label={"Όνομα"} name={"NAME"} control={control} required />
          <Input label={"ΑΦΜ"} name={"AFM"} control={control} />
          <div className="product_form_grid_row">
          <Input label={"Διεύθυνση"} name={"ADDRESS"} control={control} />
          <Input label={"T.K"} name={"ZIP"} control={control} />
          </div>
          <div className="product_form_grid_row">
            <Input label={"Τηλέφωνο"} name={"PHONE01"} control={control} />
            <Input label={"Τηλέφωνο 2"} name={"PHONE02"} control={control} />
          </div>
          <div className="product_form_grid_row">
            <Input label={"DIASCODE"} name={"DIASCODE"} control={control} />
            <Input label={"Κωδικός"} name={"CODE"} control={control} />
          </div>
          <Input label={"Εmail"} name={"EMAIL"} control={control} />
        </form>
      </Dialog>
    </div>
  );
};
