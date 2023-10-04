'use client'
import React, {useEffect, useState, useRef} from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import axios from 'axios'
import { Toast } from 'primereact/toast';
import { setOfferEmail } from '@/features/impaofferSlice'
import { useDispatch, useSelector } from 'react-redux'


const ClientDetails = ({ selectedClient }) => {
    const [email, setEmail] = useState('')
    const [editEmail, setEditEmail] = useState(false)
    const toast = useRef(null);
    const {offerEmail} = useSelector(state => state.impaoffer)
    const dispatch = useDispatch();

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Message Content', life: 3000});
    }

  
    const showWarn = () => {
        toast.current.show({severity:'warn', summary: 'Warning', detail:'Message Content', life: 3000});
    }


    const handleEmail = (e) => {
        dispatch(setOfferEmail(e.target.value))
    }

    const onSubmitEmail = async () => {
        let {data} = await axios.post('/api/createOffer', {action: "saveNewEmail", id: selectedClient._id, email: offerEmail})
        if(data.success) {
            showSuccess()
        } else {
            showWarn()
        }
    }

    useEffect(() => {
        setEmail(selectedClient?.EMAIL)
    }, [selectedClient])

    return (
        <div className='mt-3 bg-white p-4 border-round'>
            <Toast ref={toast} />
            <p className="font-bold mb-3 text-lg">Στοιχεία Πελάτη</p>
            <div className="flex flex-column gap-2 mb-4">
                <label htmlFor="username">Όνομα Πελάτη</label>
                <InputText
                    className='opacity-80 w-20rem'
                    disabled={true}
                    value={selectedClient?.NAME}
                    id="username"
                    aria-describedby="username-help"
                />
            </div>
            <label className='mb-2 block' htmlFor="username">Email Πελάτη</label>
            <div className="flex gap-2">
                <InputText
                    disabled={!editEmail}
                    onChange={handleEmail}
                    className={`w-20rem ${!editEmail && "opacity-80"}`}
                    value={offerEmail}
                    id="username"
                    aria-describedby="username-help"
                />
                {!editEmail ? (
                    <Button
                        onClick={() => { setEditEmail(prev => !prev) }}
                        icon={"pi pi-pencil"}
                        severity={"primary"}
                    />
                ) : (
                    <Button
                    icon={!editEmail ? "pi pi-pencil" : "pi pi-check"}
                    severity={"success"}
                    onClick={onSubmitEmail}
                />
                )}

              
            </div>
        </div>
    )
}

export default ClientDetails