import React from "react";
import { Button } from "primereact/button";
import { useDropzone } from "react-dropzone";
import { uploadBufferBunny, deleteBunny } from "@/utils/bunny_cdn";
import { useToast } from "@/_context/ToastContext";
import Image from "next/image";

export function SingleImage({ name, image, setImage, updateImage, isEdit}) {

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
    multiple: false,
    onDrop: handleDrop
  });

  const handleDelete = async () => {
    let bunny;
    let update;

    try {
      bunny = await deleteBunny(image);
      if (bunny.status === 404) {
        update = await updateImage("", name);
        setImage("");
        return;
      }
      if (bunny.error) throw new Error(bunny.error);
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message:
          e.message ||
          "An unknown error occurred while deleting the image from the CDN.",
      });
      return;
    }
    try {
      update = await updateImage("", name);
      if (update.error) throw new Error(update.error);
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message:
          e.message || "An unknown error occurred while adding the image.",
      });
      return;
    }

    showMessage({
      severity: "success",
      summary: "Επιτυχία",
      message: `${bunny.message}. ${update?.message}`,
    });
    setImage("");
  };


  async function handleDrop(acceptedFiles) {
    const file = acceptedFiles[0];
    try {
      let bunny;
        bunny = await uploadBufferBunny(file, file.name);
        if (bunny.error) throw new Error(bunny.error);

      if (isEdit) {
        const result = await updateImage(file.name, name);
        if (result.error) throw new Error(result.error);
        showMessage({
          severity: "success",
          summary: "Επιτυχία",
          message: `${bunny.message} ${result.message}`,
        });
      } else  {
        showMessage({
          severity: "success",
          summary: "Επιτυχία",
          message: bunny.message,
        });
      }


      setImage(file.name);
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e.message || "An unknown error occurred.",
      });
    }
  }

  return (
    <div>
      <div className="im_container">
        <div className="im_image_container">
          {image ? (
            <Image
              src={`https://kolleris.b-cdn.net/images/${image}`}
              alt={image}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <DropZoneImage
              getInputProps={getInputProps}
              getRootProps={getRootProps}
            />
          )}
        </div>
        <div className="image_trash_container">
          <p>
            {image && image.length > 10
              ? image.slice(0, 20).concat("...")
              : null}{" "}
          </p>
          <i
            className={` pi pi-trash ${
              !image ? "text-300" : "trash_img_enabled"
            }`}
            onClick={handleDelete}
          ></i>
        </div>
      </div>
    </div>
  );
}

const DropZoneImage = ({ getInputProps, getRootProps }) => {
  return (
    <div className="" {...getRootProps()}>
      <input {...getInputProps()} />
      <Button {...getInputProps()} label="drag and drop" />
      <div className="drag_add_image">
        <i className="pi pi-plus"></i>
        <p className="text-md">Σείρετε ή επιλέξτε αρχεία</p>
      </div>
    </div>
  );
};
