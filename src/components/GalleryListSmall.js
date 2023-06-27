import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PrimeUploads from './Forms/PrimeImagesUpload';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Button } from 'primereact/button';
import {
    ActionsDiv, GalleryContainer,
    DeleteButton,
    ArrowContainer,
    Thumbnail,
    ThumbnailContainer,
    LargeImageContainer,
    LargeImage,
    ThumbnailGrid
} from '@/componentsStyles/gallerySmall';







const GallerySmall = ({ label, images, updateUrl, id }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [show, setShow] = useState(false)
    const [imagesToUpload, setImagesToUpload] = useState([])
    const [uploadImages, setUploadImages] = useState(images)

    const toast = useRef(null);


    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        const handleAdd = async () => {
            let resp = await axios.post('/api/product/apiImages', {action: "addImages", id: id, images: imagesToUpload})
            console.log(resp)
            if(resp.data.success) {
                showSuccess()
            } else {
                showError()
            }
        }
        if (imagesToUpload.length > 0) {
            handleAdd();
        }
    }, [imagesToUpload, id])

    const handleDeleteImage = async (image) => {
        // Implement your delete logic here
        console.log(`Deleting image: ${image}`);
        let newArray = uploadImages.filter(prev => prev !== image)
        console.log(newArray)
        setUploadImages(newArray)

        //after deletion set another images as the main slideshow image:
        const currentIndex = uploadImages.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1 + uploadImages.length) % uploadImages.length;
        setSelectedImage(uploadImages[nextIndex]);
        //perfrom the database update upon deletion:
        let resp = await axios.post(updateUrl, { action: 'deleteImages', image: image, id: id })
        if (resp.success) {
            showSuccess()
        } else (
            showError()
        )
    };

    const handlePrevImage = () => {
        const currentIndex = images.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex]);
    };

    const handleNextImage = () => {
        const currentIndex = images.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }

    return (
        <>
            <Toast ref={toast} />
            <label style={{ marginBottom: '5px' }}>
                {label}
            </label>
            <ActionsDiv>
                <span className="p-buttonset">
                    <Button label="Gallery" icon="pi pi-images" size="small" onClick={() => setShow(prev => !prev)} />
                    <Button label="Προσθήκη" icon="pi pi-images" size="small" onClick={() => setShow(prev => !prev)} />
                </span>
            </ActionsDiv>
            {show ? (
                <GalleryContainer>
                    <LargeImageContainer>
                        <LargeImage>
                            <Image
                                src={`/uploads/${selectedImage}`}
                                alt="Large"
                                fill={true}
                                sizes="220px"
                            />
                        </LargeImage>
                        <ArrowContainer>
                            {images.length > 1 && (
                                <>
                                    {selectedImage !== images[0] && (
                                        <Button onClick={handlePrevImage} icon="pi pi-angle-left" rounded outlined aria-label="Favorite" />
                                    )}
                                    {selectedImage !== images[images.length - 1] && (
                                        <Button onClick={handleNextImage} icon="pi pi-angle-right" rounded outlined aria-label="Favorite" />
                                    )}
                                </>
                            )}
                        </ArrowContainer>
                        <DeleteButton>
                            <Button onClick={() => handleDeleteImage(selectedImage)} icon="pi pi-trash" severity="danger" aria-label="Cancel" />

                        </DeleteButton>
                    </LargeImageContainer>
                    <ThumbnailContainer>
                        <ThumbnailGrid>
                            {images.map((image, index) => (
                                <Thumbnail key={index} isSelected={image === selectedImage}>
                                    <Image
                                        src={`/uploads/${image}`}
                                        alt={`Thumbnail ${index}`}
                                        fill={true}
                                        sizes="100px"
                                        onClick={() => handleImageSelect(image)} />
                                    {/* <button onClick={() => handleDeleteImage(image)}>
                               <i className="pi pi-times" style={{ fontSize: '1.5rem' }}></i>
                           </button> */}
                                </Thumbnail>
                            ))}
                        </ThumbnailGrid>
                    </ThumbnailContainer>
                </GalleryContainer>
            ) : (
                <PrimeUploads
                    setState={setImagesToUpload}
                    multiple={true}
                    mb={'30px'} />
            )}

        </>
    );
};






export default GallerySmall;
