import React from 'react'
import AdminLayout from 'src/layouts/Admin/AdminLayout'
import { getUserFromLocalStorage } from '@/utils/localStorage'
import { useEffect, useState } from 'react'

const Test = () => {
  const [local, setLocal] = useState(null)
  useEffect(() => {
    let localStorageUser = getUserFromLocalStorage()
    console.log(localStorageUser)
    if(localStorageUser) {
      setLocal(localStorageUser)
    } else {
      setLocal('no user')
    }
   
  }, [])


  return (
    <AdminLayout>
      <div>
        <p>Test</p>
        <p>{local}</p>
      </div>
    </AdminLayout>
  )
}

export default Test