import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { setTotalProductsPrice, setMtrLines, setDeleteMtrlLines, setIsFinalSubmit} from '@/features/supplierOrderSlice';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import StepHeader from '../ImpaOffer/StepHeader';
import OrderDetails from './OrderDetails';
import axios from 'axios';
const ChosenProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedProducts, isFinalSubmit, mtrLines, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
  console.log(selectedSupplier)
  useEffect(() => {
    if(selectedSupplier === null) {
      router.push('/dashboard/supplierOrder/createOrder')
    }
  }, [])

  const handleFinalSubmit = async () => {
     let {data} = await axios.post('/api/createOrder', {
      action: 'sendOrder', 
      products: mtrLines, 
      email: inputEmail,
      TRDR: selectedSupplier?.TRDR,
      NAME: selectedSupplier?.NAME
    })
      router.push('/dashboard/supplierOrder')
  }

  return (
    <div className=''>
      <StepHeader text="Aποστολή Προσφοράς" />
      <OrderDetails />
      <div className='mt-3 p-3 bg-white border-round mb-3'>
        <div>
          <span>Μάρκα:</span>
          <span className='ml-2 font-bold'>{selectedProducts[0]?.brandName}</span>
        </div>
        <div className='mt-2'>
          <span>Ελάχιστο Ποσό Παραγγελίας:</span>
          <span className='ml-2 font-bold'>{selectedProducts[0]?.minValue}</span>
        </div>
        <div className='mt-2'>
          <span>Ελάχιστος Αριθμός Προϊόντων:</span>
          <span className='ml-2 font-bold'>{selectedProducts[0]?.minItems}</span>
        </div>
      </div>

      <DataTable
        value={selectedProducts}
        paginator
        rowsPerPageOptions={[5, 10, 20, 50]}
        lazy
        rows={10}
        className='border-1 border-round-sm	border-50'
        size="small"
        id={'_id'}
        footer={Footer}
        showGridlines
      >
        <Column field="NAME" header="Όνομα Πελάτη"></Column>
        <Column field="brandName" header="Όνομα Μάρκας"></Column>
        <Column field="PRICER" header="Τιμή μονάδας" style={{ width: '120px' }} body={PriceTemplate}></Column>
        <Column header="Ποσότητα/Σύνολο Τιμής" style={{ width: '130px' }} body={CalculateTemplate}></Column>
        <Column style={{ width: '40px' }} body={DeleteTemplate}></Column>
      </DataTable>
      <div className='mt-3'>
        <Button severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
        <Button className='ml-2' label="Αποστολή" disabled={!isFinalSubmit}  onClick={handleFinalSubmit} />
      </div>
    </div>
  )
}




const CalculateTemplate = ({ PRICER, MTRL, brandName, NAME}) => {

  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch();


  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }



  const decreaseQuantity = () => {
    if (quantity === 1) return
    setQuantity(prev => prev - 1)

  }

  useEffect(() => {
    dispatch(setMtrLines({ MTRL: MTRL, QUANTITY: quantity, PRICE: PRICER, NAME: NAME }))
  }, [quantity])

  return (
    <div className='flex p-2'>

      <div className='font-xs flex align-items-center border-1 p-2 border-300 border-round'>
        <div
          onClick={decreaseQuantity}
          className='mr-2 border-1 border-300  flex align-items-center justify-content-center border-round pointer-cursor'
          style={{ width: '25px', height: '25px' }}>
          <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
        </div>
        <div className='w-2rem flex align-items-center justify-content-center'>
          <p className='text-lg'>{quantity}</p>
        </div>
        <div
          onClick={increaseQuantity}
          className='ml-2 border-1  flex align-items-center justify-content-center border-round border-400' style={{ width: '25px', height: '25px' }}>
          <i className="pi pi-plus" style={{ fontSize: '10px' }}></i>
        </div>
      </div>
      <div className='flex align-items-center'>
        <span className='font-bold ml-3'>{`${quantity * parseInt(PRICER)}€`}</span>
      </div>
    </div>
  )
}

const DeleteTemplate = ({ MTRL }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(setDeleteMtrlLines(MTRL))
  }
  return (
    <div className='flex'>
      <i onClick={handleDelete} className="pi pi-trash" style={{ fontSize: '1rem', color: 'red' }}></i>
    </div>
  )
}

const PriceTemplate = ({ PRICER }) => {
  return (
    <div className='flex'>
      <span className='font-bold'>{PRICER + "€"}</span>
    </div>
  )
}


const Footer = () => {
  const { selectedProducts, mtrLines } = useSelector(state => state.supplierOrder)
  const dispatch = useDispatch();
    let sum = mtrLines.map(item => item.TOTAL_PRICE).reduce((prev, next) => prev + next, 0)
    let quantity = mtrLines.map(item => item.QUANTITY).reduce((prev, next) => prev + next, 0)
    let icon = 'pi pi-check', quantIcon = 'pi pi-check';
    let color = 'green', quantColor = 'green';
    if(sum < selectedProducts[0]?.minValue) {
      icon = 'pi pi-times'
      color = 'red'

    }

    if(quantity < selectedProducts[0]?.minItems) {
      quantIcon = 'pi pi-times'
      quantColor = 'red'
    }

    useEffect(() => {
      if(quantity >= selectedProducts[0]?.minItems && sum >= selectedProducts[0]?.minValue) {
          dispatch(setIsFinalSubmit(true));
      } else {
          dispatch(setIsFinalSubmit(false));
      }
  }, [quantity, sum, selectedProducts, dispatch]);

  return (
    <>
      <div className='p-1 flex align-items-center'>
      <div className='flex align-items-center justify-content-center border-1 border-round mr-2 border-300' style={{width: '25px', height: '25px'}}>
        <i className={icon} style={{ fontSize: '1rem', color: color }}></i>
      </div>
      <div>
      <span>Σύνολο Τιμής:</span>
      <span className='ml-2 font-bold'>{`${sum}€`}</span>
      </div>
    </div>
      <div className='p-1 flex align-items-center'>
      <div className='flex align-items-center justify-content-center border-1 border-round mr-2 border-300' style={{width: '25px', height: '25px'}}>
        <i className={quantIcon} style={{ fontSize: '1rem', color:quantColor }}></i>
      </div>
      <div>
      <span>Σύνολο Προϊόντων:</span>
      <span className='ml-2 font-bold'>{quantity}</span>
      </div>
    </div>
    </>
  )
}

export default ChosenProducts 