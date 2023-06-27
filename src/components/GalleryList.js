import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Button } from 'primereact/button';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import PrimeUploads from './Forms/PrimeImagesUpload';
import { setUploadImages } from '@/features/upload/uploadSlice';
import { Add } from '@mui/icons-material';



const GalleryContainer = styled.div`
  display: flex;
  align-items: flex-start;
  
 
`;

const LargeImageContainer = styled.div`
    position: relative;

`;
const LargeImage = styled.div`
  /* flex: 0 0 auto; */
  width: 300px;
  height: 300px;
  border-radius: 4px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
  @media (max-width: 716px) {
    width: 200px;
    height: 200px;
  }
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  img {
    object-fit: cover;
  }

`;

const ThumbnailContainer = styled.div`
  width: 70%;
  /* flex: 0 0 auto; */
  max-width: 700px;
  overflow-y: auto;
  height: 300px;
 
  @media (max-width: 716px) {
    height: 200px;
  }
  padding: 0 10px;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  justify-items: center;
  grid-gap: 5px;

    @media (max-width: 1064px) {
        grid-template-columns: repeat(5, 1fr);
    }
    @media (max-width: 956px) {
        grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 854px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 696px) {
        grid-template-columns: repeat(2, 1fr);
    }
   
   
`;

const Thumbnail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 4px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  opacity: ${(props) => (props.isSelected ? 1 : 0.3)};
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.05);

  img {
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 0;
    left: 0;

  }
`;

const ArrowContainer = styled.div`
    position: absolute;
    bottom: 10px;
    /* transform: translateY(-50%); */
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .p-button  {
        background-color: #fff;
        opacity: 70%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    } 
    .p-button:enabled:hover, .p-button:not(button):not(a):not(.p-disabled):hover {
        background-color: #fff;
        opacity: 70%;
    } 
    
`;

const DeleteButton = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
`



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
    useEffect(() => {
        const handleAdd = async () => {
            // let resp = await axios.post('api/product/apiImages', {action: "addMoreImages", id: '1', images: imagesToUpload})
        }
        if (imagesToUpload.length > 0) {

        }
    })

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
            <TopDiv>
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


            </TopDiv>




        </>
    );
};



const TopDiv = styled.div`

`

const ActionsDiv = styled.div`
    margin-bottom: 20px;
`
const AddPhotosDiv = styled.div`
    margin-top: 40px;
    margin-bottom: 20px;
`

export default Gallery;
