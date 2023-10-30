import axios from 'axios';
import React, { useState } from 'react'

const TestUpload = () => {
    const [file, setFile] = useState(null)


    const onUpload = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

    }

    const onSubmit = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file, file.name);
            try {
                // Send the FormData to the server using an HTTP request (e.g., fetch or axios)
                const response = await fetch('/api/storageZone', {
                    method: 'POST',
                    body: formData,
                });

                // Handle the response from the server as needed
                if (response.ok) {
                    console.log('Image uploaded successfully.');
                } else {
                    console.error('Image upload failed.');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        } else {
            console.log('No file selected.');
        }

    }
return (
    <div className='p-2'>
        <label htmlFor="avatar">Choose a profile picture:</label>
        <input type="file" id="avatar" name="avatar" onClick={onUpload} />
        <div>
            <button onClick={onSubmit}>Submit</button>
        </div>
    </div>
)
}

export default TestUpload;