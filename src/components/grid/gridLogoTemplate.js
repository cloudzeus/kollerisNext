import { ImageDiv } from "@/componentsStyles/grid";
import Image from "next/image";

const GridLogoTemplate = ({logo}) => {
    return (
        <ImageDiv>
            {logo ? (
                <Image
                src={`/uploads/${logo}`}
                alt={logo}
                sizes="40px"
                fill={true}

            />
            ) : (
                <i className="pi pi-image" style={{ fontSize: '30px', color: '#e6e7e6' }}></i>
            )}
            
        </ImageDiv>

    )
}


export default GridLogoTemplate;