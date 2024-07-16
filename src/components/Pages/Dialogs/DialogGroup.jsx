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
import DropdownCategories from "@/components/Forms/DropdownCategories";
import { useToast } from "@/_context/ToastContext";
import { SingleImage } from "@/components/bunnyUpload/SingleImage";
//VALIDATION SCHEMA:
const addSchema = yup.object().shape({
  groupName: yup.string().required("Συμπληρώστε το όνομα"),
  MTRCATEGORY: yup
    .object()
    .required("Συμπληρώστε την κατηγορία")
    .typeError("Συμπληρώστε την Εμπορική Κατηγορία"),
});
//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  groupIcon: "",
  groupImage: "",
  englishName: "",
  groupName: "",
  MTRCATEGORY: null,
};

//ADD/EDIT COMPONENT:
export const DialogGroup = ({
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
        groupName: data.groupName,
        MTRCATEGORY: data?.category.softOne?.MTRCATEGORY,
        englishName: data.englishName,
        groupImage: data.groupImage,
        groupIcon: data.groupIcon,
        id: data._id,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);


  const handleCloseDialog = () => {
    if(!isEdit && (values.groupIcon || values.groupImage)){
       showMessage({
        severity: "info",
        summary: "Προσοχή",
        message: "Παρακαλώ διαγράψτε τις φωτογραφίες πριν κλείσετε το παράθυρο",
       })
       return;
    }
    hideDialog();
  }

  //edit group:
  const handleEdit = async (formData) => {
    try {
      let resp = await axios.put("/api/product/apiGroup", {
        action: "putGroups",
        //group:
        groupid: data._id, //mongo id
        MTRGROUP_ORIGINAL: data.softOne.MTRGROUP, // softoneid ->  "2340"
        groupName: formData.groupName,
        groupName_og: data?.groupName,
        englishName: formData.englishName,
        //category:
        MTRCATEGORY_UPDATE: formData.MTRCATEGORY.softOne.MTRCATEGORY, //softone id
        MTRCATEGORY_ORIGINAL: data?.category.softOne?.MTRCATEGORY, //softone id
        MTRCATEGORY_ORIGINAL_ID: data?.category._id, //mongo id
        //user:
        updatedFrom: user,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: resp.data.message || "Επιτυχής ενημέρωση!",
      
      })
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e.response.data.error || e.message,
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
      let { data } = await axios.post("/api/product/apiGroup", {
        action: "create",
        MTRCATEGORY: formData.MTRCATEGORY.softOne.MTRCATEGORY,
        groupName: formData.groupName,
        groupImage: formData.groupImage,
        groupIcon: formData.groupIcon,
        englishName: formData.englishName,
        createdFrom: user,
      });

      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: data.message,
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e.response.data.error,
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
      const { data } = await axios.put("/api/product/apiGroup", {
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
        error: e.message || "An unknown error occurred during the upload.",
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
        // breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={isEdit ? "Τροποποίηση  Ομάδας" : "Προσθήκη Ομάδας"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={handleCloseDialog}
        maximizable
      >
        <form className="form mb-5">
          <DropdownCategories
            handleClear={() => setValue("MTRCATEGORY", null)}
            isEdit={isEdit}
            state={values?.MTRCATEGORY}
            handleState={(value) => setValue("MTRCATEGORY", value)}
            error={errors?.MTRCATEGORY?.message}
          />
          <Input
            label={"Όνομα Ομάδας"}
            name={"groupName"}
            control={control}
            required
            error={errors.groupName}
          />
          <TranslateInput
            state={values.englishName}
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
                name="groupIcon"
                image={values.groupIcon}
                setImage={(value) => setValue("groupIcon", value)}
                updateImage={updateImage}
              />
            </div>
            <div>
              <p className="font-bold mb-2">Φωτογραφία</p>
              <SingleImage
                isEdit={isEdit}
                isSubmitted={submited}
                name="groupImage"
                image={values.groupImage}
                setImage={(value) => setValue("groupImage", value)}
                updateImage={updateImage}
              />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
