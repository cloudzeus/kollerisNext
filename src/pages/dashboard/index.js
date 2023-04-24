import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import AuthWrapper from '@/components/Wrappers/AuthWrapper';
const DashboardIndex = () => {
  return (
    <AuthWrapper>
        <AdminLayout>
        <h1>Admin Dashboard</h1>
      </AdminLayout>
   </AuthWrapper>
    
  )
}

export default DashboardIndex;