
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const UploadedProductsGrid = ({data}) => {
  return (
    <div>
           <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                <Column field="NAME" header="Όνομα"></Column>
                <Column field="SUPPLIER_NAME" header="Προμηθευτής"></Column>
                <Column field="STATUS" header="Status"></Column>
            </DataTable>
    </div>
  )
}

export default UploadedProductsGrid