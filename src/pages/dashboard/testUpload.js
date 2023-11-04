import axios from 'axios';
import { set } from 'mongoose';
import React, { useState } from 'react'

const TestUpload = () => {
    const [file, setFile] = useState(null)
    const [binaryData, setBinaryData] = useState(null)
    const onUpload = async (event) => {
        const selectedFile = event.target.files[0];
        const selectedFile2 = event.target.files;
        console.log(selectedFile)
        console.log('selectedfile2')
        console.log(selectedFile2)
          async function getBinaryFromFile(file) {
            return new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.addEventListener('load', () => resolve(reader.result))
              reader.addEventListener('error', (err) => reject(err))
              reader.readAsArrayBuffer(file);
            })
          }
        
          const binary = await getBinaryFromFile(selectedFile)
          setBinaryData(binary)
          console.log(binary)
          

    }

    const onSubmit = async (event) => {
        const response = await axios.post('/api/storageZone', {
            body: binaryData,
        });
        console.log(response )
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