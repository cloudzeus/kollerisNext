import React from 'react'
import PendingOrders from '@/components/suppliers/PendingOrders'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { useRouter } from 'next/router'
const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id)
  return (
    <AdminLayout>
      <PendingOrders id={id} />
    </AdminLayout>
  )
}

export default Page