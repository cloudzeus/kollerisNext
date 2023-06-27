import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Button } from 'primereact/button';




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

const Gallery = ({label}) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    const handleDeleteImage = (image) => {
        // Implement your delete logic here
        console.log(`Deleting image: ${image}`);
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
        <label style={{marginBottom: '5px'}}>
            {label}
        </label>
              <GalleryContainer>
           <LargeImageContainer>
               <LargeImage>
                   <Image src={`/uploads/${selectedImage}`} alt="Large" fill={true} />
               </LargeImage>
               <ArrowContainer>
                   {images.length > 1 && (
                       <>
                           {selectedImage !== images[0] && (
                               <Button onClick={handlePrevImage} icon="pi pi-angle-left" rounded outlined  aria-label="Favorite" />
                           )}
                           {selectedImage !== images[images.length - 1] && (
                               <Button onClick={handleNextImage} icon="pi pi-angle-right" rounded outlined  aria-label="Favorite" />
                           )}
                       </>
                   )}
               </ArrowContainer>
               <DeleteButton>
               <Button onClick={() => handleDeleteImage(selectedImage)}  icon="pi pi-times" severity="danger" aria-label="Cancel" />

                 
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
        </>
    );
};






export default Gallery;
