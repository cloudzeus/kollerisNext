

import React from 'react';
import { useRouter } from 'next/router';

export default function BreadCrumbs({ labels }) {
    const router = useRouter();
    return (
        <div className={"breadcrumbContainer"}>
            <div>
                <button className={"breadcrumbButton"} onClick={() => router.push('/dashboard')}>
                    <i className="pi pi-home"></i>
                </button>
                <button className={"breadcrumbButton"} onClick={() => router.back()}>
                    <i className="pi pi-angle-left"></i>
                </button>
            </div>
        </div>
    );
}