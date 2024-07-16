"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input from "@/components/Forms/PrimeInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { useSession } from "next-auth/react";
import PrimeSelect from "@/components/Forms/PrimeSelect";
import CountriesDropdown from "@/components/Forms/DropdownCountries";
import { useToast } from "@/_context/ToastContext";

const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
  const { data: session} = useSession();
  let user = session?.user?.lastName;
  const {showMessage} = useToast();
  const toast = useRef(null);
  const { gridRowData } = useSelector((store) => store.grid);
  const [trdCategories, setTrdCategories] = useState(null);

  const methods = useForm({
    defaultValues: gridRowData,
  });
  const { control, handleSubmit, reset, setValue, formState: {errors} } = methods;
  const values = methods.watch();
  useEffect(() => {
    reset({ ...gridRowData });
  }, [gridRowData, reset]);

  const handleFetchData = async () => {
    const { data } = await axios.post("/api/suppliers", {
      action: "getTRDCATEGORIES",
    });
    setTrdCategories(data.result);
  };

  useEffect(() => {
    handleFetchData();
  }, []);


  const handleEdit = async (data) => {
    try {
      await axios.post("/api/suppliers", {
        action: "updateOne",
        data: data,
        user: user,
      });
        showMessage({
          severity: "success",
          summary: "Success",
          message: "Επιτυχής ενημέρωση!"
        })
    } catch (e) {
        showMessage({
          severity: "error",
          summary: "Error",
          message: e?.response?.data?.error || e.message
        })
    } finally {
      hideDialog();
      setSubmitted(true);

    }
  };

  
  const handleClose = () => {
    hideDialog();
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Ακύρωση"
        icon="pi pi-times"
        severity="info"
        outlined
        onClick={handleClose}
      />
      <Button
        label="Αποθήκευση"
        icon="pi pi-check"
        severity="info"
        onClick={handleSubmit(handleEdit)}
      />
    </React.Fragment>
  );

  
  return (
      <form>
        <Toast ref={toast} />
        <Dialog
          visible={dialog}
          style={{ width: "32rem", maxWidth: "80rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Τροποποίηση Προμηθευτή"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
          maximizable
        >   

         <PrimeSelect
          label={"Τύπος Προμηθευτή"}
          name={"TRDCATEGORY"}
          options={trdCategories}
          optionLabel={"NAME"}
          optionValue={"TRDCATEGORY"}
          control={control}
          required
          error={errors.TRDCATEGORY}
        />
           <CountriesDropdown
          isEdit={false}
          state={values.COUNTRY}
          handleState={(value) => setValue("COUNTRY", value)}
          error={errors?.COUNTRY?.NAME.message}
        />
          <Input label={"Όνομα"} name={"NAME"} control={control} required />
          <Input label={"ΑΦΜ"} name={"AFM"} control={control} />
          <Input label={"Διεύθυνση"} name={"ADDRESS"} control={control} />
          <Input label={"T.K"} name={"ZIP"} control={control} />
          <Input label={"Τηλέφωνο"} name={"PHONE01"} control={control} />
          <Input label={"Τηλέφωνο 2"} name={"PHONE02"} control={control} />
          <Input label={"Εmail"} name={"EMAIL"} control={control} />
          <Input
            label={"Ελάχιστη Ποσότητα Παραγγελία"}
            name={"minOrderValue"}
            control={control}
          />
        </Dialog>
      </form>
  );
};

const addSchema = yup.object().shape({
  NAME: yup.string().required("Το όνομα είναι υποχρεωτικό"),
  AFM: yup.string().required("Το ΑΦΜ είναι υποχρεωτικό"),
  TRDCATEGORY: yup.string().required("Ο τύπος προμηθευτή είναι υποχρεωτικός"),
  COUNTRY: yup
    .object()
    .required("Συμπληρώστε την Χώρα")
    .typeError("Συμπληρώστε την Χώρα"),
  CODE: yup.string().required("Ο κωδικός είναι υποχρεωτικός"),
  minOrderValue: yup
    .number()
    .required("Η ελάχιστη ποσότητα παραγγελίας είναι υποχρεωτική"),
});

const AddDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const [loading, setLoading] = useState(false)
  const methods = useForm({
    resolver: yupResolver(addSchema),
    defaultValues: {
      NAME: "",
      PHONE01: "",
      PHONE02: "",
      EMAIL: "",
      ADDRESS: "",
      EMAILACC: "",
      ZIP: "",
      AFM: "",
      TRDCATEGORY: "",
      COUNTRY: "",
      CODE: "",
      minOrderValue: "",
      IRSDATA: "",
      JOBTYPETRD: "",
      WEBPAGE: "",
    },
  });
  const {showMessage} = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;
  const values = methods.watch();

  const [disabled, setDisabled] = useState(false);
  const [trdCategories, setTrdCategories] = useState(null);

  const cancel = () => {
    hideDialog();
    reset();
  };

  const handleFetchData = async () => {
    const { data } = await axios.post("/api/suppliers", {
      action: "getTRDCATEGORIES",
    });
    setTrdCategories(data.result);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleAdd = async (data) => {
    setLoading(true)
    try {
      let res = await axios.post("/api/suppliers", {
        action: "create",
        data: {
          ...data,
          COUNTRY: parseInt(data.COUNTRY.COUNTRY),
          SOCURRENCY: parseInt(data.COUNTRY.SOCURRENCY),
        },
      });
      showMessage({
        severity: "success",
        summary: "Success",
        message: res.data?.message || "Επιτυχής εισαγωγή!"
      })
    } catch (e) {
        showMessage({
            severity: "error",
            summary: "Error",
            message: e?.response?.data?.error || e.message
        })
    } finally {
        setLoading(false)
        setSubmitted(true);
        hideDialog();
        reset();
    }
  };

  const productDialogFooter = (
    <>
      <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={cancel} />
      <Button
        loading={loading}
        label="Αποθήκευση"
        icon="pi pi-check"
        type="submit"
        onClick={handleSubmit(handleAdd)}
        disabled={disabled}
      />
    </>
  );

 

  return (
    <form className="form" noValidate onSubmit={handleSubmit(handleAdd)}>
      <Dialog
        visible={dialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Προσθήκη Προμηθευτή"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <PrimeSelect
          label={"Τύπος Προμηθευτή"}
          name={"TRDCATEGORY"}
          options={trdCategories}
          optionLabel={"NAME"}
          optionValue={"TRDCATEGORY"}
          control={control}
          required
          error={errors.TRDCATEGORY}
        />
        <CountriesDropdown
          isEdit={false}
          state={values.COUNTRY}
          handleState={(value) => setValue("COUNTRY", value)}
          error={errors?.COUNTRY?.message}
        />
        <Input
          label={"Όνομα"}
          name={"NAME"}
          control={control}
          required
          error={errors.NAME}
        />
        <Input
          label={"ΑΦΜ"}
          name={"AFM"}
          control={control}
          required
          error={errors.AFM}
        />
        <Input label={"Διεύθυνση"} name={"ADDRESS"} control={control} />
        <Input
          label={"Κωδικός Προμηθευτή"}
          name={"CODE"}
          control={control}
          required
        />
        <Input
          label={"Ελάχιστη Ποσότητα Παραγγελίας"}
          name={"minOrderValue"}
          control={control}
          required
          error={errors.minOrderValue}
        />
        <Input label={"T.K"} name={"ZIP"} control={control} />

        <Input label={"Τηλέφωνο"} name={"PHONE01"} control={control} />
        <Input label={"Τηλέφωνο 2"} name={"PHONE02"} control={control} />
        <Input label={"Εmail"} name={"EMAIL"} control={control} />
        <Input label={"Εmailcc"} name={"EMAILACC"} control={control} />
        <Input label={"IRSDATA"} name={"IRSDATA"} control={control} />
        <Input label={"Τύπος Εργασίας"} name={"JOBTYPETRD"} control={control} />
        <Input label={"Ιστοσελίδα"} name={"WEBPAGE"} control={control} />
      </Dialog>
    </form>
  );
};

export { EditDialog, AddDialog };
