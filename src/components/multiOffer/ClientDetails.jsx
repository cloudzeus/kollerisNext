'use client'
import React, {useEffect, useState, useRef} from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import axios from 'axios'
import { Toast } from 'primereact/toast';
import { setOfferEmail } from '@/features/impaofferSlice'
import { useDispatch, useSelector } from 'react-redux'



const ClientDetails = () => {
    const {selectedClient} = useSelector(state => state.impaoffer)
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
        setEditEmail((prev) => !prev)
        if(data.success) {
            showSuccess()
        } else {
            showWarn()
        }
    }

    useEffect(() => {
        dispatch(setOfferEmail(selectedClient?.EMAIL ? selectedClient.EMAIL : ''))
    }, [selectedClient])

    return (
        <>
            {selectedClient ? (
                  <div className='mt-3 bg-white p-4 border-round'>
                        <p className="stepheader">Eπιλογή Πελάτη</p>
                  <Toast ref={toast} />
                  <div className="flex flex-column gap-2 mb-4">
                      <label htmlFor="username">Στοιχεία Πελάτη</label>
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
                          <>
                              <div>
                                  <Button
                                      icon={"pi pi-check"}
                                      severity={"success"}
                                      onClick={onSubmitEmail}
                                      className='mr-2'
                                  />
                                  <Button
                                      icon={"pi pi-times"}
                                      severity={"danger"}
                                      onClick={() => setEditEmail(prev => !prev)}
                                  />
                              </div>
                          </>
      
                      )}
      
      
                    
                  </div>
              </div>
            ) : null}
        </>
    )
}

export default ClientDetails