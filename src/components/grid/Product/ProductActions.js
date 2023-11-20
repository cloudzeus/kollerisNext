import React, { useRef, useContext } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { ProductQuantityContext, ProductQuantityProvider } from '@/_context/ProductGridContext';
import { useSelector, useDispatch } from 'react-redux'
import { setSingleProductForSoftone } from '@/features/productsSlice'
import { Toast } from 'primereact/toast'
import { setSelectedProducts } from '@/features/productsSlice'

const ProductActions = ({ rowData, onEdit, onEditClass, onAdd }) => {
	const { setActiveIndex, setVisible } = useContext(ProductQuantityContext)

	const toast = useRef(null)
	const dispatch = useDispatch()
	const router = useRouter();

	const showSuccess = () => {
		toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
	}

	const showError = (message) => {
		toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
	}

	const handleChangeClass = () => {
		console.log(rowData)
		dispatch(setSelectedProducts([rowData]))
		setVisible(true)
		setActiveIndex(1)
	}

	const handleChangeAvailability = () => {
		dispatch(setSelectedProducts([rowData]))
		setVisible(true)
		setActiveIndex(4)
	}
	const handleImpaChange = () => {
		dispatch(setSelectedProducts([rowData]))
		setVisible(true)
		setActiveIndex(2)
	}


	const handleAddToSoftone = () => {
		if (rowData.SOFTONESTATUS) {
			showError("To προϊόν υπάρχει ήδη στο softone");
			return;
		}
		dispatch(setSingleProductForSoftone(rowData))
		router.push('/dashboard/add-to-softone/add')
	}




	const handleSystemStatus = () => {
		console.log(rowData)
		let status;
		if (rowData.ISACTIVE == true) {
			status = "0"
		}
		if (rowData.ISACTIVE == false) {
			status = "1"
		}

		let obj = {
			MTRL: rowData.MTRL,
			NAME: rowData.NAME,
			CODE: rowData.CODE,
			VAT: rowData.VAT,
			PRICER: rowData.PRICER,
			PRICEW: rowData.PRICEW,
			PRICER01: rowData.PRICER01,
			PRICER02: rowData.PRICER02,
			PRICER03: rowData.PRICER03,
			PRICER04: rowData.PRICER04,
			PRICER05: rowData.PRICER05,
			PRICEW01: rowData.PRICEW01,
			PRICEW02: rowData.PRICEW02,
			PRICEW03: rowData.PRICEW03,
			PRICEW04: rowData.PRICEW04,
			PRICEW05: rowData.PRICEW05,
			ISACTIVE: status,
		}
		console.log('obj')
		console.log(obj)
	}


	const op = useRef(null)
	return (
		<div className="">
			<Toast ref={toast} />
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
					onClick={() => onAdd(rowData)}
					text
					className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1"
				>
					<div className='mr-2 w-2rem	h-2rem bg-primary-600 border-circle flex  align-items-center justify-content-center'>
						<i className="text-white pi pi-plus text-sm " ></i>
					</div>
					Προσθήκη Νέου
				</Button>
				<Button
					onClick={handleSystemStatus}
					text
					className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1"
				>
					<div className='flex flex-column'>
						<div className='flex align-items-center'>
							<div style={{ width: '8px', height: '8px', borderRadius: '50%' }} className={`${rowData.ISACTIVE ? "bg-green-500 " : "bg-red-500"}  mt-1 mr-1`}></div>
							<span className='font-semibold'>{rowData.ISACTIVE ? 'Eνεργό' : 'Aνενεργό'} προϊόν</span>
						</div>
						<span style={{fontSize: '12px'}}>{rowData.ISACTIVE ? 'Aπενεργοποίηση' : 'Ενεργοποίηση'}</span>
					</div>
				</Button>

				<Button
					onClick={handleChangeClass}
					text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
					Αλλαγή Κατηγοριοποίησης
				</Button>
				<Button
					onClick={handleChangeAvailability}
					text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
					{/* <div className='mr-2 w-2rem	h-2rem bg-orange-600 border-circle flex  align-items-center justify-content-center'>
            <i className="text-white pi pi-arrow-right text-sm " ></i>
          </div> */}
					Ενημέρωση αποθέματος
				</Button>
				<Button
					onClick={handleImpaChange}
					text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
					Ανάθεση – τροποποίηση IMPA
				</Button>
				<Button
					onClick={handleAddToSoftone}
					text className=" w-full  hover:bg-bluegray-200 border-bluegray-100 text-bluegray-800 mt-1 mb-1">
					Προσθήκη στο Softone
				</Button>
			</OverlayPanel>
		</div>
	)
}



export default ProductActions