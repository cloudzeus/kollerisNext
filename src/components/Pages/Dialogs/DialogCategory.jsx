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

//VALIDATION SCHEMA:
const addSchema = yup.object().shape({
  categoryName: yup.string().required("Συμπληρώστε το όνομα της Κατηγορίας"),
  
});
//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  categoryIcon: "",
  categoryImage: "",
  englishName: "",
  categoryName: "",
};

//ADD/EDIT COMPONENT:
export const DialogCategory = ({
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
        categoryName: data.categoryName,
        englishName: data.englishName,
        categoryIcon: data.categoryIcon,
        categoryImage: data.categoryImage,
        id: data._id,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);


  const handleCloseDialog = () => {
    if(!isEdit && (values.categoryIcon || values.categoryImage)){
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
      let resp = await axios.put("/api/product/apiCategories", {
        action: "putCategory",
        //user:
        mtrcategory: data.softOne.MTRCATEGORY,
        categoryName: formData.categoryName,
        englishName: formData.englishName,
        updatedFrom: user,
        id: data._id,
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
      let { data } = await axios.post("/api/product/apiCategories", {
        action: "create",
        categoryName: formData.categoryName,
        englishName: formData.englishName,
        categoryIcon: formData.categoryIcon,
        categoryImage: formData.categoryImage,
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
        message: e.response.data.error || e.message,
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
      const { data } = await axios.put("/api/product/apiCategories", {
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
        error: e.response.data?.message || e.message || "An unknown error occurred during the upload.",
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
        header={isEdit ? "Τροποποίηση  Εμπορικής Κατηγορίας" : "Προσθήκη Εμπορικής Κατηγορίας"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={handleCloseDialog}
        maximizable
      >
        <form className="form mb-5">
        
          <Input
            label={"Όνομα Κατηγορίας"}
            name={"categoryName"}
            control={control}
            required
            error={errors.categoryName}
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
                name="categoryIcon"
                image={values.categoryIcon}
                setImage={(value) => setValue("categoryIcon", value)}
                updateImage={updateImage}
              />
            </div>
            <div>
              <p className="font-bold mb-2">Φωτογραφία</p>
              <SingleImage
                isEdit={isEdit}
                isSubmitted={submited}
                name="categoryImage"
                image={values.categoryImage}
                setImage={(value) => setValue("categoryImage", value)}
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
