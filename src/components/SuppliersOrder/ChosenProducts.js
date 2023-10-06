import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { setTotalProductsPrice, setMtrLines, setDeleteMtrlLines} from '@/features/supplierOrderSlice';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import StepHeader from '../ImpaOffer/StepHeader';


const ChosenProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedProducts, totalProductsPrice, mtrLines, findItem} = useSelector(state => state.supplierOrder)
  
  console.log('find Item')
  console.log(findItem)

  const Footer = () => {
    let sum = mtrLines.map(item => item.TOTAL_PRICE).reduce((prev, next) => prev + next, 0)
    return (
      <div className='p-3'>
        <span>Σύνολο Τιμής:</span>
        <span className='ml-2 font-bold'>{`${sum}€`}</span>
      </div>
    )
  }

  useEffect(() => {
    console.log('mtrlines')
    console.log(mtrLines)
  }, [mtrLines])
  return (
    <div className=''>
      <StepHeader text="Aποστολή Προσφοράς" />
      <div className='mt-3 p-3 bg-white border-round mb-3'>
        <div>
          <span>Μάρκα:</span>
          <span className='ml-2 font-bold'>{selectedProducts[0]?.brandName}</span>
        </div>
        <div className='mt-2'>
          <span>Ελάχιστο Ποσό Παραγγελίας:</span>
          <span className='ml-2 font-bold'>{selectedProducts[0]?.minValue}</span>
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
        <Column field="brandName" header="Όνομα Πελάτη"></Column>
        <Column field="minItems" header="Ελάχιστα Προϊόντα" body={MinItems} bodyStyle={{ textAlign: 'center' }}></Column>
        <Column field="PRICER" header="Τιμή μονάδας"  style={{ width: '120px' }} body={PriceTemplate}></Column>
        <Column header="Ποσότητα/Σύνολο Τιμής" style={{ width: '130px' }} body={CalculateTemplate}></Column>
        <Column style={{ width: '40px' }} body={DeleteTemplate}></Column>
      </DataTable>
      <div className='mt-3'>
        <Button severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
        <Button className='ml-2' disabled={!selectedProducts} severity='success' icon="pi pi-arrow-right" onClick={() => router.push('/dashboard/supplierOrder/chosenProducts')} />
      </div>
    </div>
  )
}


const MinItems = ({ minItems }) => {
  let temp = minItems == 0 ? "NO LIMIT" : minItems
  return (
    <div className='flex'>
      <span>{temp}</span>
    </div>
  )
}

const CalculateTemplate = ({ PRICER, MTRL }) => {
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
    dispatch(setMtrLines({ MTRL: MTRL, QUANTITY: quantity, PRICE: PRICER }))
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

const DeleteTemplate = ({MTRL}) => {
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

export default ChosenProducts 