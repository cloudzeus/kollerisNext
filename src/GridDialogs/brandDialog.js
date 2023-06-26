
import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import ImageUploads from '@/components/Forms/PrimeImagesUpload';
import Gallery from '@/components/GalleryList';
import GallerySmall from '@/components/GalleryListSmall';
const EditDialog = ({ data, dialog, hideDialog, saveProduct, submitted, setData }) => {
    console.log(data)
    console.log('brand data: ' + JSON.stringify(data))

  
    const onInputChange = (e) => {
       const { name, value } = e.target;
    
    //      setData(prev => ({}))
        setData(prev => ({ ...prev, [name]: value}))
    }


    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );

    return (
        <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <Input
                label={'Name'}
                name={'name'}
                value={data.name}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <GallerySmall  />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
            <Input
                label={'Περιγραφή'}
                name={'description'}
                value={data.description}
                required={true}
                onChange={(e) => onInputChange(e)}
            />
        </Dialog>
    )
}


const AddDialog = ({ data, dialog, hideDialog, saveProduct, submitted }) => {
    console.log('succesfull brand data: ' + JSON.stringify(data))


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
            <p>addf Dialog</p>

        </Dialog>
    )

}

export { EditDialog, AddDialog }
