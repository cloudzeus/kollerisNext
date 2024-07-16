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
import PrimeSelect from "@/components/Forms/PrimeSelect";
import axios from "axios";
//VALIDATION SCHEMA:
const schema = yup.object().shape({
  firstName: yup.string().required("Συμπληρώστε το όνομα"),
  lastName: yup.string().required("Συμπληρώστε το επώνυμο"),
  email: yup
    .string()
    .email("Λάθος format email")
    .required("Συμπληρώστε το email"),
  password: yup.string().required("Συμπληρώστε τον κωδικό"),
  //   role: yup.object().required("Συμπληρώστε τα δικαιώματα χρήστη").typeError("Συμπληρώστε τα δικαιώματα χρήστη"),
});
const editSchema = yup.object().shape({
  firstName: yup.string().required("Συμπληρώστε το όνομα"),
  lastName: yup.string().required("Συμπληρώστε το επώνυμο"),
  email: yup
    .string()
    .email("Λάθος format email")
    .required("Συμπληρώστε το email"),
  role: yup.string().required("Συμπληρώστε τα δικαιώματα χρήστη"),
});

//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  country: "",
  address: "",
  city: "",
  postalcode: "",
  mobile: "",
  landline: "",
};

//ADD/EDIT COMPONENT:
export const DialogUser = ({
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
    resolver: yupResolver(isEdit ? editSchema : schema),
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
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data?.role,
        country: data?.address?.country,
        address: data?.address?.address,
        city: data?.address?.city,
        postalcode: data?.address?.postalcode,
        mobile: data?.phones?.mobile,
        landline: data?.phones?.landline,
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
      await axios.post("/api/user/apiUser", {
        action: "update",
        data: {
          ...formData,
          updatedFrom: user,
        },
        id: data._id,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Ο χρήστης τροποποιήθηκε με επιτυχία",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
      setLoading(false);
      hideDialog();
    }
  };

  const handleAdd = async (formData) => {
    try {
      await axios.post("/api/user/apiUser", {
        action: "create",
        data: formData,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Ο χρήστης προστέθηκε με επιτυχία",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
      setLoading(false);
      hideDialog();
    }
  };

  return (
    <div className="dialog_container">
      <Toast ref={toast} />
      <Dialog
        visible={dialog}
        style={{ width: "35rem" }}
        header={isEdit ? "Τροποποίηση Χρήστη" : "Προσθήκη Χρήστη"}
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
        <form className="form">
          <div className="product_form_grid_row">
            <Input
              label={"Όνομα"}
              name={"firstName"}
              required
              control={control}
              error={errors.firstName}
            />
            <Input
              label={"Eπώνυμο"}
              name={"lastName"}
              required
              control={control}
              error={errors.lastName}
            />
          </div>
          <div className="product_form_grid_row">
            <Input
              label={"Εmail"}
              name={"email"}
              required
              control={control}
              error={errors.email}
            />
            <PrimeSelect
              control={control}
              name="role"
              required
              placeholder="Επιλέξτε Ρόλο"
              label={"Δικαιώματα Χρήστη"}
              options={[
                { role: "user" },
                { role: "employee" },
                { role: "manager" },
                { role: "admin" },
              ]}
              optionLabel={"role"}
              optionValue={"role"}
              error={errors.role?.message}
            />
          </div>
          <div className="product_form_grid_row">
            <Input label={"Χώρα"} name={"country"} control={control} />
            <Input label={"Διεύθυνση"} name={"address"} control={control} />
          </div>
          <div className="product_form_grid_row">
            <Input label={"Πόλη"} name={"city"} control={control} />
            <Input label={"Τ.Κ."} name={"postalcode"} control={control} />
          </div>
          <div className="product_form_grid_row">
            <Input label={"Κινητό"} name={"mobile"} control={control} />
            <Input label={"Κινητό"} name={"landline"} control={control} />
          </div>
          {isEdit ? (
            <Input
              label={"Νέος Κωδικός"}
              name={"newPassword"}
              required
              control={control}
            />
          ) : (
            <Input
              label={"Κωδικός"}
              name={"password"}
              required
              control={control}
              error={errors.password}
            />
          )}
        </form>
      </Dialog>
    </div>
  );
};
