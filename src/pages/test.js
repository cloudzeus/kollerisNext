import React from 'react'
import AdminLayout from 'src/layouts/Admin/AdminLayout'
import { getUserFromLocalStorage } from '@/utils/localStorage'
import { useEffect, useState } from 'react'

const Test = () => {
 

  return (
    <AdminLayout>
      <div>
        <p>Test</p>
      </div>
    </AdminLayout>
  )
}

export default Test