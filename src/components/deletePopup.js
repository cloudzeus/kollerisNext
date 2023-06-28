
import React, { useRef, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
export default function DeletePopup({onDelete, status}) {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);
    const accept = () => {
        onDelete();
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    };

    const reject = () => {
        // toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };
    
   

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup 
                target={buttonEl.current} 
                visible={visible} 
                onHide={() => setVisible(false)} 
                acceptClassName= 'p-button-danger'
                message="Θέλετε να προχωρήσετε σε διαγραφή;" 
                icon="pi pi-exclamation-triangle"
                acceptLabel={'Ναι'}
                rejectLabel={'Όχι'}
                accept={accept} 
                reject={reject} />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button 
                    disabled={!status}
                    ref={buttonEl} 
                    onClick={() => setVisible(prev => !prev)} 
                    icon="pi pi-trash"  
                    className="p-button-danger"></Button>
            </div>
        </>
    )
}
        