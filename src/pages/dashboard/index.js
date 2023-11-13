import React, {useEffect} from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useSession, signIn, signOut } from "next-auth/react"
import { StyleClass } from 'primereact/styleclass';


const Page = () => {
  const session = useSession();
 

  return (
        <AdminLayout>
            <p>rgdg</p>
      </AdminLayout>
    
  )
}

export default Page;