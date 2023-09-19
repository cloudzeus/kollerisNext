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
    setPrices 
} from '@/features/catalogSlice';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';

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
    const { selectedPriceKey, attributes, mongoKeys, gridData } = useSelector((state) => state.catalog)
    const dispatch = useDispatch();
    const [continueBtn, setContinue] = useState(false)
    const toast = useRef(null);
    console.log(selectedPriceKey)

 



    return (
        <div>
         
            <Toast ref={toast} />
            <DataTable
                showGridlines
                paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                value={gridData}
                tableStyle={{ minWidth: '50rem' }}>
                {gridData}
            </DataTable>
                      
                                    <Column  header={'Κλειδί'} field={selectedPriceKey}/>
                       
            <div>
                <Button label="back" icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(1))} />
                <Button label="next" icon="pi pi-arrow-right" onClick={() => {
                       dispatch(setCurrentPage(3))
                  
                }} />
            </div>
        </div>
    )
}

const Template = ({ value, text, key }) => {
  
   
    return (
        <div className='flex justify-content-between'>
            <div>
                <p className='font-bold text-lg'> {value}</p>
                <p className='text-sm'>sample text: {text}</p>
            </div>
        </div>
    )
}



const SelectTemplate = ({ value, text, key }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [dvalue, setdValue] = useState('')

    const handleChange = (e) => {
        console.log(value)

        setdValue(e.value)
        dispatch(setSelectedMongoKey({
            oldKey: key,
            newkey: value,
            related: e.value
        }))

    }

    const handleInputChange = (e) => {
        setdValue(e.target.value)
        console.log(e.target.value)
        let object = {
            ogKey: key,
            name: value,
            value: e.target.value,

        }
        dispatch(setAttribute(object))
    }
    return (
        <div >
    
            {!show ? (
                 <Dropdown 
                 value={dvalue} 
                 onChange={handleChange} 
                 options={OurDatabaseKeys} 
                 optionLabel="value"
                 optionValue='key'
                 className=" w-full" 
                 placeholder="Επίλεξε Κλειδί"
             />
            ) : null}
               
            
               
           
                {show ? (<InputText className='w-full' placeholder="custom attribute" value={dvalue} onChange={handleInputChange }/>) : null}
                <p 
                onClick={() => setShow(prev => !prev)} 
                className='ml-2 mt-1 underline text-blue-500 cursor-pointer w-full'
                >{!show ? "create custom attribute" : "πίσω"}</p>

        </div>
    )
}

const Remove = ({ value }) => {
    const dispatch = useDispatch()
    const { selectedHeaders } = useSelector((state) => state.catalog)
    const remove = (e) => {
        console.log('remove')
        console.log(selectedHeaders)
        const filtered = selectedHeaders.filter(item => item.value !== value)
        dispatch(setSelectedHeaders(filtered))
    }
    return (
        <i className="pi pi-trash" style={{ fontSize: '1rem', color: 'red' }} onClick={remove}></i>

    )
}





const StepCalculatePrice = () => {
  const {  selectedHeaders, prices, gridData } = useSelector((state) => state.catalog)
  const [value1, setValue1] = useState(1.00);
  const [value2, setValue2] = useState(1.00);
  const [value3, setValue3] = useState(1.00);
  const [selectValue, setSelectValue] = useState(null)

  const dispatch = useDispatch();
  const numSelect = (e) => {
    setSelectValue(parseInt(e.value))
  }
  const calcPrice = (multiplier) => {
    return selectValue * multiplier;
  }

  const handleScroutzPrice =(e) => {
      setValue1(e.value)
      dispatch(setPrices({
        type: 'PRICER05',
        value: calcPrice(e.value)
      }))
 
  }
  const handleRetail =(e) => {
      setValue2(e.value)
      dispatch(setPrices({
        type: 'PRICER',
        value: calcPrice(e.value)
      }))
  }
  const handleWholesale =(e) => {
      setValue3(e.value)
      dispatch(setPrices({
        type: 'PRICEW',
        value: calcPrice(e.value)
      }))
  }


  return (
    <div>
        <div className='mb-2'>
        <Dropdown
        value={selectValue}
        onChange={numSelect}
        options={selectedHeaders}
        optionLabel="value"
        optionValue='text'
        className=" w-full"
        placeholder="Επίλεξε Κλειδί" />
        </div>
        <DataTable
                    key={'index'}
                    showGridlines
                    stripedRows
                    paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={gridData}
                    tableStyle={{ minWidth: '50rem' }}>
                        {
                            selectedHeaders.map((header, index) => {
                                return (
                                    <Column  header={header.value} field={header.key}/>
                                )
                            })
                        }
                </DataTable>
      <div className='bg-white-alpha-90'>
        {/* //ITEM */}
        <div className='mb-3 border-bottom-1 p-4	 border-300	'>
          <p className='bg-orange-400 inline-flex p-2 mb-4 border-round text-orange-800'>Tιμή Websites </p>
          <div className='flex align-items-center '>
            <div className='flex align-items-center'>
              <p>ΤΙΜΗ:</p>
              <p className='font-bold ml-3 mr-3'>{selectValue ? selectValue : '---'}</p>
              <p className='mr-3'>X</p>
            </div>
            <InputNumber value={value1} onValueChange={handleScroutzPrice} showButtons min={0} max={100} step={0.25} />
            <p className='ml-3 mr-3'>=</p>
            <p className='font-bold  mr-3 text-xl' >{calcPrice(value1)}</p>
            <div >
            </div>

          </div>
        </div>
        {/* //ITEM */}
        <div className='mb-3 border-bottom-1 p-4	 border-300	'>
          <p className='bg-orange-400 inline-flex p-2 mb-4 border-round text-orange-800'>Tιμή Retail </p>
          <div className='flex align-items-center '>
            <div className='flex align-items-center'>
              <p>ΤΙΜΗ:</p>
              <p className='font-bold ml-3 mr-3'>{selectValue ? selectValue : '---'}</p>
              <p className='mr-3'>X</p>
            </div>
            <InputNumber value={value2} onValueChange={handleRetail} showButtons min={0} max={100} step={0.25} />
            <p className='ml-3 mr-3'>=</p>
            <p className='font-bold  mr-3 text-xl' >{calcPrice(value2)}</p>
            <div >
            </div>

          </div>
        </div>
      
        {/* //ITEM */}
        <div className='mb-3 border-bottom-1 p-4	 border-300	'>
          <p className='bg-orange-400 inline-flex p-2 mb-4 border-round text-orange-800'>Tιμή Wholesale`` </p>
          <div className='flex align-items-center '>
            <div className='flex align-items-center'>
              <p>ΤΙΜΗ:</p>
              <p className='font-bold ml-3 mr-3'>{selectValue ? selectValue : '---'}</p>
              <p className='mr-3'>X</p>
            </div>
            <InputNumber value={value3} onValueChange={handleWholesale} showButtons min={0} max={100} step={0.25} />
            <p className='ml-3 mr-3'>=</p>
            <p className='font-bold  mr-3 text-xl' >{calcPrice(value3)}</p>
            <div >
            </div>

          </div>
        </div>
      
      
        <div className='p-3'>
          <Button icon="pi pi-arrow-left" className="p-button-success" onClick={() => { dispatch(setCurrentPage(2)) }} />
          <Button icon="pi pi-arrow-right" className="p-button-success ml-2" onClick={() => { dispatch(setCurrentPage(4)) }} />
        </div>
      </div>

    </div>
  )
}

export default StepCalcPrice;