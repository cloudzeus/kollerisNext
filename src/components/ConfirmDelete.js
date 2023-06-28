import React, { useRef, useState } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
export default function Confirm({rowData, onConfirm, status}) {
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);

    

    const reject = () => {
       setVisible(false)
    }

  
  
    const accept = () => {
        onConfirm()
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog 
            visible={visible}
            message="Are you sure you want to proceed?" 
            header="Confirmation"
            accept={accept}
            reject={reject}
            />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button onClick={() => status && setVisible(true)} icon="pi pi-trash" severity="danger"></Button>
            </div>
        </>
    )
}