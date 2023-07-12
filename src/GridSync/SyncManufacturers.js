
import React, { useState, useEffect, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Badge } from 'primereact/badge';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {  notFoundAriadneApi } from '@/features/syncProduct/markesNotFoundAriadne';
import axios from 'axios';
import { SyncButtonContainer } from '@/componentsStyles/grid';
import { useSession } from 'next-auth/react';

export default function SyncManufacturers({refreshGrid,  addToDatabaseURL}) {
        const { data: session, status } = useSession()
        const [loading, setLoading] = useState(false);
        const [data, setData] = useState([]);
        const [selectedProduct, setSelectedProduct] = useState(null);
        const op = useRef(null);
        const toast = useRef(null);

        const findExtraSoftone = async () => {
            let res = await axios.post('/api/product/apiManufacturers', { action: 'syncManufacturers' })
            console.log(res.data.result)
            setData(res.data.result)
        }

        useEffect(() => {
            findExtraSoftone();
        }, [])
  


    const handleSyncRowClick = async () => {
        console.log('sync row click')
        // setLoading(true)
        // let user = session.user.user.lastName
        // let res = await axios.post(addToDatabaseURL, { action: 'createMany', data: selectedProduct, createdFrom: user })
        // console.log(res.data)
        // if(!res.data.success) {
        //     showError()
        //     setLoading(false)
        // }
        // showSuccess()
        // findExtraSoftone();
        // refreshGrid();
        // setLoading(false)
    }
    
    
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής Προσθήκη στο σύστημα μας', life: 5000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία προσθήκης', life: 4000 });
    }


    const footerTemplate = () => {
        return (
            <div>
                <Button  loading={loading} label="Sync" icon="pi pi-sync" className="p-button-secondary" onClick={handleSyncRowClick}/>
            </div>
        );
    }


    return (
        <div className="card flex flex-column align-items-center gap-3">
            <Toast ref={toast} />
            < SyncButtonContainer >
            <Button 
                type="button" 
                icon="pi pi-sync"  
                label="sync"
                className="p-button-secondary"
                tooltip='Αν νέες εγγραφές έχουν προστεθεί στο softone θα εμφανιστούν εδώ.
                Πατήστε για να δείτε τις εγγραφές'
                tooltipOptions={{ position: 'left' }}
                onClick={(e) => op.current.toggle(e)}>
                <Badge value={data.length} severity="danger" />
            </Button>
            </ SyncButtonContainer>
           
            <OverlayPanel ref={op} showCloseIcon>
                <DataTable 
                    value={data} 
                    selectionMode="single" 
                    paginator 
                    rows={5} 
                    selection={selectedProduct} 
                    footer={footerTemplate}
                    onSelectionChange={(e) => setSelectedProduct(e.value)}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="NAME" header="Όνομα Kατασκευαστή Softone" sortable style={{minWidth: '12rem'}} />
                </DataTable>
            </OverlayPanel>
        </div>
    );
}
        

