import StepHeader from "@/components/StepHeader";
import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { OverlayPanel } from 'primereact/overlaypanel';
import CSVExport from '@/components/exportCSV/MultiOffer';
import ClientHolder from '@/components/client/ClientHolders';

const Page = () => {
    const router = useRouter();
    const { NAME } = router.query;
    return (
        <AdminLayout>
            <Button label="Back" className="p-button-outlined" onClick={() => router.back()} />
            <StepHeader text="Προσφορές πολλαπλών επιλογών" />
            < ClientHolder NAME={NAME} />
            <div className="mt-4">
            <StepHeader text="Προσφορές" />
            </div>

        </AdminLayout>
    )
}







export default Page;