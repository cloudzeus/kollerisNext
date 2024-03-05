import React, { useRef, useContext, useState } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import styled from 'styled-components'
import { ProductQuantityContext, ProductQuantityProvider } from '@/_context/ProductGridContext';

const MarkesActions = ({ rowData, onEdit, onOrder,  }) => {

  const op = useRef(null)
  return (
    <div className="">

      <div onClick={(e) => op.current.toggle(e)} className='flex align-items-center justify-content-center w-full h-full cursor-pointer'>
        <i className=" pi pi-cog" style={{ color: 'var(--primary-color)' }}></i>
      </div>
      <OverlayPanel className='w-20rem product-overlay' ref={op} showCloseIcon>
        <Button
          onClick={() => onEdit(rowData)}
          text
          className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1"
        >
          <div className='mr-2 w-2rem	h-2rem bg-primary-600 border-circle flex  align-items-center justify-content-center'>
            <i className="text-white pi pi-pencil text-sm " ></i>
          </div>
          Τροποποίηση
        </Button>
        <Button
            onClick={() => onOrder(rowData)}
          text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
          <div className='mr-2 w-2rem	h-2rem bg-orange-600 border-circle flex  align-items-center justify-content-center'>
            <i className="text-white pi pi-plus text-sm " ></i>
          </div>
          Νέα Παραγγελία
        </Button>
      
      
      </OverlayPanel>
    </div>
  )
}



export default MarkesActions;