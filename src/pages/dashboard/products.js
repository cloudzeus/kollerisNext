import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '@/layouts/Admin/AdminLayout'
const Products = () => {

    const handleReq = async () => {
        const res = await axios.post('/api/callSoftOne', {
            table: 'ITEMARK',
            fields: 'ITEMARK,name'

        })
        console.log(res.data    )
    }
    useEffect(() => {
        handleReq();
    }, [])
    return (
        <AdminLayout>
            <div>
                Products
                <button onClick={handleReq}>Make Request</button>
            </div>
        </AdminLayout>

    )
}

export default Products