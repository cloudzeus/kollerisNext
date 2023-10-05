import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import ChooseSupplier from '@/components/SuppliersOrder/ChooseSupplier'
import ChooseProducts from '@/components/SuppliersOrder/ChooseProducts'
const CreateOrder = () => {
  return (
    <AdminLayout>
            <ChooseSupplier /> 
            {/* <ChooseProducts /> */}
    </AdminLayout>
  )
}

export default CreateOrder