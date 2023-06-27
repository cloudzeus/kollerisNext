import styled from "styled-components"

const ActionsDiv = styled.div`
    margin-bottom: 20px;
    max-width: 300px;
    margin-top: 30px;
`
const GalleryContainer = styled.div`
  display: flex;
  align-items: flex-start;
  
 
`;

const LargeImageContainer = styled.div`
    position: relative;

`;
const LargeImage = styled.div`
  /* flex: 0 0 auto; */
  width: 200px;
  height: 200px;
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
  overflow-x: hidden;
  height: 200px;
  padding: 0 10px;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-items: center;
  grid-gap: 5px;
  -webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
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



export {
    ActionsDiv,
    GalleryContainer,
    DeleteButton,
    ArrowContainer,
    Thumbnail,
    ThumbnailContainer,
    LargeImageContainer,
    LargeImage,
    ThumbnailGrid 
}