import styled from "styled-components"

const ActionsDiv = styled.div`
    margin-bottom: 20px;
    max-width: 300px;
    margin-top: 30px;
`
const GalleryContainer = styled.div`
  background-color: #f6f6f6;
  border-radius: 4px;
  border: 1px solid #dfdedf;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  max-width: 1400px;
  
`;

const LargeImageContainer = styled.div`
    position: relative;
    width: 220px;
    margin-right: 5px;
    border-radius: 4px;
`;
const LargeImage = styled.div`
  /* flex: 0 0 auto; */
  height: 220px;
  width: 220px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.05);
  border: 2px solid var(--primary-color);
  img {
    object-fit: cover;
    border-radius: 2px;
  }

`;

const ThumbnailContainer = styled.div` 
  width: ${props => props.isSmall ? 'calc(100% - 200px)' : 'calc(100% - 250px)'};
  /* flex: 0 0 auto; */
  overflow-y: auto;
  overflow-x: hidden;
  height: 220px;
  padding: 0 10px;
`;

const ThumbnailGrid = styled.div`
  display: flex;
  flex-wrap: wrap;

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
  filter: ${props => props.isSelected ? 'brightness(1.2)' : 'brightness(0.45)'};
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.05);
  margin: 5px;
  img {
    object-fit: cover;
  }

 
`;

const ArrowContainer = styled.div`
    position: absolute;
    bottom: 2px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    
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