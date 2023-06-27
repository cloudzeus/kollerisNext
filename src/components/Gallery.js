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

    const handleImageSelect = (image) => {
        setSelectedImage(image);
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


    return (
        <>
            <label style={{ marginBottom: '5px' }}>
                {label}
            </label>
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
        </>
    );
};






export default GallerySmall;
