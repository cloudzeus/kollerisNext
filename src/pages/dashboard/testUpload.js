import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { getBunnyFile } from '@/utils/bunny_cdn';
import { uploadBunny } from '@/utils/bunny_cdn';


const ACCESS_KEY = 'd4374cd3-86c0-4943-903e419f73de-008e-4a66';

const fileName = 'test05.jpg'
const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'
const headers = {
    'Content-Type': 'application/octet-stream',
}


const TestUpload = () => {
    const [binaryData, setBinaryData] = useState(null)
    const [imageSrc, setImageSrc] = useState(null)
    const [imageSrc2, setImageSrc2] = useState(null)
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
        const blob = new Blob([binaryData], { type: 'image/jpeg' }); // Adjust the type accordingly
        const reader = new FileReader();

        reader.onload = () => {
            const dataUrl = reader.result;
            setImageSrc(dataUrl);
        };

        reader.readAsDataURL(blob);
    }, [binaryData]);



    const onSubmit = async () => {
        try {
            if (!binaryData) return;

            let result = await uploadBunny(binaryData)
            console.log('result')
            console.log(result)
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
            <>
                {imageSrc && <Image src={`${imageSrc}`} width={200} height={200} alt="Image from binary data" />}
                <Image src={"https://kolleris.b-cdn.net/test09.jpg"} width={200} height={200} alt="Image from binary data" />


            </>
        </div>
    )
}




export default TestUpload;