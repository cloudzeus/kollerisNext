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
    ThumbnailGrid,
    TabButton
} from '@/componentsStyles/gallerySmall';

import { TabView, TabPanel } from 'primereact/tabview';

export default function AddDeleteImages({state, setState,  multiple, handleUploadImages, singleUpload }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState( state[0]);
    const toast = useRef(null);


    console.log(state)
    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };


    const handleDeleteImage = async (image) => {
        let newArray = state.filter(prev => prev !== image)
        console.log(image)
       
        setState(newArray)
        if(singleUpload) {
            setSelectedImage('')
        }
        const currentIndex = state.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1 + state.length) % state.length;
        setSelectedImage(state[nextIndex]);
        try {
            let resp = await axios.post('/api/uploads/deleteImage', { filename: image })
            console.log('resp data')
            console.log(resp.data)
        } catch (e) {
            console.log(e)
        }
    };

    const handlePrevImage = () => {
        const currentIndex = state.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + state.length) % state.length;
        setSelectedImage(state[prevIndex]);
    };

    const handleNextImage = () => {
        const currentIndex = state.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1 + state.length) % state.length;
        setSelectedImage(state[nextIndex]);
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }

    const tab1HeaderTemplate = (options) => {
        return (
            <TabButton>
                 <button type="tab-button " onClick={options.onClick} className={options.className}>
                <i className="pi pi-trash mr-4" />
                {options.titleElement}
            </button>
            </TabButton>
           
        );
    };
    const tab2HeaderTemplate = (options) => {
        return (
            <TabButton>
                 <button type="tab-button " onClick={options.onClick} className={options.className}>
                <i className="pi pi-image mr-4" />
                {options.titleElement}
            </button>
            </TabButton>
           
        );
    };


    return (
        <div className="card">
            <Toast ref={toast} />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} >
                <TabPanel header="Διαγραφή"  headerTemplate={tab1HeaderTemplate}>
                {state.length > 0 ? (
                     <GalleryNotEmpty
                     images={state}
                     isSmall={true}
                     selectedImage={selectedImage}
                     handlePrevImage={handlePrevImage}
                     handleNextImage={handleNextImage}
                     handleDeleteImage={handleDeleteImage}
                     handleImageSelect={handleImageSelect}
                    />
                ) : (
                    <p>Δεν υπάρχουν φωτογραφίες</p>
                )}
                </TabPanel>
                <TabPanel header="Προσθήκη" headerTemplate={tab2HeaderTemplate}>
                <PrimeUploads
                    singleUpload={singleUpload}
                    state={state}
                    handleUploadImages={handleUploadImages}
                    setState={setState}
                    multiple={multiple}
                    mb={'30px'} 
                />
                </TabPanel>
            
            </TabView>
        </div>
    )
}




const GalleryNotEmpty = ({
    selectedImage,
    images,
    handlePrevImage, 
    handleNextImage, 
    handleImageSelect,
    handleDeleteImage,
    isSmall
    }) => {
    return (
        <>
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
                    { images.length > 1 ? (
                         <ThumbnailContainer isSmall={isSmall} >
                         <ThumbnailGrid>
                             { images.map((image, index) => (
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
           
        </>
    )
}


