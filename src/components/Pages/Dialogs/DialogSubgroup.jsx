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
import { useSession } from "next-auth/react";
import { TranslateInput } from "@/components/Forms/TranslateInput";
import { useToast } from "@/_context/ToastContext";
import { SingleImage } from "@/components/bunnyUpload/SingleImage";
import DropdownGroups from "@/components/Forms/DropdownGroups";
import PrimeSelect from "@/components/Forms/PrimeSelect";
import { sub } from "date-fns";
import { Dropdown } from "primereact/dropdown";
import DropdownGroupsNoParent from "@/components/Forms/DropdownGroupsNoParent";

//VALIDATION SCHEMA:
const addSchema = yup.object().shape({
  MTRGROUP: yup
    .object()
    .required("Συμπληρώστε την Oμάδα")
    .typeError("Συμπληρώστε την Ομάδα"),
});
//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  cccSubgroup2: null,
  MTRGROUP: null,
  id: null,
  subGroupName: "",
  subGroupIcon: "",
  subGroupImage: "",
  englishName: "",
};

//ADD/EDIT COMPONENT:
export const DialogSubgroup = ({
  isEdit,
  dialog,
  hideDialog,
  setSubmitted,
  data,
  submited,
}) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useToast();
  const user = session?.user?.lastName;
  const toast = useRef(null);
  const methods = useForm({
    resolver: yupResolver(addSchema),
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
        cccSubgroup2: data.softOne.cccSubgroup2,
        subGroupName: data.subGroupName,
        subGroupIcon: data.subGroupIcon,
        subGroupImage: data.subGroupImage,
        MTRGROUP: {
          softOne: data.group.softOne,
        },
        id: data._id,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);

  const handleCloseDialog = () => {
    if (!isEdit && (values.categoryIcon || values.categoryImage)) {
      showMessage({
        severity: "info",
        summary: "Προσοχή",
        message: "Παρακαλώ διαγράψτε τις φωτογραφίες πριν κλείσετε το παράθυρο",
      });
      return;
    }
    hideDialog();
  };
  //edit group:
  const handleEdit = async (formData) => {
    try {
      let resp = await axios.put("/api/product/apiSubGroup", {
        action: "putSubgroup",
        cccSubgroup2: formData.cccSubgroup2,
        short: formData.cccSubgroup2,
        subGroupName: formData.subGroupName,
        englishName: formData.englishName,
        MTRGROUP: formData.MTRGROUP.softOne.MTRGROUP, //softoneId
        MTRGROUP_OG: data.group.softOne.MTRGROUP, //softoneId
        subgroupid: formData.id, //mongoId
        updatedFrom: user,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: resp.data.message,
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
      setLoading(false);
      hideDialog();
    }
  };

  //add group:
  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      let { data } = await axios.post("/api/product/apiSubGroup", {
        action: "create",
        subGroupName: formData.subGroupName,
        MTRGROUP: formData.MTRGROUP.softOne.MTRGROUP,
        subGroupImage: formData.subGroupImage,
        subGroupIcon: formData.subGroupIcon,
        englishName: formData.englishName,

      });

      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: data?.message,
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e.response?.data?.error || e.message,
      });
    } finally {
      setLoading(false);
      setSubmitted((prev) => !prev);
      hideDialog();
      reset(DEFAULT_VALUES);
    }
  };

  //update images on edit:
  const updateImage = async (image, name) => {
    try {
      const { data } = await axios.put("/api/product/apiSubGroup", {
        action: "putImage",
        update: { [name]: image },
        id: values.id,
      });
      return {
        message: data.message,
        success: data.success,
      };
    } catch (e) {
      return {
        error:
          e.response.data?.message ||
          e.message ||
          "An unknown error occurred during the upload.",
      };
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

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Ακύρωση"
        icon="pi pi-times"
        severity="info"
        outlined
        onClick={handleCloseDialog}
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
  );

 
  return (
    <div className="dialog_container">
      <Toast ref={toast} />
      <Dialog
        visible={dialog}
        style={{ width: "29rem" }}
        header={isEdit ? "Τροποποίηση Υποομάδας" : "Προσθήκη Υποομάδας"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={handleCloseDialog}
        maximizable
      >
        <form className="form mb-5">
          <DropdownGroupsNoParent
            value={values.MTRGROUP}
            onChange={(e) => setValue("MTRGROUP", e.target.value)}
            error={errors?.MTRGROUP?.message}
            required
            optionLabel="softOne.NAME"
          />
          <Input
            label={"Όνομα Υποομάδας"}
            name={"subGroupName"}
            control={control}
            required
            error={errors?.categoryName}
          />
          <TranslateInput
            state={values?.englishName}
            textArea={true}
            handleState={(value) => setValue("englishName", value)}
            name="englishName"
            label={"Όνομα Αγγλικό"}
            targetLang="en-GB"
          />
          <div className="seperator"></div>
          <div className="drop_images_grid ">
            <div>
              <p className="font-bold mb-2">Eικονίδιο</p>
              <SingleImage
                isEdit={isEdit}
                isSubmitted={submited}
                name="subGroupIcon"
                image={values?.subGroupIcon}
                setImage={(value) => setValue("subGroupIcon", value)}
                updateImage={updateImage}
              />
            </div>
            <div>
              <p className="font-bold mb-2">Φωτογραφία</p>
              <SingleImage
                isEdit={isEdit}
                isSubmitted={submited}
                name="subGroupImage"
                image={values?.subGroupImage}
                setImage={(value) => setValue("subGroupImage", value)}
                updateImage={updateImage}
              />
            </div>
            <div></div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
