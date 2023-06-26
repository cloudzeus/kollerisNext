import { useState } from 'react';
import Image from 'next/image';

const images = [
  '1685705325908_mountain.jpg',
  '1685705325908_mountain.jpg',
  '1685705325908_mountain.jpg',
  '1685705325908_mountain.jpg',
  // Add more image paths here
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (image) => {
    // Implement your delete logic here
    console.log(`Deleting image: ${image}`);
  };

  return (
    <div>
      <div className="large-image-container">
        <Image src={`/uploads/${selectedImage}`} alt="Large" width={500} height={500} />
      </div>
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <div key={index} className="thumbnail">
            <Image src={`/uploads/${image}`} alt={`Thumbnail ${index}`} width={100} height={100} onClick={() => handleImageSelect(image)} />
            <button onClick={() => handleDeleteImage(image)}>Delete</button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .large-image-container {
          width: 70%;
          float: left;
        }

        .thumbnail-container {
          width: 30%;
          float: right;
        }

        .thumbnail {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
