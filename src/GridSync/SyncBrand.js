
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
    export default function SyncBrand({refreshGrid,  addToDatabaseURL}) {
        const { data: session, status } = useSession()
        const [loading, setLoading] = useState(false);
        const { dataNotFoundInAriadne} = useSelector((store) => store.notFoundAriadne)
        const [selectedProduct, setSelectedProduct] = useState(null);
        const op = useRef(null);
        const toast = useRef(null);
        const dispatch = useDispatch();

        const findExtraSoftone = async () => {
            dispatch(notFoundAriadneApi())
        }

        useEffect(() => {
            findExtraSoftone();
        }, [])
  


    const handleSyncRowClick = async () => {
        setLoading(true)
        let user = session.user.user.lastName
        let res = await axios.post(addToDatabaseURL, { action: 'createMany', data: selectedProduct, createdFrom: user })
        console.log(res.data)
        if(!res.data.success) {
            showError()
            setLoading(false)
        }
        showSuccess()
        findExtraSoftone();
        refreshGrid();
        setLoading(false)
    }
    
    
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής Προσθήκη στο σύστημα μας', life: 5000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία προσθήκης', life: 4000 });
    }


    const footerTemplate = (data) => {
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
                <Badge value={dataNotFoundInAriadne.length} severity="danger" />
            </Button>
            </ SyncButtonContainer>
           

            <OverlayPanel ref={op} showCloseIcon>
                <DataTable 
                    value={dataNotFoundInAriadne} 
                    selectionMode="single" 
                    paginator 
                    rows={5} 
                    selection={selectedProduct} 
                    footer={footerTemplate}
                    onSelectionChange={(e) => setSelectedProduct(e.value)}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="NAME" header="Όνομα Softone" sortable style={{minWidth: '12rem'}} />
                    {/* <Column body={actionBodyTemplate} bodyStyle={{ textAlign: 'right' }}   style={{minWidth: '12rem'}} /> */}
                </DataTable>
            </OverlayPanel>
        </div>
    );
}
        

