import React, { useState, useContext, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  setSelectedHeaders,
  setSelectedMongoKey,
  setCurrentPage,
  setAttribute,
  setPricesMultiplier,
  setNewData
} from '@/features/catalogSlice';
import { InputText } from "primereact/inputtext";

// ------------------- STEP 2 -------------------


const OurDatabaseKeys = [
  {
    key: 'name',
    value: 'Όνομα'
  },
  {
    key: 'description',
    value: 'Περιγραφή'
  },
  {
    key: 'CODE',
    value: 'EANCODE'
  },
  {
    key: 'CODE1',
    value: 'Κωδικός εργοστασίου'
  },
  {
    key: 'CODE2',
    value: 'Κωδικός ----'
  },
  {
    key: 'PRICER',
    value: 'Tιμή Λιανικής'
  },


  {
    key: 'PRICER',
    value: 'Tιμή Χονδρικής'
  },


]

const StepCalcPrice = () => {
  const { selectedPriceKey, pricesMultiplier, gridData,  newData } = useSelector((state) => state.catalog)
  const dispatch = useDispatch();

  // console.log(gridData)
  console.log(newData)

  useEffect(() => {
    const _newData = gridData.map((item) => {
        let value = parseInt(item[selectedPriceKey])
        if (item.hasOwnProperty(selectedPriceKey) && !isNaN(value)) {
            return {
                ...item,
                [selectedPriceKey]: item[selectedPriceKey],
                PRICER: value * pricesMultiplier.PRICER,
                PRICEW: value * pricesMultiplier.PRICEW,
                PRICER05: value * pricesMultiplier.PRICER05,
            };
        }
        return {}; // or null or any other fallback value you'd like
    }).filter(item => Object.keys(item).length !== 0);  // Remove items that don't have the key

    dispatch(setNewData(_newData))
}, [gridData, pricesMultiplier])

  return (
    <div>
      <h2 className='mb-3 mt-4'>Υπολογισμός Τιμών:</h2>

      <StepCalculatePrice />
      {newData ? (
          <DataTable
          showGridlines
          paginator rows={10} rowsPerPageOptions={[20, 50, 100, 200]}
          value={newData}
          tableStyle={{ minWidth: '50rem' }}>
          <Column header={'Τιμή αρχείου'} field={selectedPriceKey} />
          <Column header={'Tιμή Λιανικής'} field={'PRICER'} style={{width: '200px'}} />
          <Column header={'Τιμή Χονδρικής'} field={'PRICEW'} style={{width: '200px'}}/>
          <Column header={'Τιμή Scroutz'} field={'PRICER05'}  style={{width: '200px'}}/>
        </DataTable>
      ) : null}

      <div className='mt-3'>
        <Button   label="STEP 1"   severity="success"  icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(1))} />
        <Button   label="STEP 3"    severity="success" icon="pi pi-arrow-right" className='ml-2' onClick={() => {
          //GO TO stepSelectKeys
          dispatch(setCurrentPage(3))
        }} />
      </div>
    </div>
  )
}






const StepCalculatePrice = () => {
  const { selectedHeaders, prices, gridData, pricesMultiplier  } = useSelector((state) => state.catalog)
 
  const dispatch = useDispatch();

  const handleScroutzPrice = (e) => {
    setPricesMultiplier(prev => ({ ...prev, PRICER05: e.value }))
    dispatch(setPricesMultiplier({
      type: 'PRICER05',
      value: e.value
    }))

  }
  const handleRetail = (e) => {
    dispatch(setPricesMultiplier({
      type: 'PRICER',
      value: e.value
    }))
  }
  const handleWholesale = (e) => {
    dispatch(setPricesMultiplier({
      type: 'PRICEW',
      value: e.value
    }))
  }


  return (
    <div>

      <div className='bg-white-alpha-90'>
        {/* //ITEM */}
        <div className='mb-3 border-bottom-1 p-4	 border-300	'>
          <div className="flex-auto">
            <label htmlFor="input1" className="font-bold block mb-2">Συντελεστής Τιμής Scroutz</label>
            <InputNumber inputId="input1" value={pricesMultiplier.PRICER05} onValueChange={handleScroutzPrice} showButtons min={0} max={100} step={0.25} />
          </div>
        </div>
        {/* //ITEM */}
        <div className='mb-3 border-bottom-1 p-4	 border-300	'>
          <div className="flex-auto">
            <label htmlFor="input2" className="font-bold block mb-2">Συντελεστής Λιανικής</label>
            <InputNumber inputId="input2" value={pricesMultiplier.PRICER} onValueChange={handleRetail} showButtons min={0} max={100} step={0.25} />
          </div>
        </div>

        {/* //ITEM */}
        <div className='mb-3 border-bottom-1 p-4	 border-300	'>
            <div className="flex-auto">
            <label htmlFor="input3" className="font-bold block mb-2">Συντελεστής Χρονδρικής</label>
            <InputNumber inputId="input3" value={pricesMultiplier.PRICEW} onValueChange={handleWholesale} showButtons min={0} max={100} step={0.25} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default StepCalcPrice;