import React from 'react'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
const AdminEmailConfirmation = () => {
    const router = useRouter()
   
    return (
        <div className='login_layout'>
            <div className='message-board'>
                    <h1>Oλοκληρώθηκε η Εγγραφή</h1>
                <Button 
                 onClick= {() => router.push('/auth/signin')}
                 size='140px' >Σύνδεση </Button>
            </div >
        </div>
    )
}





export default AdminEmailConfirmation