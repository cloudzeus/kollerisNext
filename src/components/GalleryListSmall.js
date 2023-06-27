import { useState, useRef } from 'react';
import Image from 'next/image';
import PrimeUploads from './Forms/PrimeImagesUpload';
import { Toast } from 'primereact/toast';
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





const images = [
    'addidas1.jpg',
    'addidas2.jpg',
    'addidas3.jpg',
    'addidas4.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',
    'addidas5.jpg',



    // Add more image paths here
];

const GallerySmall = ({ label, images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [show, setShow] = useState(false)
    const [imagesToUpload, setImagesToUpload] = useState([])
    const toast = useRef(null);


    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

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
        if (resp) {
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
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
    }

    return (
        <>
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
