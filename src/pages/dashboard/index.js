import React, {useEffect} from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useSession, signIn, signOut } from "next-auth/react"


const DashboardIndex = () => {
  const session = useSession();
 

  // useEffect(() => {
	// 	const handleToken = async () => {
	// 		const res = await fetch('http://localhost:3000/api/token', {
  //       headers: { "Content-Type": "application/json" },
  //     });
     
  //     if(res) {
  //       const resJson = await res.json();
  //       console.log(resJson)
  //     }
      
	// 	}
	// 	handleToken()
	// }, [])

  return (
        <AdminLayout>
        <h1>Admin Dashboard</h1>
      </AdminLayout>
    
  )
}

export default DashboardIndex;