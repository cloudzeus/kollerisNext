"use client";
import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useDropzone } from "react-dropzone";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { uploadBunny } from "@/utils/bunny_cdn";
import { Toast } from "primereact/toast";
import { Image as PrimeImage } from "primereact/image";
import { useToast } from "@/_context/ToastContext";

export const ImageGrid = ({
  uploadedFiles,
  setUploadedFiles,
  data,
  onDelete,
  onAdd,
  loading,
}) => {
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const handleDelete = async (name, _id) => {
    await onDelete(name, _id);
  };
  const Header = () => {
    return (
      <div>
        <Toast ref={toast} />
        <Button
          icon="pi pi-plus"
          label="προσθήκη"
          severity="secondary"
          onClick={() => setVisible(true)}
        />
        <FileUpload
          onAdd={onAdd}
          visible={visible}
          setVisible={setVisible}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      </div>
    );
  };

  const Actions = ({ name, _id }) => {
    return (
      <div>
        <i
          onClick={() => handleDelete(name, _id)}
          className="pi pi-trash cursor-pointer"
          style={{ fontSize: "1rem" }}
        ></i>
      </div>
    );
  };

  return (
    <DataTable
      rows={5}
      paginator
      rowsPerPageOptions={[5, 10, 25]}
      value={data}
      header={() => (
        <div>
          <Button
            icon="pi pi-plus"
            label="προσθήκη"
            severity="secondary"
            onClick={() => setVisible(true)}
          />
          <FileUpload
            onAdd={onAdd}
            visible={visible}
            setVisible={setVisible}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        </div>
      )}
      loading={loading}
    >
      <Column body={ImageTemplate} field="path" header="Φωτογραφία"></Column>
      <Column style={{ width: "80px" }} body={Actions}></Column>
    </DataTable>
  );
};

const ImageTemplate = ({ name }) => {
  return (
    <div className="flex">
      <PrimeImage
        src={`https://kolleris.b-cdn.net/images/${name}`}
        alt="Image"
        width={60}
        style={{ objectFit: "contain", height: "100%" }}
        preview
      />
    </div>
  );
};

const FileUpload = ({
  visible,
  setVisible,
  uploadedFiles,
  setUploadedFiles,
  onAdd,
}) => {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    // ON drop add any new file added to the previous stat
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/jpg": [],
      "image/svg+xml": [],
    },
    onDrop: (acceptedFiles) => {
      let newfiles = acceptedFiles.map((file) => {
        return {
          file: file,
          name: file.path,
        };
      });
      setUploadedFiles((prev) => [...prev, ...newfiles]);
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    const readAsArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    };

    //Turn the file into binary and use the uploadBunny function in utils to send it to bunny cdn
    for (let item of uploadedFiles) {
      try {
        const arrayBuffer = await readAsArrayBuffer(item.file);
        const result = await uploadBunny(arrayBuffer, item.name);
        if (result.HttpCode === 201 || result.Message === "File uploaded.") {
          showMessage({
            severity: "success",
            summary: "Επιτυχία",
            message: "Η φωτογραφία ανέβηκε επιτυχώς",
          });
          setUploadedFiles([]);
        } else {
          showMessage({
            severity: "error",
            summary: "Σφάλμα",
            message: "Αποτυχία μεταφόρτωσης φωτογραφίας στο Bunny CDN",
          });
        }
      } catch (error) {
        showMessage({
          severity: "error",
          summary: "Σφάλμα",
          message:
            error.message || "ΑΠοτυχία μεταφόρτωσης φωτογραφίας στο Bunny CDN",
        });
      } finally {
        setLoading(false);
      }
    }
    let res = await onAdd();
    setUploadedFiles([]);
  };
  const removeImage = async ({ name }) => {
    let newFiles = uploadedFiles.filter((file) => file.name !== name);
    setUploadedFiles(newFiles);
  };

  return (
    <Dialog
      header="Uploader"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => setVisible(false)}
    >
      <div className="cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        <Button {...getInputProps()} label="drag and drop" />
        <div className="h-6rem border-round p-3 pointer-cursor border-1 border-dashed flex align-items-center justify-content-center">
          <p className="text-md">Σείρετε ή επιλέξτε αρχεία για ανέβασμα</p>
        </div>
      </div>
      {uploadedFiles.map((item, index) => (
        <ImageItem
          fileItem={item}
          key={index}
          removeImage={removeImage}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ))}
      {uploadedFiles.length ? (
        <Button
          loading={loading}
          label="Ολοκλήρωση"
          onClick={onSubmit}
          className="mt-2"
        />
      ) : null}
    </Dialog>
  );
};

const ImageItem = ({
  fileItem,
  index,
  removeImage,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [localValue, setLocalValue] = useState(fileItem.name);
  const handleEdit = (e) => {
    setLocalValue(e.target.value);
    let newFiles = uploadedFiles.map((mapitem) => {
      if (mapitem.file.path === fileItem.file.path) {
        return {
          ...mapitem,
          name: e.target.value,
        };
      }
      return mapitem;
    });
    setUploadedFiles(newFiles);
  };
  return (
    <div
      className=" flex  justify-content-between p-2 border-round surface-200 mb-1 mt-2"
      key={index}
    >
      <InputText
        onChange={handleEdit}
        className="w-full border-none"
        placeholder="Search"
        value={localValue}
      />
      <div className="flex bg-surface-200 align-items-center">
        <i
          onClick={() => removeImage(fileItem)}
          className="pi pi-trash text-surface-400  p-2 border-round cursor-pointer ml-1"
          style={{ fontSize: "1.2rem" }}
        ></i>
      </div>
    </div>
  );
};

export default ImageGrid;
