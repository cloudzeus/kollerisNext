"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input from "@/components/Forms/PrimeInput";
import { TextAreaInput } from "@/components/Forms/PrimeInput";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { TranslateInput } from "@/components/Forms/TranslateInput";
import { setSubmitted } from "@/features/productsSlice";
import PrimeInputNumber from "@/components/Forms/PrimeInputNumber";
import DropdownCountries from "@/components/Forms/DropdownCountries";
import DropdownVat from "@/components/Forms/DropdownVat";
import DropdownCategories from "@/components/Forms/DropdownCategories";
import DropdownGroups from "@/components/Forms/DropdownGroups";
import DropdownSubroups from "@/components/Forms/DropdownSubgroups";
import DropdownManufacturers from "@/components/Forms/DrodownManufactures";
import DropdownBrands from "@/components/Forms/DropdownBrands";
import DropdownIntrastat from "@/components/Forms/DropdownIntrastat";
import PrimeSelect from "@/components/Forms/PrimeSelect";
import { useToast } from "@/_context/ToastContext";
import { InputNumber } from "primereact/inputnumber";

const addSchema = yup.object().shape({
  NAME: yup.string().required("Συμπληρώστε το όνομα"),
  ATTRIBUTES: yup.array().of(
    yup.object().shape({
      userLabel: yup.string().required("Υποχρεωτικό Πεδίο"),
      label: yup.string().required("Υποχρεωτικό Πεδίο"),
      value: yup.string().required("Υποχρεωτικό Πεδίο"),
    })
  ),
});

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
  //CODES:
  CODE: "",
  CODE1: "",
  CODE2: "",
  //PRICES:
  PRICER: null,
  PRICEW: null,
  PRICER01: null,
  COST: null,
  //DIMENSIONS:
  WIDTH: null,
  LENGTH: null,
  HEIGHT: null,
  GWEIGHT: null,
  VOLUME: null,
  //AVAILABILITY:
  DIATHESIMA: null,
  SEPARAGELIA: null,
  DESVMEVMENA: null,
  ATTRIBUTES: [],
  //BOOLEANS:
  isSkroutz: null,
};

