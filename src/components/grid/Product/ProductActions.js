import React, { useRef, useContext, useState } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import { ProductQuantityContext } from '@/_context/ProductGridContext';
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedProducts, setSubmitted } from '@/features/productsSlice'
import axios from 'axios'
import Image from 'next/image'
import { useToast } from '@/_context/ToastContext'

const ProductActions = ({ 
	rowData, 
	onEdit, 
	onEditClass, 
	onAdd 
}) => {
	const { setActiveIndex, setVisible } = useContext(ProductQuantityContext)
	const {showMessage} = useToast();
	const dispatch = useDispatch()
	const router = useRouter();

    const { selectedProducts } = useSelector(store => store.products)
	const [loading, setLoading] = useState({
		active: false,
		skroutz: false,
	})
	const op = useRef(null)
	

	console.log({selectedProducts})

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
		if(!selectedProducts.length) {
			showMessage({
				severity: "info",
				summary: "Προσοχή",
				message: "Πρέπει να επιλέξετε προϊόντα για να συνεχίσετε"
			})
			return;
		}
		for(let product of selectedProducts) {
			if(product.MTRL) {
				showMessage({
					severity: "warn",
					summary: "Προσοχή",
					message: `Το προϊόν ${product.NAME} υπάρχει ήδη στο softone`
				})
				return;
			}
		}
		router.push('/dashboard/add-to-softone')
	}

	const handleAddToBucket = () => {
		dispatch(setSelectedProducts([...selectedProducts, rowData]))
	}

	const updateActiveMtrl  = async () => {
		const ISACTIVE = rowData.ISACTIVE
		const MTRL = rowData.MTRL
		try {
			setLoading(prev => ({...prev, active: true}))
			await axios.post('/api/product/apiProduct', { action: "updateActiveMtrl", id: rowData._id, MTRL: MTRL, ISACTIVE: ISACTIVE})
			showMessage({
				severity: "success",
				summary: "Επιτυχία",
				message: "Επιτυχής ενημέρωση"
			})
		} catch(e) {
			showMessage({
				severity: "error",
				summary: "Σφάλμα",
				message: e?.response?.data?.error || e.message
			})
		}	finally {
			dispatch(setSubmitted())
		setLoading(prev => ({...prev, active: false}))
		op.current.hide();
		}
		
		
	}

	const updateSkroutz = async () => {
		let isSkroutz = rowData.isSkroutz;
		const MTRL = rowData.MTRL
		try {
			await axios.post('/api/product/apiProduct', { action: "updateSkroutz", id: rowData._id, MTRL: MTRL, isSkroutz: isSkroutz})
			showMessage({
				severity: "success",
				summary: "Επιτυχία",
				message: "Επιτυχής ενημέρωση"
			})
		} catch (e) {
			showMessage({
				severity: "error",
				summary: "Σφάλμα",
				message: e?.response?.data?.error || e.message
			})
		} finally {
			dispatch(setSubmitted())
			setLoading(prev => ({...prev, active: false}))
			op.current.hide();
		}
		
	
	}
	
	return (
		<div className="">
			<div onClick={(e) => op.current.toggle(e)} className='flex align-items-center justify-content-center w-full h-full cursor-pointer'>
				<i className=" pi pi-cog" style={{ color: 'var(--primary-color)' }}></i>
			</div>
			<OverlayPanel className='w-16rem ' ref={op} showCloseIcon >
				<div className='flex flex-column gap-2'>
				<Button label="Τροποποίηση" icon="pi pi-pencil" className='w-full' 	onClick={() => onEdit(rowData)} />
				<Button severity='info' label="Προσθήκη Νέου" icon="pi pi-plus" className='w-full' onClick={() => onAdd(rowData)} />
				<Button
					onClick={onEditClass}
					className="action_menu_button"
					>
					Αλλαγή Κατηγοριοποίησης
				</Button>
				<Button
					onClick={handleChangeAvailability}
					className="action_menu_button"
					>
					Ενημέρωση αποθέματος
				</Button>
				<Button
					onClick={handleImpaChange}
					className="action_menu_button"
					>
					Ανάθεση – τροποποίηση IMPA
				</Button>
				<Button
					onClick={handleAddToSoftone}
					className="action_menu_button"
					>
					Προσθήκη στο Softone
				</Button>
				<Button
					onClick={handleAddToBucket}
					className="action_menu_button"
					>
					 Προσθήκη στο καλάθι
				</Button>
				<Button
					loading={loading.active}
					onClick={updateActiveMtrl}
					className="action_menu_button"
				>
					<div className='flex flex-column'>
						<div className='flex align-items-center'>
							<div style={{ width: '6px', height: '6px', borderRadius: '50%' }} className={`${rowData.ISACTIVE ? "bg-green-500 " : "bg-red-500"}  mt-1 mr-1`}></div>
							<span className='font-semibold'>{rowData.ISACTIVE ? 'Eνεργό' : 'Aνενεργό'} προϊόν</span>
						</div>
						<div className='flex justify-content-start'>
							<span style={{ fontSize: '11px', marginLeft: '11px' }} className='block' >{rowData.ISACTIVE ? 'Aπενεργοποίηση' : 'Ενεργοποίηση'}</span>
						</div>
					</div>
				</Button>
				<Button
					className="action_menu_button"
					loading={loading.skroutz}
					onClick={updateSkroutz}
				>
					<div className='w-full flex justify-content-between align-items-center'>
					<div className='flex flex-column '>
						<div className='flex align-items-center'>
							<div style={{ width: '6px', height: '6px', borderRadius: '50%' }} className={`${rowData.isSkroutz ? "bg-green-500 " : "bg-red-500"}  mt-1 mr-1`}></div>
							<span className='font-semibold'>{rowData.isSkroutz ? 'Eνεργό' : 'Aνενεργό'} Skroutz</span>
						</div>
						<div className='flex justify-content-start'>
							<span style={{ fontSize: '11px', marginLeft: '11px' }} className='block' >{rowData.isSkroutz ?'Aπενεργοποίηση' : 'Ενεργοποίηση'}</span>
						</div>
					</div>
					<div>
						<Image 
							src='/uploads/skroutz.png' 
							width={50} 
							height={15} 
							alt='skroutz'
						/>
					</div>
					</div>
				</Button>
				</div>
			</OverlayPanel>
		</div>
	)
}



export default ProductActions