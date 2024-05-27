"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input from "@/components/Forms/PrimeInput";
import { TextAreaInput } from "@/components/Forms/PrimeInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { FormTitle, Container } from "@/componentsStyles/dialogforms";
import { Dropdown } from "primereact/dropdown";
import { useSession } from "next-auth/react";
import { TranslateInput } from "@/components/Forms/TranslateInput";
import { setSubmitted } from "@/features/productsSlice";
import PrimeInputNumber from "@/components/Forms/PrimeInputNumber";
import CountriesDropdown from "@/components/Forms/CountriesDropdown";
import VatDropdown from "@/components/Forms/VatDropdown";
import DropdownCategories from "@/components/Forms/DropdownCategories";
import DropdownGroups from "@/components/Forms/DropdownGroups";
import DropdownSubroups from "@/components/Forms/DropdownSubgroups";
import DropdownManufacturers from "@/components/Forms/DrodownManufactures";
import DropdownBrands from "@/components/Forms/DropdownBrands";
import DropdownIntrastat from "@/components/Forms/DropdownIntrastat";

const EditDialog = ({ dialog, hideDialog }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [englishDescription, setEnglishDescription] = useState("");
  const toast = useRef(null);
  const { gridRowData } = useSelector((store) => store.grid);
  const [selectState, setSelectState] = useState({
    category: null,
    group: null,
    subgroup: null,
    vat: null,
  });

  const methods = useForm({
    resolver: yupResolver(addSchema),
    defaultValues: gridRowData,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;
  const values = methods.watch();

  const handleEnglish = async (value) => {
    setEnglishDescription(value);
  };

  useEffect(() => {
    // Reset the form values with defaultValues when gridRowData changes
    reset({ ...gridRowData });
    setEnglishDescription(gridRowData?.DESCRIPTION_ENG);
    setSelectState({
      category: {
        categoryName: gridRowData?.CATEGORY_NAME,
        softOne: { MTRCATEGORY: gridRowData?.MTRCATEGORY },
      },
      group: {
        groupName: gridRowData?.GROUP_NAME,
        softOne: { MTRGROUP: gridRowData?.MTRGROUP },
      },
      subgroup: {
        subGroupName: gridRowData?.SUBGROUP_NAME,
        softOne: { cccSubgroup2: gridRowData?.CCCSUBGROUP2 },
      },
      vat: { VAT: gridRowData?.VAT },
    });
  }, [gridRowData, reset]);

  const handleEdit = async (data) => {
    console.log({ data });

    try {
      let resp = await axios.post("/api/product/apiProduct", {
        action: "update",
        data: {
          ...data,
          DESCRIPTION_ENG: englishDescription,
          ...selectState,
        },
      });
      console.log({ resp });
      if (!resp.data.success) {
        showError(resp.data?.error);
        return;
      }
      dispatch(setSubmitted());
      hideDialog();
      showSuccess(resp.data.systemMessage + " " + resp.data.softoneMessage);
    } catch (e) {
      showError("Αποτυχία. Προσπαθήστε ξανά");
    }
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 4000,
    });
  };
  const showError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 4000,
    });
  };

  const handleClose = () => {
    hideDialog();
  };

  const handleVatState = (e) => {
    setValue("VAT", e.target.value);
  };

  const handleCountryChange = (e) => {
    setValue("COUNTRY", e.target.value);
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
    <Container>
      <form>
        <Toast ref={toast} />
        <Dialog
          visible={dialog}
          style={{ width: "32rem", maxWidth: "80rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Τροποποίηση Προϊόντος"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
          maximizable
        >
          {/* <Categories
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
                    /> */}

          <FormTitle>Λεπτομέριες</FormTitle>
          <Input
            label={"Όνομα"}
            name={"NAME"}
            control={control}
            required
            error={errors.NAME}
          />
          <VatDropdown
            state={values.VAT}
            isEdit
            error={errors?.VAT?.NAME?.message}
            // required
            handleState={handleVatState}
          />
          <CountriesDropdown
            selectedCountry={values.COUNTRY}
            isEdit
            onChangeCountry={handleCountryChange}
            required
            error={errors?.COUNTRY?.NAME?.message}
          />
          <TextAreaInput
            autoResize={true}
            label={"Ελληνική Περιγραφή"}
            name={"DESCRIPTION"}
            control={control}
          />
          {/* <TranslateTextArea
            label={"Περιγραφή Aγγλική"}
            state={englishDescription}
            handleState={handleEnglish}
            targetLang="en-GB"
          /> */}

          <PrimeInputNumber
            label={"Τιμή Κόστους"}
            name={"COST"}
            control={control}
            required
            error={errors.cost}
          />
          <PrimeInputNumber
            label={"Τιμή Λιανικής"}
            name={"PRICER"}
            control={control}
          />

          <PrimeInputNumber
            label={"Τιμή Αποθήκης"}
            name={"PRICEW"}
            control={control}
          />

          <PrimeInputNumber
            label={"Τιμή Skroutz"}
            name={"PRICE01"}
            control={control}
          />

          <Input label={"ΕΑΝCODE"} name={"CODE1"} control={control} />
          <Input label={"Κωδικός Προϊόντος"} name={"CODE2"} control={control} />
        </Dialog>
      </form>
    </Container>
  );
};





const addSchema = yup.object().shape({
  NAME: yup.string().required("Συμπληρώστε το όνομα"),
  // MTRCATEGORY: yup.object().required("Συμπληρώστε την κατηγορία"),
  // MTRGROUP: yup.object().required("Συμπληρώστε την ομάδα"),
  // CCCSUBGROUP2: yup.object().required("Συμπληρώστε την υποομάδα"),
});

const AddDialog = ({ dialog, hideDialog }) => {

  const defaultValues = {
    NAME: "",
    NAME_ENG: "",
    DESCRIPTION: "",
    DESCRIPTION_ENG: "",
    //DROPDOWNS:
    MTRCATEGORY: null,
    MTRGROUP: null,
    CCCSUBGROUP2: null,
    MTRMANFCTR: null,
    MTRMARK: null,
    INTRASTAT: null,
    //DETAILS:
    CODE: "",
    CODE1: "",
    CODE2: "",
    PRICER: 0,
    PRICEW: 0,
    PRICER01: 0,
    COST: 0,
  }
  const dispatch = useDispatch();
  
 
  const methods = useForm({
    resolver: yupResolver(addSchema),
    defaultValues: defaultValues
  });
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;
  const values = methods.watch();
  const toast = useRef(null);

  useEffect(() => {
    reset(defaultValues);
  }, [dialog]);



  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 4000,
    });
  };
  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 4000,
    });
  };

  const handleClose = () => {
    hideDialog();
  };

  const handleAdd = async (data) => {
    console.log({ data });
    return;
    let _data = {
      ...data,
      COUNTRY: data.COUNTRY.COUNTRY,
      VAT: data.VAT.VAT,
      //needs refactoring:
      MTRCATEGORY: selectState.category?.softOne?.MTRCATEGORY,
      CATEGORY_NAME: selectState.category?.categoryName,
      MTRGROUP: selectState.group?.softOne?.MTRGROUP,
      GROUP_NAME: selectState.group?.groupName,
      CCCSUBGROUP2: selectState.subgroup?.softOne?.cccSubgroup2,
      SUBGROUP_NAME: selectState.subgroup?.subGroupName,
    };

    let res = await axios.post("/api/product/apiProduct", {
      action: "create",
      data: _data,
    });

    if (!res.data.success) {
      showError(res.data.message);
      return;
    }
    showSuccess(res.data.message);
    hideDialog();
    dispatch(setSubmitted());
    reset();
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
        onClick={handleSubmit(handleAdd)}
      />
    </React.Fragment>
  );

 
  const handleTranslate = (value, name) => {
    setValue(name, value);
  };
  const handleInputChange = (e, name) => {
    setValue(name, e.target.value);
  };

  const handleCategoryChange = (e) => {
    setValue("MTRCATEGORY", e.target.value);
    setValue("MTRGROUP", null);
  };

  const handleGroupChange = (e) => {
    setValue("MTRGROUP", e.target.value);
    setValue("CCCSUBGROUP2", null);
  };

  const handleVatState = (e) => {
    let value = e.target.value;
    setValue("VAT", value);
  };

  return (
    <Container>
      <Toast ref={toast} />
      <Dialog
        visible={dialog}
        style={{ width: "34rem", minHeight: "40vh" }}
        header="Προσθήκη Προϊόντος"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
        maximizable
      >
        <form className="form" noValidate onSubmit={handleSubmit(handleAdd)}>
          <Input
            label={"Όνομα"}
            name={"NAME"}
            control={methods.control}
            required
            error={errors.NAME}
          />
           <TranslateInput
            state={values.NAME_ENG}
            textArea={false}
            handleState={handleTranslate}
            name="NAME_ENG"
            label={"Όνομα Αγγλικά"}
            targetLang="en-GB"
          />
          <h3 className="mt-3">
            Κατηγοριοποίηση
          </h3>
          <DropdownCategories
            state={values.MTRCATEGORY}
            // required
            handleState={handleCategoryChange}
            error={errors?.MTRCATEGORY?.message}
          />
          <DropdownGroups
            state={values.MTRGROUP}
            // required
            handleState={handleGroupChange}
            error={errors?.MTRGROUP?.message}
            categoryId={values.MTRCATEGORY?.softOne?.MTRCATEGORY}
          />
          <DropdownSubroups
            state={values.CCCSUBGROUP2}
            // required
            handleState={(e) => handleInputChange(e, "CCCSUBGROUP2")}
            error={errors?.CCCSUBGROUP2?.message}
            groupId={values.MTRGROUP?.softOne?.MTRGROUP}
          />
          <DropdownManufacturers
            state={values.MTRMANFCTR}
            handleState={(e) => handleInputChange(e, "MTRMANFCTR")}
            error={errors?.MTRMANFCTR}
          />
          <DropdownBrands 
             state={values.MTRMARK}
             handleState={(e) => handleInputChange(e, "MTRMARK")}
             error={errors?.MTRMARK}
          />
          <DropdownIntrastat
             state={values.INTRASTAT}
             handleState={(e) => handleInputChange(e, "INTRASTAT")}
             error={errors?.INTRASTAT}
          />

          <TranslateInput
            state={values.DESCRIPTION_ENG}
            textArea={true}
            handleState={handleTranslate}
            name="DESCRIPTION_ENG"
            label={"Περιγραφή Αγγλική"}
            targetLang="en-GB"
          />
          <VatDropdown
            state={values.VAT}
            required
            handleState={handleVatState}
            error={errors?.VAT?.NAME.message}
          />
          <CountriesDropdown
            selectedCountry={values.COUNTRY}
            required
            onChangeCountry={(e) => handleInputChange(e, "COUNTRY")}
            error={errors?.COUNTRY?.NAME.message}
          />
          {/*
                <TextAreaInput
                  autoResize={true}
                  label={"Ελληνική Περιγραφή"}
                  name={"DESCRIPTION"}
                  control={control}
                />

                <TranslateTextArea
                  label={"Περιγραφή Aγγλική"}
                  state={englishDescription}
                  handleState={handleEnglish}
                  targetLang="en-GB"
                />
                <FormTitle>ΤΙΜΕΣ:</FormTitle>
                <PrimeInputNumber
                  label={"Τιμή Κόστους"}
                  name={"COST"}
                  control={control}
                  required
                  error={errors.cost}
                />
                <PrimeInputNumber
                  label={"Τιμή Λιανικής"}
                  name={"PRICER"}
                  control={control}
                />

                <PrimeInputNumber
                  label={"Τιμή Αποθήκης"}
                  name={"PRICEW"}
                  control={control}
                />
                <PrimeInputNumber
                  label={"Τιμή Scroutz"}
                  name={"PRICER01"}
                  control={control}
                />
                <Input label={"ΕAN CODE"} name={"CODE1"} control={control} />
                <Input
                  label={"Kωδικός Προϊόντος"}
                  name={"CODE2"}
                  control={control}
                  required
                /> */}
        </form>
      </Dialog>
    </Container>
  );
};


export { EditDialog, AddDialog };
