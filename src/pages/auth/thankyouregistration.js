'use client'
import React from 'react'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
const ThanksRegister = () => {
    const router = useRouter()
    return (
      <div className="login_layout">
        <div className="message-board">
          <div>
            <h1>Ευχαριστούμε για την εγγραφή σας!</h1>
            <p>Μόλις εγγριθεί ο λογαριασμός σας θα σας αποσταλεί email</p>
            <Button
           label="Επιστροφή στο login"  
           icon="pi pi-arrow-left"
           className='w-full mt-2'
           onClick={() => router.push('/auth/signin')}
           style={{width: '100%'}}
            />
          </div>
         
        </div>
      </div>
    )
  }

export default ThanksRegister
