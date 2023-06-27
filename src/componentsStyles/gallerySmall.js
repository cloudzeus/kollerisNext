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
    width: 250px;
    margin-right: 10px;
`;
const LargeImage = styled.div`
  /* flex: 0 0 auto; */
  width: 250px;
  height: 220px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.05);
  border: 1px solid #dfdedf;
  img {
    object-fit: cover;
  }

`;

const ThumbnailContainer = styled.div`
  width: calc(100% - 250px);
  /* flex: 0 0 auto; */
  overflow-y: auto;
  overflow-x: hidden;
  height: 220px;
  padding: 0 10px;
`;

const ThumbnailGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
 
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
  border: 1px solid #dfdedf;
  opacity: ${(props) => (props.isSelected ? 1 : 0.5)};
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.05);
  margin: 5px;
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