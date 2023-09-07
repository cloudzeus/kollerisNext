

import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import styled from 'styled-components';
import { useRouter } from 'next/router';

export default function BreadCrumbs({labels}) {
    const route = useRouter();
    let {pathname} = route;
    let paths = pathname.split('/').filter((el) => el !== '' && el !== 'dashboard');
 
    const items  = []
    for(let path of paths) {
            items.push({
                label: path,
            })
        
        
    }

    const home = { icon: 'pi pi-home' }

    return (
        <Container>
            <BreadCrumb model={items} home={home} />
        </Container>
    
    )
}
        


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