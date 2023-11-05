import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setReturnedProducts } from '@/features/catalogSlice';
import axios from 'axios';
import StepHeader from '@/components/StepHeader';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';

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
    if (gridData === null) return;
    const fixedColumns = ['PRICER', 'PRICEW', 'PRICER05'];

    const _newData = newData.map(row => {
      let newRow = {};
      fixedColumns.forEach(col => {
        if (row[col] !== undefined) {
          newRow[col] = row[col];
        }
      });

      //mongoKeys = [{
      //  oldKey: 'Κωδικός',
      //  related: 'code'
      //}]
      mongoKeys.forEach(keyObj => {
        if (row[keyObj.oldKey] !== undefined) {
          newRow[keyObj.related] = row[keyObj.oldKey];
        }
      });

      return newRow;
    });

    setShowData(_newData)

    function extractKeys(dataset) {
      // Extract top-level keys
      if (dataset === undefined) return;
      const topLevelKeys = Object.keys(dataset).filter(key => key !== 'attributes');
      // const attributeNames = dataset.attributes.map(attr => attr.name);
      const uniqueKeys = [...new Set([...topLevelKeys])];
      return uniqueKeys;
    }
    const result = extractKeys(_newData[0]);
    if (result === undefined) return;
    setDynamicColumns(result)


  }, [gridData, attributes, mongoKeys, newData])




  return (
    <AdminLayout>
      {returnedProducts.length > 0 ? (
        <ReturnedTable returnedProducts={returnedProducts} loading={loading} />
      ) : (
        <Table
          setReturnedProducts={setReturnedProducts}
          setLoading={setLoading}
          loading={loading}
          showData={showData}
          returnedProducts={returnedProducts}
          dynamicColumns={dynamicColumns}
        />
      )}

    </AdminLayout>
  )
}


const Table = ({ showData, returnedProducts, dynamicColumns, setReturnedProducts, loading, setLoading }) => {
  const handleSubmit = async () => {
    // for(let i = 0; i < showData.length; i++) {
    setLoading(true)
    let products = [...returnedProducts]
    for (let i = 0; i < 5; i++) {
      let { data } = await axios.post('/api/insertProductFromFile', { data: showData[i], action: 'importCSVProducts' })
      console.log('data')
      console.log(data.result)
      products.push(data.result)
    }
    setReturnedProducts(products)
    setLoading(false)

  }

  return (
    <>
      <StepHeader text="Τελική μορφή Αρχείου" />
      <DataTable
        key={Math.random()}
        showGridlines
        paginator rows={10} rowsPerPageOptions={[20, 50, 100, 200]}
        value={showData}
        tableStyle={{ minWidth: '50rem' }}>
        {dynamicColumns.map(key => {
          if (key === "PRICER05") {
            return <Column key={key} field={key} header={"PRICER05 /Τιμή Scroutz"} />
          }
          return <Column key={key} field={key} header={key} />
        })}
      </DataTable>

      <div className='mt-3'>
        <Button loading={loading} label="Αποστολή" className='ml-2' onClick={handleSubmit} />
      </div>

    </>
  )
}


const ReturnedTable = ({ returnedProducts, loading }) => {
  const router = useRouter()
  const onClick = () => {
    router.push('/dashboard/suppliers')
  }
  return (
    <>
      <StepHeader text="Αποτέλεσμα" />
      <DataTable
        loading={loading}
        showGridlines
        stripedRows
        value={returnedProducts}
        tableStyle={{ minWidth: '50rem' }}>
        <Column header={'Προϊόν'} field="NAME" />
        <Column header={'Αποτέλεσμα'} field="action" style={{ width: '100px' }} />
      </DataTable>
      <Button label="Πίσω στον προμηθευτή" onClick={onClick} className='mt-2' />
    </>
  )
}
export default StepshowData;