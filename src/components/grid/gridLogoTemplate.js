import { useRef } from "react";
import { Image as PrimeImage } from "primereact/image";

const GridLogoTemplate = ({ logo }) => {
  return (
    <div className="image-div">
      {logo ? (
            <PrimeImage
              src={`https://kolleris.b-cdn.net/images/${logo}`}
              alt="Image"
              preview
            />
      ) : (
        <i
          className="pi pi-image"
          style={{ fontSize: "25px", color: "#e6e7e6" }}
        ></i>
      )}
    </div>
  );
};



export default GridLogoTemplate;
