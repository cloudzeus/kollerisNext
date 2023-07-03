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


import { Galleria } from 'primereact/galleria';

 function ControlledDemo({images}) {
    const [activeIndex, setActiveIndex] = useState(0)

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

   

    const next = () => {
        setActiveIndex(prevState => (prevState === images.length - 1) ? 0 : prevState + 1)
    }

    const prev = () => {
        setActiveIndex(prevState => (prevState === images.length + 1) ? 0 : prevState - 1)
    }

    const itemTemplate = (item) => {
        console.log(item)
        return (
            <Image
            src={`/uploads/${item}`}
            alt="Large"
            width={600}
            height={220}
            sizes="220px"
        />
        );
       
    }

    const thumbnailTemplate = (item) => {
        console.log(item)
        return (
                  <Image
            src={`/uploads/${item}`}
            alt="Large"
            width={60}
            height={60}
        />
        );
    }

    return (
        <div className="card">
            <div className="mb-3">
                <Button icon="pi pi-minus" onClick={prev} />
                <Button icon="pi pi-plus" onClick={next} className="p-button-secondary ml-2" />
            </div>

            <Galleria
                value={images}
                activeIndex={activeIndex}
                onItemChange={(e) => setActiveIndex(e.index)}
                responsiveOptions={responsiveOptions}
                numVisible={5}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
                style={{ maxWidth: '640px' }}
            />
        </div>
    )
}
        





const GallerySmall = ({ label, state, setState, updateUrl, id }) => {
    const [selectedImage, setSelectedImage] = useState( state[0]);
    const [uploadImages, setUploadImages] = useState( state)

    const [showGallery, setShowGallery] = useState(true);
    const [showUploads, setShowUploads] = useState(false);
    const toast = useRef(null);


    const handleShowGallery = () => {
        setShowGallery (true);
        setShowUploads(false);
    }
    const handleShowUploads = () => {
        setShowGallery (false);
        setShowUploads(true);
    }
    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };


    const handleDeleteImage = async (image) => {
        // Implement your delete logic here
        console.log(`Deleting image: ${image}`);
        let newArray = uploadImages.filter(prev => prev !== image)
        console.log('newArray ' + newArray)
        setUploadImages(newArray)

        // //after deletion set another images as the main slideshow image:
        const currentIndex = uploadImages.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1 + uploadImages.length) % uploadImages.length;
        setSelectedImage(uploadImages[nextIndex]);
        console.log(updateUrl)
        //perfrom the database update upon deletion:
        let resp = await axios.post(updateUrl, { action: 'deleteImages', image: image, id: id })
        if (resp.data.success) {
            showSuccess()
        } else (
            showError()
        )
    };

    const handlePrevImage = () => {
        const currentIndex = state.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + state.length) % state.length;
        setSelectedImage(state[prevIndex]);
    };

    const handleNextImage = () => {
        const currentIndex = state.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1 + uploadImages.length) % uploadImages.length;
        setSelectedImage(state[nextIndex]);
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }

    const ComponentGallery = () => {
        return (
            <>
                {showGallery ? (
                    //  <GalleryNotEmpty
                    //  isSmall={true}
                    //  uploadImages={uploadImages}
                    //  images={state}
                    //  selectedImage={selectedImage}
                    //  handlePrevImage={handlePrevImage}
                    //  handleNextImage={handleNextImage}
                    //  handleDeleteImage={handleDeleteImage}
                    //  handleImageSelect={handleImageSelect}
                    // />
                    <ControlledDemo  uploadImages={uploadImages}
                     images={state} />
                ) : null}
            </>
        )
    }

    const ComponentUploads = () => {
        return (
            <>
                {showUploads ? (
                    <PrimeUploads
                        setState={setState}
                        multiple={true}
                        mb={'30px'} />
                ) : null}
            </>
        )
    }

    return (
        <>
            <Toast ref={toast} />
            <label style={{ marginBottom: '5px' }}>
                {label}
            </label>
            <ActionsDiv>
                <span className="p-buttonset">
                    <Button label="Διαγραφή" icon="pi pi-images" size="small" onClick={handleShowGallery} />
                    <Button label="Προσθήκη" icon="pi pi-images" size="small" onClick={handleShowUploads} />
                </span>
            </ActionsDiv>
            <ComponentGallery />
            <ComponentUploads />
        </>
    );
};



const GalleryNotEmpty = ({
    images, 
    selectedImage, 
    handlePrevImage, 
    handleNextImage, 
    uploadImages, 
    handleImageSelect,
    handleDeleteImage,
    isSmall
    }) => {
    return (
        <>
            {images.length > 0 ? (
                 <GalleryContainer isSmall={isSmall}>
                 <LargeImageContainer  isSmall={isSmall}>
                     <LargeImage isSmall={isSmall}>
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
                     <DeleteButton>
                         <Button onClick={() => handleDeleteImage(selectedImage)} icon="pi pi-trash" severity="danger" aria-label="Cancel" />

                     </DeleteButton>
                 </LargeImageContainer>
                    {uploadImages.length > 1 ? (
                         <ThumbnailContainer isSmall={isSmall} >
                         <ThumbnailGrid>
                             {uploadImages.map((image, index) => (
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
                    ) : null}
             </GalleryContainer>
            ) : (
                <p>Δεν υπάρχουν φωτογραφίες</p>
            )}
        </>
    )
}


export default GallerySmall;
