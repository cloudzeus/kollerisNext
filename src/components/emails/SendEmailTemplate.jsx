'use client'
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from "primereact/checkbox";
import axios from 'axios';
const emails = [
    { email: 'kolleris@info.gr', default: true },
    { email: 'johnchiout.dev@gmail.com', default: true },
    { email: 'sample@gmail.com', default: false },
    { email: 'sample@gmail.com', default: false }
];


const SendEmailTemplate = ({ email, mt,  clientName, SALDOCNUM, createdAt, products,setRefetch}) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedCC, setSelectedCC] = useState([
        { email: 'kolleris@info.gr', default: true },
        { email: 'johnchiout.dev@gmail.com', default: true }
    ])

    const [state, setState] = useState({
        visible: false,
        subject: '',
        message: '',
        checked: true,
        fileName: ''
    })

    useEffect(() => {
        setState((prev) => (
            { ...prev, 
                subject: `Προσφορά με αριθμό ${SALDOCNUM} για τον πελάτη ${clientName}`,
                fileName: `kollers.offer.csv`,
                message: 'Καλησπέρα σας στον παρόν email θα βρείτε επισυναπτόμενο το αρχείο της προσφοράς. Στείλε το μας πίσω συμπληρωμένο με τα προϊόντα που έχετε αποδεχτεί. Ευχαριστούμε.'
            }
            ))
    
    }, [])


  
    

    const handleClose = () => {
        setVisible(false)
    }
   

    const handleSubject = (e) => {
        setState((prev) => ({ ...prev, subject: e.target.value }))
    }

    const handleMessage = (e) => {
        setState((prev) => ({ ...prev, message: e.target.value }))
    }
    const handleCheck = (e) => {
        setState((prev) => ({ ...prev, checked: e.checked }))
    }

    const finalSubmit = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/singleOffer', 
            { 
                action: 'sendEmail',
                cc: selectedCC,
                subject: state.subject,
                message: state.message,
                fileName: state.fileName,
                includeFile: state.checked,
                clientName: clientName,
                clientEmail: email, 
                products:  products, 
                SALDOCNUM: SALDOCNUM, 
                createdAt: createdAt,
            })
        setVisible(false)
        setLoading(false)
        setRefetch(prev => !prev)
    }
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Ακύρωση" icon="pi pi-times" severity="secondary" outlined onClick={handleClose} />
            <Button loading={loading} label="Αποστολή" icon="pi pi-envelope" severity="info" onClick={finalSubmit} />
        </React.Fragment>
    );

    return (
        <div>
            <Button className={`mt-${mt} w-full`} label="Δημιουργία Εmail" icon="pi pi-envelope" onClick={() => setVisible(true)} />
            <Dialog
                header="Εmail Template"
                visible={visible}
                onHide={() => setVisible(false)}
                style={{ width: '30vw', minWidth: '30rem' }}
                footer={productDialogFooter}
            >
                <div className="flex flex-column gap-2">
                    <label className='font-bold' htmlFor="username">Προς:</label>
                    <InputText value={email}  />
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label className='font-bold mb01' htmlFor="username">Κοινοποίηση:</label>
                    <MultiSelect display="chip" value={selectedCC} onChange={(e) => setSelectedCC(e.value)} options={emails} optionLabel="email"
                        placeholder="Eπιλογή" maxSelectedLabels={10} className="w-full" />
                </div>
                <div className="flex flex-column gap-2 mt-5">
                    <label className='font-bold' htmlFor="username">Προσθήκη Θέματος:</label>
                    <InputText value={state.subject} onChange={handleSubject} />
                </div>
                <div className="flex flex-column gap-2 mt-5">
                    <label className='font-bold' htmlFor="username">Kείμενο:</label>
                    <div className="card flex justify-content-center">
                        <InputTextarea
                            value={state.message}
                            placeholder='Πληκτρολογείστε για να εισάγετε το κείμενο του email'
                            onChange={handleMessage}
                            rows={5}
                            cols={30}
                            className='w-full'
                        />
                    </div>
                </div>
                {/* <div className="flex align-items-center mt-3">
                    <Checkbox id="attach" onChange={handleCheck} checked={state.checked} />
                    <label htmlFor="attach" className="ml-2">Το email να περιλαμβάνει csv αρχείο με τα προϊόντα</label>
                </div> */}
                <div className="flex flex-column gap-2 mt-5">
                    <label className='font-bold' htmlFor="username">Όνομα αρχείου CSV:</label>
                    <InputText value={state.fileName} onChange={handleSubject} />
                </div>
            </Dialog>
        </div>
    )
}


export default SendEmailTemplate