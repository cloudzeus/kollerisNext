import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ACCESS_KEY = 'd4374cd3-86c0-4943-903e419f73de-008e-4a66';

const fileName = 'test05.jpg'
const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'
const headers = {
  AccessKey: ACCESS_KEY,
  'Content-Type': 'application/octet-stream',
}


const TestUpload = () => {
    const [binaryData, setBinaryData] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const onUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                setBinaryData(arrayBuffer);
            };
        reader.readAsArrayBuffer(file);

    }


    useEffect(() => {
        console.log('binaryData')
        console.log(binaryData)
    }, [binaryData])

    
    const onSubmit = async () => {
        try {
            if (!binaryData) return;
            console.log(binaryData)
             let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/${fileName}`, binaryData , { headers: headers })
             console.log(result.data)
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className='p-2'>
            <label htmlFor="avatar">Choose a profile picture:</label>
            <input type="file" id="avatar" name="avatar" onChange={onUpload} />
            <div>
                <button disabled={!binaryData} onClick={onSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default TestUpload;