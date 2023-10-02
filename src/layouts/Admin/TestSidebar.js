import React from 'react'
import Link from 'next/link'
const TestSidebar = () => {
  return (
    <div  style={{width: '250px'}}>
        <div className='p-4 w-full'>
            <Link className='p-2 surface-400 border-round block' href='/dashboard/product' replace={false}>Product</Link>
        </div>
        <div className='p-4 w-full'>
            <Link className='p-2 surface-400 border-round block' href='/dashboard/product/brands' replace={false}>Brands</Link>
        </div>
    </div>
  )
}

export default TestSidebar