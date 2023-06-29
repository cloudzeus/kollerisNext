
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

const SyncBrand  = () => {
        const { dataNotFoundInAriadne} = useSelector((store) => store.notFoundAriadne)
        // console.log(dataNotFoundInAriadne)
        const dispatch = useDispatch();
        useEffect(() => {
            const findExtraSoftone = async () => {
                dispatch(notFoundAriadneApi())
            }
            findExtraSoftone();
        }, [dispatch])
        return (
            <>
                <SyncData data={dataNotFoundInAriadne} />
            </>
        )
}


    function SyncData({data}) {

    const [selectedProduct, setSelectedProduct] = useState(null);
    const op = useRef(null);
    const toast = useRef(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <span>
                   <Button  icon="pi pi-sync" onClick={() => console.log('click')} />
            </span>
            
        );
    };



    return (
        <div className="card flex flex-column align-items-center gap-3">
            <Toast ref={toast} />
            <Button 
                type="button" 
                icon="pi pi-sync"  
                label="sync"
                className="p-button-secondary"
                tooltip='Αν νέες εγγραφές έχουν προστεθεί στο softone θα εμφανιστούν εδώ.
                Πατήστε για να δείτε τις εγγραφές'
                tooltipOptions={{ position: 'left' }}
                onClick={(e) => op.current.toggle(e)}>
                <Badge value="8" severity="warning"></Badge>
            </Button>
            <OverlayPanel ref={op} showCloseIcon>
                <DataTable value={data} selectionMode="single" paginator rows={5} selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)}>
                    <Column field="NAME" header="Name" sortable style={{minWidth: '12rem'}} />
                    <Column body={actionBodyTemplate} textAlign="right"  style={{minWidth: '12rem'}} />
                </DataTable>
            </OverlayPanel>
        </div>
    );
}
        

export default SyncBrand;