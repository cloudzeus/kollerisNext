
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


const BrandDialog = ({data, dialog, hideDialog, saveProduct}) => {

    console.log('succesfull brand data: ' + JSON.stringify(data))
    const [submitted, setSubmitted] = useState(false);

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    // const {brandDialog} = useSelector(state => state.brand)
    console.log(dialog)
    return (
        <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
            <label htmlFor="name" className="font-bold">
                Name
            </label>
            <InputText id="name" value={data.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !data.name })} />
            {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
            <label htmlFor="description" className="font-bold">
                Description
            </label>
            <InputTextarea id="description" value={data.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
        </div>

    
    </Dialog>
    )
}


export default BrandDialog;