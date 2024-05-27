import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import StepHeader from '@/components/StepHeader';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { Toolbar } from 'primereact/toolbar';
import XLSXDownloadButton from '@/components/exportCSV/Download';
import { mongo } from 'mongoose';
const StepshowData = () => {
  const [returnedProducts, setReturnedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { gridData, attributes, mongoKeys, newData, } = useSelector((state) => state.catalog)
  const [resultData, setResultData] = useState([])
  const [dynamicColumns, setDynamicColumns] = useState([])
  const router = useRouter()


  useEffect(() => {
    if (gridData === null) return;
    //Create a new set of data only for the selected columns.
    //Replacte the old key with the newly selected key:
    const _newData = gridData.map(row => {
      return mongoKeys.reduce((newRow, keysObject) => {
        if (keysObject.related !== 0) {
           newRow[keysObject.related] = row[keysObject.oldKey]
        }
        return newRow;
      }, {});
      });
    setResultData(_newData)

   

  }, [gridData, attributes, mongoKeys, newData])




  return (
    <AdminLayout>
        <Table
          setReturnedProducts={setReturnedProducts}
          mongoKeys={mongoKeys}
          setLoading={setLoading}
          loading={loading}
          data={resultData}
          returnedProducts={returnedProducts}
          dynamicColumns={dynamicColumns}
        />

    </AdminLayout>
  )
}


const Table = ({ data,  loading,  mongoKeys }) => {
  const { selectedSupplier } = useSelector(state => state.supplierOrder)
  const [newData, setNewData] = useState([])

  function generateUniqueCode() {
    const characters = '0123456789';
    let uniqueCode = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueCode += characters.charAt(randomIndex);
    }
    return uniqueCode;
  }

  const name = selectedSupplier?.NAME
  const trdr = selectedSupplier?.TRDR

  const handleFetch = async (code, name) => {
    let { data } = await axios.post('/api/uploadedProducts', { action: 'returnedUploadedProducts', UNIQUE_CODE: code, NAME: name })
    setNewData(prev => [...prev, data.result])
  }

  const handleSubmit = async () => {

    const code = generateUniqueCode();
    // let products = [...returnedProducts]
    for (let i = 0; i < data.length; i++) {
      const { data } = await axios.post('/api/insertProductFromFile', {
        data: data[i],
        action: 'importCSVProducts',
        SUPPLIER_NAME: name,
        SUPPLIER_TRDR: trdr,
        UNIQUE_CODE: code,
      })
      // products.push(data.result)
  
      const returned =  await handleFetch(code, data[i].NAME )
    
    }
    // setReturnedProducts(products)

  }


 

  return (
    <>
      <StepHeader text="Τελική μορφή Αρχείου" />
      <DataTable
        loading={loading}
        key={Math.random()}
        showGridlines
        paginator rows={10} rowsPerPageOptions={[20, 50, 100, 200]}
        value={data}
        tableStyle={{ minWidth: '50rem' }}>
        {
          mongoKeys.map(key => {
            if (key.related === 0) return;
            return <Column key={key.related} field={key.related} header={key.related} />
          })
        }
      </DataTable>

      <div className='mt-3'>
        <Button loading={loading} label="Αποστολή" className='ml-2' onClick={handleSubmit} />
      </div>
      {newData.length ? (
          <UploadedProductsGrid data={newData} />
      ) : null}

    </>
  )
}



const UploadedProductsGrid = ({ data }) => {
  const Start  = () => {
      return (
        <div className='flex align-items-center justify-content-between'>
          <XLSXDownloadButton data={data} fileName="catalog_result"/>
        </div>
      )
  }
  return (
    <div>
      <Toolbar start={Start} className='mt-3' />
      <DataTable value={data} tableStyle={{ minWidth: '50rem' }} className=''>
        <Column field="NAME" header="Όνομα"></Column>
        <Column field="SUPPLIER_NAME" header="Προμηθευτής"></Column>
        <Column field="STATUS" header="Status"></Column>
        <Column field="SHOULD_UPDATE_SOFTONE" header="SHOULD_UPDATE_SOFTONE"></Column>
        <Column field="UPDATED_SOFTONE" header="UPDATED_SOFTONE"></Column>
      </DataTable>
    </div>
  )
}

export default StepshowData;