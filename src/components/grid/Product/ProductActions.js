import React, {useRef} from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import styled from 'styled-components'
const ProductActions = ({rowData, onEdit, onEditClass, openBasket, onAdd}) => {

    const op = useRef(null)
  return (
    <div className="">
        
          <div  onClick={(e) => op.current.toggle(e)} className='flex align-items-center justify-content-center w-full h-full cursor-pointer'>
            <i className=" pi pi-cog"  style={{ color: 'var(--primary-color)' }}></i>
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
                      text 
                      className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1"
                    >
                        <div className='mr-2 w-2rem	h-2rem bg-primary-600 border-circle flex  align-items-center justify-content-center'>
                          <i className="text-white pi pi-plus text-sm " ></i>
                        </div>
                        Προσθήκη Νέου
                    </Button>
                    <Button
                       
                        text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
                        <div className='mr-2 w-2rem	h-2rem bg-red-600 border-circle flex  align-items-center justify-content-center'>
                        <i className="text-white pi pi-trash text-sm " ></i>
                        </div>
                        Aπενεργοποίηση Softone
                    </Button>
                    {/* <h2 className='text-sm mt-2 ml-1'>Λειτουργίες:</h2>
                    <Button  onClick={() => onEditClass(rowData)}  text className='border-bluegray-100	w-full mt-2 text-bluegray-800'>Αλλαγή Κατηγοριοποίησης</Button>
                    <Button text className='border-bluegray-100	w-full mt-2 text-bluegray-800'>Καταχώριση IMPA</Button>
                    <Button text className='border-bluegray-100	w-full mt-2 text-bluegray-800'>Αλλαγή Διαθεσιμότητας</Button> */}
                </OverlayPanel>
    </div>
  )
}



export default ProductActions