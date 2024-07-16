"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input from "@/components/Forms/PrimeInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";
import { useToast } from "@/_context/ToastContext";
import { useSession } from "next-auth/react";
//VALIDATION SCHEMA:
const schema = yup.object().shape({
  code: yup.string().required("O κωδικός είναι υποχρεωτικός"),
  greekDescription: yup.string().required("Υποχρεωτική Περιγραφή"),
  englishDescription: yup.string().required("Υποχρεωτική αγγλική Περιγραφή"),
});

//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  code: "",
  englishDescription: "",
  greekDescription: "",
};

//ADD/EDIT COMPONENT:
export const DialogImpa = ({
  isEdit,
  dialog,
  hideDialog,
  setSubmitted,
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  let user = session?.user?.lastName;
  const { showMessage } = useToast();
  const toast = useRef(null);
  const methods = useForm({
    resolver: yupResolver(schema),
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
      reset(data);
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);

  const handleEdit = async (formData) => {
    setLoading(true);
    try {
      await axios.post("/api/product/apiImpa", {
        action: "updateImpa",
        data:formData,
        id: data._id,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Η εγγραφή ενημερώθηκε",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
      hideDialog();
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      let res = await axios.post("/api/product/apiImpa", {
        action: "createImpa",
        data: formData,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Η εγγραφή προστέθηκε",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
      hideDialog();
      setLoading(false);
      reset();
    }
  };
  //final submit:
  const handleSubmitDialog = async (data) => {
    if (isEdit) {
      await handleEdit(data);
    } else {
      await handleAdd(data);
    }
  };

  const onStatusChange = async () => {
    try {
      const resp = await axios.post("/api/product/apiImpa", {
        action: values.isActive ? "deactivate" : "activate",
        selected: [data],
      });
      setValue("isActive", !values.isActive);
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: resp.data.message || "Επιτυχής αλλαγή κατάστασης",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
      //   hideDialog();
    }
  };

  return (
    <div className="dialog_container">
      <Toast ref={toast} />
      <Dialog
        visible={dialog}
        style={{ width: "29rem" }}
        header={isEdit ? "Τροποποίηση Impa" : "Προσθήκη Impa"}
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
          <Input
            label={"Impa code"}
            name={"code"}
            control={control}
            required
            error={errors.code}
          />
          <Input
            label={"Αγγλική Περιγραφή"}
            name={"englishDescription"}
            control={control}
            required
          />
          <Input
            label={"Eλληνική Περιγραφή"}
            name={"greekDescription"}
            control={control}
            required
          />
          {isEdit ? (
            <StatusChange
              onClick={onStatusChange}
              isActive={values?.isActive}
            />
          ) : null}
        </form>
      </Dialog>
    </div>
  );
};

const StatusChange = ({ isActive, onClick }) => {
  return (
    <div>
      <div className="flex">
        <div
          style={{ width: "18px", height: "18px" }}
          className={`${
            isActive ? "bg-green-500" : "bg-red-500"
          }  border-round flex align-items-center justify-content-center`}
        >
          {isActive ? (
            <i className="pi pi-check text-white text-xs"></i>
          ) : (
            <i className="pi pi-times text-white text-xs"></i>
          )}
        </div>
        <p className="ml-1">
          {isActive ? "Ενεργοποιημένο" : "Απενεργοποιημένο"}
        </p>
      </div>
      <p
        onClick={onClick}
        className="underline cursor-pointer text-primary text-xs"
      >
        {isActive ? "Απενεργοποίηση" : "Ενεργοποίηση"}
      </p>
    </div>
  );
};
