import axios from 'axios';
import React, { useState } from 'react'

const TestUpload = () => {
    const [file, setFile] = useState(null)
    const [binaryData, setBinaryData] = useState(null)
    const onUpload = async (event) => {
        const selectedFile = event.target.files[0];
        // setFile(selectedFile);
        console.log(selectedFile)
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
              const binaryData = event.target.result;
              // At this point, 'binaryData' contains the raw binary data of the selected file.
              console.log('Raw Binary Data:', binaryData);
                setBinaryData(binaryData)
              // You can now send, manipulate, or process 'binaryData' as needed.
            };
        
            reader.readAsArrayBuffer(selectedFile);
          }

    }

    const onSubmit = async (event) => {
     
        const response = await fetch('/api/storageZone', {
            method: 'POST',
            body: binaryData,
        });
    }
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