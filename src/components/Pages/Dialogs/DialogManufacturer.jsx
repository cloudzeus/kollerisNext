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
  NAME: yup.string().required("To όνομα είναι υποχρεωτικό"),
});

//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  NAME: "",
};

//ADD/EDIT COMPONENT:
export const DialogManufacturers = ({
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
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  useEffect(() => {
    if (isEdit && data) {
      reset(data);
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);

  //final submit:
  const handleSubmitDialog = async (data) => {
    if (isEdit) {
      await handleEdit(data);
    } else {
      await handleAdd(data);
    }
  };

   
  const handleEdit = async (formData) => {
    try {
        let resp = await axios.post('/api/product/apiManufacturers', {
            action: 'update',
            NAME: formData.NAME,
            MTRMANFCTR: data.MTRMANFCTR,
            id: data._id, 
            updatedFrom: user
        })
        showMessage({
            severity: 'success',
            summary: 'Success',
            message:resp?.data?.message || 'Επιτυχής ενημέρωση!'
        })
    } catch (e) {
        showMessage({
            severity: 'error',
            summary: 'Error',
            message: e?.response?.data?.error || e.message
        })
    } finally {
        reset()
        setSubmitted((prev) => !prev)
        hideDialog()
    }
}
const handleAdd = async (formData) => {
    try {
        const res = await axios.post('/api/product/apiManufacturers', { 
            action: 'create', 
            data: formData
        })
        showMessage({
            severity: 'success',
            summary: 'Success',
            message: res?.data?.message || 'Επιτυχής εισαγωγή στην βάση'
        })
    } catch(e) {
        showMessage({
            severity: 'error',
            summary: 'Error',
            message: e?.response?.data?.error || e.message
        })
    } finally {
        setSubmitted(true)
        hideDialog()
        reset();
    }
}
  return (
    <div className="dialog_container">
      <Toast ref={toast} />
      <Dialog
        visible={dialog}
        style={{ width: "29rem" }}
        header={isEdit ? "Τροποποίηση Κατασκευαστή" : "Προσθήκη Κατασκευαστή"}
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
            label={"Όνομα Kατασκευαστή"}
            name={"NAME"}
            control={control}
            required
            error={errors.NAME}
          />
        </form>
      </Dialog>
    </div>
  );
};
