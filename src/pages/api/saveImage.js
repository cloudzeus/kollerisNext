import fs from 'fs';
import axios from 'axios';

const saveImage = async (imageUrl) => {
  try {
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const imageName = 'my-image.jpg'; // Provide a name for the image
    const imagePath = `public/assets/imgs/${imageName}`; // Path to save the image
    fs.writeFileSync(imagePath, buffer);

    console.log('Image saved successfully!');
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

// Usage
saveImage('https://example.com/image.jpg');