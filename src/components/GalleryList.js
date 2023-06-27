import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Button } from 'primereact/button';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import PrimeUploads from './Forms/PrimeImagesUpload';


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






const Gallery = ({ label, images, updateUrl }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [uploadImages, setUploadImages] = useState(images)
    const [imagesToUpload, setImagesToUpload] = useState([])
    const [show, setShow] = useState(true);
    const toast = useRef(null);

    console.log('Images on the gallery componet: ' + JSON.stringify(images))
    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    //If images are added trigger databaseupdate:
   

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
        let resp = await axios.post(updateUrl, { action: 'deleteImages', image: image })
        if (resp.success) {
            showSuccess()
        } else (
            showError()
        )
    };

    const handlePrevImage = () => {
        const currentIndex = uploadImages.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + uploadImages.length) % uploadImages.length;
        setSelectedImage(uploadImages[prevIndex]);
    };

    const handleNextImage = () => {
        const currentIndex = uploadImages.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % uploadImages.length;
        setSelectedImage(uploadImages[nextIndex]);
    };
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
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
                                <Image src={`/uploads/${selectedImage}`} alt="Large" fill={true} />
                            </LargeImage>
                            <ArrowContainer>
                                {uploadImages.length > 1 && (
                                    <>
                                        {selectedImage !== uploadImages[0] && (
                                            <Button onClick={handlePrevImage} icon="pi pi-angle-left" rounded outlined aria-label="Favorite" />
                                        )}
                                        {selectedImage !== uploadImages[uploadImages.length - 1] && (
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
                                {uploadImages.map((image, index) => (
                                    <Thumbnail key={index} isSelected={image === selectedImage}>
                                        <Image
                                            src={`/uploads/${image}`}
                                            alt={`Thumbnail ${index}`}
                                            fill={true}
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
                        label={'Φωτογραφίες'}
                        setState={setImagesToUpload}
                        multiple={true}
                        mb={'30px'} />
                )}
        </>
    );
};





export default Gallery;
