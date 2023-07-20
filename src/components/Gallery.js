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


const GallerySmall = ({ label, images }) => {
    if(images.length === 0) {
        return <p>Δεν υπάρχουν φωτογραφίες</p>
    } 

    return (
        <Gallery label={label} images={images} />
    )
}




const Gallery = ({images, label}) => {
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
               {images ? (
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
                                <Button onClick={handlePrevImage} size='small' icon="pi  pi-angle-left" severity="primary" aria-label="Favorite" />
                                <Button onClick={handleNextImage} icon="pi  pi-angle-right" severity="primary"  aria-label="Favorite" />
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
               ) : <GalllerySkeleton images={images}/>}
        </>
    );
};



import React from 'react';
import { Skeleton } from 'primereact/skeleton';

 function GalllerySkeleton({images}) {
    return (
        <GalleryContainer>
                    <LargeImageContainer>
                        <LargeImage>
                            <Skeleton  width="250px" height="220px"></Skeleton>
                        </LargeImage>
                       
                    </LargeImageContainer>
                    <ThumbnailContainer>
                        <ThumbnailGrid>
                           
                            {images.map((image, index) => (
                                    <Thumbnail key={index}>
                                        <Skeleton  width="100px" height="100px"></Skeleton>
                                    </Thumbnail>
                                ))}
                          
                        </ThumbnailGrid>
                    </ThumbnailContainer>
                </GalleryContainer>
        
    );
}


export default GallerySmall;
