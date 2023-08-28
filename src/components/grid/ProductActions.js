import React, {useRef} from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
const ProductActions = () => {

    const op = useRef(null)
  return (
    <div>
         <Button icon="pi pi-ellipsis-h" rounded text severity="secondary" aria-label="Bookmark"  onClick={(e) => op.current.toggle(e)} />
                <OverlayPanel className='w-20rem' ref={op} showCloseIcon>
                    <Button text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
                        <div className='mr-2 w-2rem	h-2rem bg-yellow-500 border-circle flex  align-items-center justify-content-center'>
                        <i className="text-white pi pi-shopping-cart text-sm"></i>
                        </div>
                         Προσθήκη στο καλάθι
                    </Button>
                    <Button text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
                        <div className='mr-2 w-2rem	h-2rem bg-primary-600 border-circle flex  align-items-center justify-content-center'>
                        <i className="text-white pi pi-pencil text-sm " ></i>
                        </div>
                        Διόρθωση
                    </Button>
                    <Button text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
                        <div className='mr-2 w-2rem	h-2rem bg-red-600 border-circle flex  align-items-center justify-content-center'>
                        <i className="text-white pi pi-trash text-sm " ></i>
                        </div>
                        Aπενεργοποίηση Softone
                    </Button>
                    <h2 className='text-sm mt-2 ml-1'>Λειτουργίες:</h2>
                    <Button text className='border-bluegray-100	w-full mt-2 text-bluegray-800'>Αλλαγή Διαθεσιμότητας</Button>
                    <Button text className='border-bluegray-100	w-full mt-2 text-bluegray-800'>Καταχώριση IMPA</Button>
                    <Button text className='border-bluegray-100	w-full mt-2 text-bluegray-800'>Αλλαγή Διαθεσιμότητας</Button>
                </OverlayPanel>
    </div>
  )
}

export default ProductActions