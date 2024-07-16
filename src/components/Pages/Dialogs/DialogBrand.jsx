"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input, { TextAreaInput } from "@/components/Forms/PrimeInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";
import { useSession } from "next-auth/react";
import { TranslateInput } from "@/components/Forms/TranslateInput";
import { useToast } from "@/_context/ToastContext";
import { SingleImage } from "@/components/bunnyUpload/SingleImage";
import { AddMoreInput } from "@/components/Forms/PrimeAddMultiple";
import { InputTextarea } from "primereact/inputtextarea";

//VALIDATION SCHEMA:
const schema = yup.object().shape({
  name: yup.string().required("Συμπληρώστε το όνομα"),
});
//DEFAULT VALUES FOR THE FORM:
const DEFAULT_VALUES = {
  name: "",
  description: "",
  pimUrl: "",
  pimUserName: "",
  pimPassword: "",
  webSiteUrl: "",
  officialCatalogueUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  TRDCATEGORY: null,
  logo: "",
};

//ADD/EDIT COMPONENT:
export const DialogBrand = ({
  isEdit,
  dialog,
  hideDialog,
  setSubmitted,
  data,
  submited,
}) => {
  const session = useSession();
  const user = session?.user?.lastName;
  const [loading, setLoading] = useState(false);
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

  const [videoList, setVideoList] = useState([
    {
      name: "",
      videoUrl: "",
    },
  ]);

  useEffect(() => {
    if (isEdit && data) {
      reset({
        ...data,
        id: data._id,
        name: data.softOne.NAME,
        pimUrl: data.pimAccess?.pimUrl,
        pimUserName: data.pimAccess?.pimUserName,
        pimPassword: data.pimAccess?.pimPassword,
      });
      setVideoList(data?.videoPromoList);
    } else {
      setVideoList([
        {
          name: "",
          videoUrl: "",
        },
      ])
      reset(DEFAULT_VALUES);
    }
  }, [isEdit, data]);

  const handleCloseDialog = () => {
    if (!isEdit && (values.logo)) {
      showMessage({
        severity: "info",
        summary: "Προσοχή",
        message: "Παρακαλώ διαγράψτε τις φωτογραφίες πριν κλείσετε το παράθυρο",
      });
      return;
    }
    hideDialog();
  };

  //edit brand:
  const handleEdit = async (formData) => {
    
    setLoading(true);
   
    try {
      let resp = await axios.post("/api/product/apiMarkes", {
        action: "update",
        data: {
          ...formData,
          updatedFrom: user,
          videoPromoList: videoList,
        },
        oldName: data.softOne.NAME,
        id: data._id,
        mtrmark: data?.softOne?.MTRMARK,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: resp.data.message,
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted(prev=> !prev);
      setLoading(false);
      hideDialog();
      setVideoList([
        {
          name: "",
          videoUrl: "",
        },
      ])
    }
  };

  //add brand:
  const handleAdd = async (formData) => {

  
        try {
         const resp = await axios.post('/api/product/apiMarkes', { 
          action: 'create', 
          data: {
            ...formData,
            photosPromoList: videoList,
          }, 
        })
          showMessage({
            severity: "success",
            summary: "Επιτυχία",
            message: resp.data.message,
          });
        }catch (e) {
          showMessage({
            severity: "error",
            summary: "Σφάλμα",
            message: e?.response?.data?.error || e.message,
          });
        } finally {
          setSubmitted(prev=> !prev);
          setLoading(false);
          hideDialog();
        }

        
       
          
    }
  //update images on edit:
  const updateImage = async (image, name) => {
    try {
      const { data } = await axios.put("/api/product/apiMarkes", {
        action: "putImage",
        update: { [name]: image},
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
      <Dialog
        visible={dialog}
        style={{ width: "30rem" }}
        header={
          isEdit
            ? "Τροποποίηση Μάρκας"
            : "Προσθήκη Μάρκας"
        }
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={handleCloseDialog}
        maximizable
      >
        <form className="form">
          <Input
            label={"Όνομα"}
            name={"name"}
            mb={"10px"}
            required
            control={control}
            error={errors.name}
          />
          <TextAreaInput
            label={"Περιγραφή"}
            name={"description"}
            mb={"20px"}
            control={control}
          />
         

          <div>
            <p className="text-lg font-bold mb-2">Pim Access</p>
            <Input label={"Pim URL"} name={"pimUrl"} control={control} />
            <div className="product_form_grid_row">
            <Input
              label={"Pim Username"}
              name={"pimUserName"}
              control={control}
            />
            <Input
              label={"Pim Password"}
              name={"pimPassword"}
              control={control}
            />
            </div>
            <div className="product_form_grid_row">
            <Input
              label={"URL Ιστοσελίδας"}
              name={"webSiteUrl"}
              control={control}
            />
            <Input
              label={"URL Kαταλόγου"}
              name={"officialCatalogueUrl"}
              control={control}
            />
            </div>
            <div className="product_form_grid_row">
            <Input
              label={"URL facebook"}
              name={"facebookUrl"}
              control={control}
            />
            <Input
              label={"URL instagram"}
              name={"instagramUrl"}
              control={control}
            />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold mb-2">Βίντεο</p>
            <AddMoreInput
              setFormData={setVideoList}
              formData={videoList}
              mb={"20px"}
            />
          </div>
          <div className="drop_images_grid ">
            <div>
              <p className="font-bold mb-2">Eικονίδιο</p>
              <SingleImage
                isEdit={isEdit}
                name="logo"
                image={values.logo}
                setImage={(value) => setValue("logo", value)}
                updateImage={updateImage}
              />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