export const DialogProduct = ({ dialog, hideDialog, isEdit, data }) => {
  const dispatch = useDispatch();
  const { showMessage } = useToast();
  const methods = useForm({
    resolver: yupResolver(addSchema),
    defaultValues: defaultValues,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = methods;
  const values = methods.watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ATTRIBUTES",
  });


  useEffect(() => {
    if (isEdit && data) {
      const attributes = {};
      data.ATTRIBUTES?.forEach((attr) => {
        attributes[attr.label] = attr.value;
      });
      reset({
        ...data,
        DIATHESIMA: data?.availability?.DIATHESIMA,
        SEPARAGELIA: data?.availability?.SEPARAGELIA,
        DESVMEVMENA: data?.availability?.DESVMEVMENA,
      });
    } else if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line
  }, [data, isEdit]);

  const handleSubmitForm = async (formData) => {
    try {
      const resp = await axios.post("/api/product/apiProduct", {
        action: !isEdit ? "create" : "update",
        data: formData,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: resp.data.message,
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Αποτυχία",
        message: e?.response?.data?.error || e.message,
      });
      return;
    } finally {
      hideDialog();
      dispatch(setSubmitted());
    }
  };

  const handleTranslate = (value, name) => {
    setValue(name, value);
  };
  const handleInputChange = (value, name) => {
    setValue(name, value);
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
        breakpoints={{ "1100px": "80vw", "640px": "90vw" }}
        style={{ width: "40rem", minHeight: "40vh" }}
        header={isEdit ? "Τροποποίηση Προϊόντος" : "Προσθήκη Προϊόντος"}
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
          {isEdit ? (
            <div>
            <span className="">Κατάσταση Softone:</span>
            <span className="font-bold ml-1 underline">
              {data?.MTRL ? "Στο Softone " : "Δεν είναι στο Softone"}
            </span>
          </div>
          ) : null}
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
          <DropdownCategories
            isEdit={isEdit}
            state={values.MTRCATEGORY}
            handleState={(e) => handleInputChange(e, "MTRCATEGORY")}
            error={errors?.MTRCATEGORY?.message}
            handleClear={handleCategoryClear}
          />
          <DropdownGroups
            isEdit={isEdit}
            state={values.MTRGROUP}
            handleState={(e) => handleInputChange(e, "MTRGROUP")}
            error={errors?.MTRGROUP?.message}
            categoryId={values?.MTRCATEGORY?.softOne?.MTRCATEGORY}
            handleClear={handleGroupClear}
          />
          <DropdownSubroups
            isEdit={isEdit}
            state={values.CCCSUBGROUP2}
            handleState={(e) => handleInputChange(e, "CCCSUBGROUP2")}
            error={errors?.CCCSUBGROUP2?.message}
            groupId={values?.MTRGROUP?.softOne?.MTRGROUP}
            categoryId={values?.MTRCATEGORY?.softOne?.MTRCATEGORY}
            handleClear={handleSubgroupClear}
          />
          <DropdownManufacturers
            isEdit={isEdit}
            state={values.MTRMANFCTR}
            handleState={(e) => handleInputChange(e, "MTRMANFCTR")}
            error={errors?.MTRMANFCTR}
          />
          <DropdownBrands
            isEdit={isEdit}
            state={values.MTRMARK}
            handleState={(e) => handleInputChange(e, "MTRMARK")}
            error={errors?.MTRMARK}
          />
          <DropdownIntrastat
            isEdit={isEdit}
            state={values.INTRASTAT}
            handleState={(e) => handleInputChange(e, "INTRASTAT")}
            error={errors?.INTRASTAT}
          />
          <TextAreaInput
            label={"Περιγραφή Ελληνική"}
            name={"DESCRIPTION"}
            control={methods.control}
            required
            error={errors.DESCRIPTION}
          />
          <TranslateInput
            state={values.DESCRIPTION_ENG}
            textArea={true}
            handleState={handleTranslate}
            name="DESCRIPTION_ENG"
            label={"Περιγραφή Αγγλική"}
            targetLang="en-GB"
          />
          <DropdownVat
            isEdit={isEdit}
            state={values.VAT}
            handleState={(e) => handleInputChange(e, "VAT")}
          />
          <DropdownCountries
            isEdit={isEdit}
            state={values.COUNTRY}
            handleState={(e) => handleInputChange(e, "COUNTRY")}
          />
          <p className="mt-2 font-bold text-lg">Κωδικοί</p>
          <div className="product_form_grid_row_three">
            <Input
              label={"Κωδικός ERP"}
              name={"CODE"}
              control={methods.control}
            />
            <Input
              label={"Κωδικός EAN"}
              name={"CODE1"}
              control={methods.control}
            />
            <Input
              label={"Κωδικός Εργοστασίου"}
              name={"CODE2"}
              control={methods.control}
            />
          </div>

          <p className="mt-2 font-bold text-lg">Τιμές</p>
          <div className="product_form_grid_row_three">
            <PrimeInputNumber
              label={"Τιμή Λιανικής"}
              name={"PRICER"}
              prefix={"€"}
              maxFractionDigits={2}
              value={values.PRICER}
              handleValue={(e) => setValue("PRICER", e.value )}
              required
              error={errors.PRICER}
            />
            <PrimeInputNumber
              label={"Τιμή Χονδρικής"}
              name={"PRICEW"}
              prefix={"€"}
              maxFractionDigits={2}
              value={values.PRICEW}
              handleValue={(e) => setValue("PRICEW", e.value )}
              required
              error={errors.PRICEW}
            />
            <PrimeInputNumber
              label={"Τιμή Skroutz"}
              name={"PRICER01"}
              prefix={"€"}
              maxFractionDigits={2}
              value={values.PRICER01}
              handleValue={(e) => setValue("PRICER01", e.value )}
              required
              error={errors?.PRICER01}
            />
          </div>
          <p className="mt-2 font-bold text-lg">Πληροφορίες</p>
          <div className="product_form_grid_row">
            
          <PrimeInputNumber
              label={"Πλάτος"}
              name={"WIDTH"}
              maxFractionDigits={2}
              value={values.WIDTH}
              handleValue={(e) => setValue("WIDTH", e.value )}
            />
            <PrimeInputNumber
              label={"Μήκος"}
              name={"LENGTH"}
              maxFractionDigits={2}
              value={values.LENGTH}
              handleValue={(e) => setValue("LENGTH", e.value )}
            />
          </div>
          <div className="product_form_grid_row_three">
            <PrimeInputNumber
              label={"Ύψος"}
              name={"HEIGHT"}
              value={values.HEIGHT}
              handleValue={(e) => setValue("HEIGHT", e.value)}
            />
            <PrimeInputNumber
              label={"Βάρος"}
              name={"GWEIGHT"}
              value={values.GWEIGHT}
              handleValue={(e) => setValue("GWEIGHT", e.value)}
            />
            <PrimeInputNumber
              label={"Όγκος"}
              name={"VOLUME"}
              value={values.VOLUME}
              handleValue={(e) => setValue("VOLUME", e.value)}
            />
          </div>
          <p className="mt-2 font-bold text-lg">Διαθεσιμότητα</p>
          <div className="product_form_grid_row_three">
            <PrimeInputNumber
              label={"Διαθέσιμα"}
              name={"DIATHESIMA"}
              value={values.DIATHESIMA}
              disabled={isEdit}
              handleValue={(e) => setValue("DIATHESIMA", e.value)}
            />
            <PrimeInputNumber
              label={"Σε παραγγελία"}
              name={"SEPARAGELIA"}
              disabled={isEdit}
              value={values.SEPARAGELIA}
              handleValue={(e) => setValue("SEPARAGELIA", e.value)}
            />
            <PrimeInputNumber
              label={"Δεσμευμένα"}
              name={"DESVMEVMENA"}
              disabled={isEdit}
              value={values.DESVMEVMENA}
              handleValue={(e) => setValue("DESVMEVMENA", e.value)}
            />
          </div>
          <div className="product_form_grid_row">
            <PrimeSelect
              options={[
                { label: "Είναι στο Skroutz", value: true },
                { label: "Δεν είναι στο Skroutz", value: false },
              ]}
              label="Στο Skroutz"
              name="isSkroutz"
              optionLabel={"label"}
              optionValue={"value"}
              control={methods.control}
            />
            {isEdit ? (
               <PrimeSelect
               options={[
                 { label: "Ενεργό Προϊόν", value: true },
                 { label: "Ανενεργό Προϊόν", value: false },
               ]}
               label="Κατάσταση Προϊόντος"
               name="ISACTIVE"
               optionLabel={"label"}
               optionValue={"value"}
               control={methods.control}
             />
            ) : null}
          </div>
            <div>
              <p className="my-2 font-bold text-lg">{`Επιπλέον Πεδία (Attributes)`} </p>
              {fields.length > 0 && fields.map((field, index) => (
                <div   key={field.id}>
                    <div className="product_form_grid_row_three">
                    <Input
                    label={"Όνομα Πεδίου"}
                    name={`ATTRIBUTES.${index}.userLabel`}
                    control={control}
                    error={errors.ATTRIBUTES?.[index]?.userLabel}
                  />
                    <Input
                    label={"Όνομα Βάσης"}
                    name={`ATTRIBUTES.${index}.label`}
                    control={control}
                    error={errors.ATTRIBUTES?.[index]?.label}
                  />
                    <Input
                    label={"Τιμή Πεδίου"}
                    name={`ATTRIBUTES.${index}.value`}
                    control={control}
                    error={errors.ATTRIBUTES?.[index]?.value}
                  />
                    </div>
                    <p 
                      className="text-red-500 underline font-bold cursor-pointer mb-3"
                      onClick={() => remove(index)}

                    > Αφαίρεση</p>
                
              
                </div>
                 
              ))}
              <Button
                label="Προσθήκη Επιπλέον Πεδίου"
                style={{ width: "220px" }}
                icon="pi pi-plus"
                className="p-button-info mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  append({ userLabel: "", value: "", label: ""})
                }}
              />

            </div>
        </form>
      </Dialog>
    </div>
  );
};
