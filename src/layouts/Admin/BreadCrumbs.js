

import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import styled from 'styled-components';
import { useRouter } from 'next/router';

export default function BreadCrumbs({labels}) {
    const router = useRouter();
    return (
        <Container>
            {/* <BreadCrumb model={items} home={home} /> */}
            <div>
                <Btn onClick={() => router.push('/dashboard')}>
                    <i className="pi pi-home"></i>
                </Btn>
                <Btn onClick={() => router.back()}>
                    <i className="pi pi-angle-left"></i>
                </Btn>
              
            </div>
        </Container>
    
    )
}
        
const Btn = styled.button`
    width: 30px;
    height: 30px;
    border: none;
    background-color: #ededed;
    border-radius: 4px;
    color:#6366F1;
    margin-right: 6px;
`


const Container = styled.div`
    margin-left: 10px;
    .p-breadcrumb{
        border: none;
        border-radius: none;
        padding: 8px;
    }

    .p-breadcrumb .p-breadcrumb-list li .p-menuitem-link .p-menuitem-text {
        color: grey;
    }

    .p-breadcrumb-chevron {
        color: grey;
    }
`