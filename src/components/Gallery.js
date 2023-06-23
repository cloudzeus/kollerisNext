import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import Image from 'next/image';
import styled from 'styled-components';


export default function GalleryImages({images}) {
    console.log('IMAGES: ' + JSON.stringify(images))

 
    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

  

    const itemTemplate = (image) => {
        return (
            <ImageDiv>
                <Image 
                src={'/uploads/' + image}
                alt={'alt'}
                fill={true}
            />
            </ImageDiv>
            
        )
    }

    const thumbnailTemplate = (image) => {
        return (
            <Image 
                src={'/uploads/' + image}
                alt={'alt'}
                fill={true}
            />
        )
    }

    return (
        <div>
            <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={7} circular style={{ maxWidth: '600px', height: 'auto' }}
                item={itemTemplate} thumbnail={thumbnailTemplate} />
        </div>
    )
}


const ImageDiv = styled.div`
    position: relative;
`