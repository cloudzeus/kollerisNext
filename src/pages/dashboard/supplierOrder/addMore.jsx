'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedProducts, setSearchTerm, } from '@/features/supplierOrderSlice';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import { setTotalProductsPrice, setMtrLines, updateMtrlines } from '@/features/supplierOrderSlice';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { set } from 'mongoose';

const ChooseProducts = ({ hideBackBtn }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { selectedProducts, selectedMarkes, searchTerm, mtrLines, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });

  useEffect(() => {
      if(!selectedMarkes) {
        router.push('/dashboard/product/brands')
      }
  }, [])


  useEffect(() => {
    console.log('mtrLines')
    console.log(mtrLines)
  }, [mtrLines])
  useEffect(() => {
    console.log('selectedProducts')
    console.log(selectedProducts)
  }, [selectedProducts])

  const fetch = async (action) => {
    setLoading(true)
    let { data } = await axios.post('/api/createOrder', {
      action: 'fetchProducts',
      skip: lazyState.first,
      limit: lazyState.rows,
      searchTerm: searchTerm,
      mtrmark: selectedMarkes?.mtrmark,

    })

    setData(data.result)
    setTotalRecords(data.totalRecords)
    setLoading(false)

  }

  useEffect(() => {
    setSelectedProducts([])
    fetch();
  }, [selectedMarkes, lazyState.rows, lazyState.first, searchTerm])

  useEffect(() => {
    setlazyState(prev => ({ ...prev, first: 0 }))

  }, [selectedMarkes])

  const onSelectionChange = (e) => {
    dispatch(setSelectedProducts(e.value))
    dispatch(setMtrLines(e.value))
  }

  const onPage = (event) => {
    setlazyState(event);
  };



  const Search = () => {
    return (
      <>
        <div className="flex justify-content-start w-20rem ">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search " />
            <InputText value={searchTerm} placeholder='Αναζήτηση Προϊόντος' onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
          </span>
        </div>
      </>
    )
  }

  const handleFinalSubmit = async () => {
    let { data } = await axios.post('/api/createOrder', {
      action: 'updateBucket',
      products: mtrLines,
      MTRMARK: selectedMarkes.mtrmark,
    
    })
  }
  return (
    <AdminLayout>
      <StepHeader text="Προσθήκη Προϊόντων στο bucket" />
      <DataTable
        value={data}
        paginator
        rows={lazyState.rows}
        rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
        first={lazyState.first}
        lazy
        totalRecords={totalRecords}
        onPage={onPage}
        selectionMode={'checkbox'}
        selection={selectedProducts}
        onSelectionChange={onSelectionChange}
        className='border-1 border-round-sm	border-50 mt-4'
        size="small"
        filterDisplay="row"
        id={'_id'}

      >
        <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
        <Column field="brandName" header="Όνομα Μάρκας"></Column>
        <Column field="NAME" filter showFilterMenu={false} filterElement={Search} header="Προϊόν"></Column>
        <Column field="PRICER" header="Τιμή μονάδας" style={{ width: '120px' }} body={PriceTemplate}></Column>
        <Column header="Ποσότητα/Σύνολο Τιμής" style={{ width: '130px' }} body={CalculateTemplate}></Column>
      </DataTable>
      <div className='mt-3'>
        {!hideBackBtn ? (
          <Button severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
        ) : null}
        <Button className='ml-2' label="Ολοκλήρωση" onClick={handleFinalSubmit} />

      </div>

    </AdminLayout>
  )
}



const CalculateTemplate = ({ PRICER, MTRL}) => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch();
  const {selectedProducts, mtrLines} = useSelector(state => state.supplierOrder)
  
  
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }


  

  const decreaseQuantity = () => {
    if (quantity === 1) return
    setQuantity(prev => prev - 1)

  }

  useEffect(() => {
      if(quantity == 1) return;
      if(mtrLines === 0) return;
      let find = mtrLines.find(el => el.MTRL === MTRL)
      if(find) {
        dispatch(updateMtrlines({
          MTRL: find?.MTRL,
          QTY1: quantity,
        }))
      }
     
  }, [quantity])

  
  
  let total = quantity * parseFloat(PRICER)
  return (
    <div className='flex p-2'>

      <div className='font-xs flex align-items-center border-1 p-2 border-300 border-round'>
        <div
          onClick={ decreaseQuantity}
          className='mr-2 border-1 border-300  flex align-items-center justify-content-center border-round pointer-cursor'
          style={{ width: '25px', height: '25px' }}>
          <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
        </div>
        <div className='w-2rem flex align-items-center justify-content-center'>
          <p className='text-lg'>{quantity}</p>
        </div>
        <div
          onClick={ increaseQuantity}
          className='ml-2 border-1  flex align-items-center justify-content-center border-round border-400' style={{ width: '25px', height: '25px' }}>
          <i className="pi pi-plus" style={{ fontSize: '10px' }}></i>
        </div>
      </div>
      <div className='flex align-items-center'>
        <span className='font-bold ml-3'>{total.toFixed(2) + "€"}</span>
      </div>
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


export default ChooseProducts;