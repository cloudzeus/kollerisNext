import React, {useEffect} from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useSession, signIn, signOut } from "next-auth/react"

const DashboardIndex = () => {
  const session = useSession();
  console.log(session)


  return (
        <AdminLayout>
        <h1>Admin Dashboard</h1>
      </AdminLayout>
    
  )
}

export default DashboardIndex;