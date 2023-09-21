import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '@/features/catalogSlice';
import axios from 'axios';

const StepshowData = () => {
  const {  gridData, attributes, mongoKeys, newData } = useSelector((state) => state.catalog)
  const [showData, setShowData] = useState([])


  const [dynamicColumns, setDynamicColumns] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    if(gridData === null) return;
    const fixedColumns = ['PRICER', 'PRICEW', 'PRICER05'];

    const _newData = newData.map(row => {
      let newRow = {};
      fixedColumns.forEach(col => {
        if (row[col] !== undefined) {
          newRow[col] = row[col];
        }
      });
      mongoKeys.forEach(keyObj => {
        if (row[keyObj.oldKey] !== undefined) {
          newRow[keyObj.related] = row[keyObj.oldKey];
        }
      });

      let attr =[];

      attributes.forEach(keyObj => {

        if (row[keyObj.ogKey] !== undefined) {
          attr.push({
            name: keyObj.value,
            value: row[keyObj.ogKey]
          })
          newRow[keyObj.value] = row[keyObj.ogKey];

        }
      });
      newRow.attributes = attr;
      return newRow;
    });

    setShowData(_newData)

    function extractKeys(dataset) {
      // Extract top-level keys
      const topLevelKeys = Object.keys(dataset).filter(key => key !== 'attributes');
      const attributeNames = dataset.attributes.map(attr => attr.name);
      const uniqueKeys = [...new Set([...topLevelKeys, ...attributeNames])];
      return uniqueKeys;
    }
    const result = extractKeys(_newData[0]);
    console.log(result)
    setDynamicColumns(result)


  }, [gridData, attributes, mongoKeys, newData])

  const handleSubmit = async () => {
    console.log(showData)
    let {data } = await axios.post('/api/product/apiProduct', {data: showData, action: 'importCSVProducts'})

  }


  return (
    <div>
      <DataTable
        key={Math.random()}
        showGridlines
        stripedRows
        paginator rows={10} rowsPerPageOptions={[20, 50, 100, 200]}
        value={showData}
        tableStyle={{ minWidth: '50rem' }}>
        {dynamicColumns.map(key => {
          if(key === 'attributes') null;
          return <Column  field={key} header={key} />
        })}
      </DataTable>

      <div className='mt-3'>
        <Button label="STEP 4" severity="success" icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(4))} />
        <Button label="Αποστολή" className='ml-2' onClick={handleSubmit} />
      </div>
    </div>
  )
}

export default StepshowData;