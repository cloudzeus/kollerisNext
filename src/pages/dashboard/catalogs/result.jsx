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
const StepshowData = () => {
  const [returnedProducts, setReturnedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { gridData, attributes, mongoKeys, newData, } = useSelector((state) => state.catalog)
  const [showData, setShowData] = useState([])
  const [dynamicColumns, setDynamicColumns] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (!newData.length) router.push('/dashboard/suppliers');
  }, [])

  useEffect(() => {
    // console.log('new data')
    // console.log(newData)
    if (gridData === null) return;
    const _newData = gridData.map(row => {
      return mongoKeys.reduce((newRow, keyObj) => {
        if (keyObj.related !== 0) {
          newRow[keyObj.related] = row[keyObj.oldKey];
        }
        return newRow;
      }, {});
    });

    setShowData(_newData)
    function extractKeys(dataset) {
      return Object.keys(dataset?.[0] || {});
    }
    
    const result = extractKeys(_newData);

    if (result === undefined) return;
    setDynamicColumns(result)


  }, [gridData, attributes, mongoKeys, newData])




  return (
    <AdminLayout>
        <Table
          setReturnedProducts={setReturnedProducts}
          setLoading={setLoading}
          loading={loading}
          showData={showData}
          returnedProducts={returnedProducts}
          dynamicColumns={dynamicColumns}
        />

    </AdminLayout>
  )
}


const Table = ({ showData, dynamicColumns, loading, setLoading }) => {
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
    setLoading(true)
    // let products = [...returnedProducts]
    for (let i = 0; i < showData.length; i++) {
      const { data } = await axios.post('/api/insertProductFromFile', {
        data: showData[i],
        action: 'importCSVProducts',
        SUPPLIER_NAME: name,
        SUPPLIER_TRDR: trdr,
        UNIQUE_CODE: code,
      })
      // products.push(data.result)
      console.log('data')
      console.log(data)
      const returned =  await handleFetch(code, showData[i].NAME )
      console.log('returned')
      console.log( returned)
    }
    // setReturnedProducts(products)
    setLoading(false)

  }


  useEffect(() => {
    console.log('dynamic columns')
    console.log(dynamicColumns)
  }, [])

  return (
    <>
      <StepHeader text="Τελική μορφή Αρχείου" />
      <DataTable
        loading={loading}
        key={Math.random()}
        showGridlines
        paginator rows={10} rowsPerPageOptions={[20, 50, 100, 200]}
        value={showData}
        tableStyle={{ minWidth: '50rem' }}>
        {dynamicColumns.map(key => {
          if (key === "PRICER01") {
            return <Column key={key} field={key} header={"Τιμή Scroutz"} />
          }
          if (key === "PRICER") {
            return <Column key={key} field={key} header={"Τιμή Λιανικής"} />
          }
          if (key === "PRICEW") {
            return <Column key={key} field={key} header={"Τιμή Χονδρικής"} />
          }
       
          if (key === "CODE1") {
            return <Column key={key} field={key} header={"EANCODE"} />
          }
          if (key === "CODE2") {
            return <Column key={key} field={key} header={"Κωδικός Εργοστασίου"} />
          }
          return <Column key={key} field={key} header={key} />
        })}
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