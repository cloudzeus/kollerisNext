import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export default function TransaltionGrid() {
    const [products, setProducts] = useState([
        { Γλώσσα: 'Ελληνικά', En: 'Greek' },
    ]);

    useEffect(() => {
       
    }, []);

    return (
        <div className="card">
            {/* <Button label="Add" /> */}
            <DataTable value={products} >
                <Column style={{ width: '90px' }} field="Γλώσσα" header="Code"></Column>
                <Column field="name" header="Όνομα μάρκας"></Column>
                <Column field="name" header="Περιγραφή"></Column>
                
            </DataTable>
        </div>
    );
}
    