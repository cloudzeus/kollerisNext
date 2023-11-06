import axios from 'axios';
import { set } from 'mongoose';
import React, { useState } from 'react'

const TestUpload = () => {
    const [binaryData, setBinaryData] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const onUpload = async (event) => {
        const file = event.target.files[0];
        console.log(file)
        setSelectedFile(file)
    }

    const onSubmit = async () => {
        if (!selectedFile) return;
      
        const reader = new FileReader();
      
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result;
            const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(arrayBuffer));
            const hashString = Array.from(new Uint8Array(hash))
              .map((byte) => byte.toString(16).padStart(2, '0'))
              .join('')
              .toUpperCase();
      
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('hash', hashString);
      
            try {
              const response = await axios.post('/api/storageZone', formData);
              console.log('Backend response:', response.data);
            } catch (error) {
              console.error('Error:', error);
            }
          } catch (error) {
            console.error('Error calculating hash:', error);
          }
        };
      
        reader.readAsArrayBuffer(selectedFile);
      };
    return (
        <div className='p-2'>
            <label htmlFor="avatar">Choose a profile picture:</label>
            <input type="file" id="avatar" name="avatar" onChange={onUpload} />
            <div>
                <button  onClick={onSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default TestUpload;