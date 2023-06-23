import Image from "next/image";
const GalleryList = ({images}) => {
    return (
        <div>
            <h1>GalleryList</h1>
            {images.map((image, index) => {
                return (
                    <ImageDiv key={index}>
                    </ImageDiv>
                )
            })}
        </div>
    )
}

const ImageDiv = styled.div`
    width: 60px;
    height: 60px;
`

export default GalleryList;