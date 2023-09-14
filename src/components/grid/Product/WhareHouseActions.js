'use client'
import React, { useEffect, useState, useContext } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import styled from 'styled-components'
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button'
import { ProductQuantityContext } from '@/_context/ProductGridContext'
import { Message } from 'primereact/message';
import axios from 'axios'

const WhareHouseActions = () => {
    const { selectedProducts, warehouseLines, importWarehouse, exportWarehouse, setImportWarehouse, setExportWarehouse } = useContext(ProductQuantityContext)
    const [warehouseResponse, setWarehouseResponse] = useState(null)
    const [resultImport , setResultImport] = useState(null)
    const [resultExport , setResultExport] = useState(null)



    const CalculateBasket = () => {
        let total = 0
        selectedProducts && selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3 ml-1'><span className='font-normal'>Σύνολο:</span> {`${total},00$`}</p>
        )
    }

    const footer = () => {
        return (
            <div className='flex justify-between p-2'>
                <p className='mr-3 '><span className='font-normal'>Προϊόντα:</span> {`${selectedProducts !== null ? selectedProducts.length : 0}`}</p>
                <CalculateBasket />
            </div>
        )
    }

    
    const handleSubmit = async() => {
        let {data} = await axios.post('/api/product/apiProduct',  {action: 'warehouse', exportWarehouse: exportWarehouse, importWarehouse: importWarehouse})
        console.log(data)
        if(data?.resultImport) {
            setResultImport(data.resultImport)
        }
        if(data?.resultExport) {
            setResultExport(data.resultExport)
        }
    }


    return (
        <div>
            <div className='flex align-items-center mb-2 mt-2'>
                <h2>Επεξεργασία:</h2>
            </div>
            <div className='box'>
                <DataTable footer={footer} className='border-1 border-round-sm	border-50' size="small" scrollHeight='390px' scrollable value={selectedProducts}   >
                    <Column field="availability.DIATHESIMA" body={Template} header="Προϊόν" ></Column>
                </DataTable>
                <Button label="Αποθήκευση" className='mt-3' onClick={handleSubmit} />
                
                  <div className=''>
                  {resultImport ? (
                        <div className=" bg-yellow-400 p-2 mt-2 border-round">
                        <p  className='font-bold'>Παραστατικό Εισαγωγής:</p>
                        <p>{resultImport.MTRDOCNUM}</p>  
                        </div>
                    ) : null}
                    {resultExport ? (
                        <div className="bg-yellow-400 p-2 mt-2 border-round">
                        <p className='font-bold' >Παραστατικό Εξαγωγής:</p>
                        <p>{resultExport.MTRDOCNUM}</p>    
                        </div>
                    ) : null}
                  </div>
                          
                   
                    
            </div>
        </div>
    )
}


const Template = ({ categoryName, name, availability, MTRL }) => {
    const { setWareHouseLines, warehouseLines, setExportWarehouse, setImportWarehouse } = useContext(ProductQuantityContext)

    let available = parseInt(availability?.DIATHESIMA)
    const [value, setValue] = useState(available)
    const ActionMessage = () => {
       if(available < value) {
            return (
                <Message severity="info" text="Eισαγωγή στην αποθήκη" className='wharehouse-msg my-2'  />

            )
       }
        
       if(available > value) {
            return (
                <Message severity="warn" text="Eξαγωγή στην αποθήκη" className='wharehouse-msg my-2' />

            )
       }
        
    
    }
   

    const onValueChange = (e) => {
        let newQTY1 = e.value
        setValue(e.value);

        //IMPORT TO THE WAREHOUSE
        if (e.value > available) {
            setImportWarehouse((prev) => {
                const updated = (prev || []).filter(item => item.MTRL !== MTRL);
                updated.push({ MTRL: MTRL, QTY1: newQTY1 - available });
                return updated;
            });
        
            setExportWarehouse((prev) => {
                return (prev || []).filter(item => item.MTRL !== MTRL);
            });
        }
            //EXPORT FROM THE WAREHOUSE
        if (e.value < available) {
            setExportWarehouse((prev) => {
                const updated = (prev || []).filter(item => item.MTRL !== MTRL);
                updated.push({ MTRL: MTRL, QTY1: available - newQTY1 });
                return updated;
            });
        
            setImportWarehouse((prev) => {
                return (prev || []).filter(item => item.MTRL !== MTRL);
            });
        }
       
        
        
        
        
      

    }



    return (
        <ProductBasket>
            <div className='mb-3'>
                <div>
                    <p className='text-md text-900 font-semibold'>{name}</p>
                </div>
                <div className='details'>
                    <i className="pi pi-tag" style={{ fontSize: '12px', marginRight: '3px', marginTop: '2px' }}></i>
                    <p className='text-xs'>{categoryName}</p>
                </div>
                <div className='my-2 inline-flex surface-200 p-2 border-round'>
                    <p className=" ">Διαθέσιμα στην σύστημα:</p>
                    <p className='ml-2 font-bold block'>{availability.DIATHESIMA}</p>
                </div>
                <div className="">
                    <label htmlFor="minmax-buttons" className="font-bold block ml-1 mb-2">Αλλαγή:</label>
                    <InputNumber inputId="minmax-buttons" value={value} onValueChange={onValueChange} mode="decimal" showButtons min={0} max={1000} />
                </div>
                <ActionMessage />
            </div>

        </ProductBasket>
    )
}





const ProductBasket = styled.div`
     display: flex;
        align-items: center;
        justify-content: space-between;
    .details {
        display: flex;
        align-items: center;
       
    }
`
export default WhareHouseActions