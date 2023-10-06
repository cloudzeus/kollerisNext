import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import ChooseSupplier from '@/components/SuppliersOrder/ChooseSupplier'
import ChooseProducts from '@/components/SuppliersOrder/ChooseProducts'
import ChosenProductsWrapper from '@/components/SuppliersOrder/ChosenProducts'
const CreateOrder = () => {
  return (
    <AdminLayout>
            <ChooseSupplier /> 
           
    </AdminLayout>
  )
}

export default CreateOrder