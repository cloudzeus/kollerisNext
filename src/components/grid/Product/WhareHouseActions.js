'use client'
import React, { useEffect, useState, useContext } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import styled from 'styled-components'
import { ProductQuantityContext } from './ProductToolbar'
import { InputNumber } from 'primereact/inputnumber';


const WhareHouseActions = ({ selectedProducts }) => {
    return (
        <div>
            <div className='flex align-items-center mb-2 mt-2'>
                <h2>Επεξεργασία:</h2>
            </div>
            <div className='box'>
                <DataTable className='border-1 border-round-sm	border-50' size="small" scrollHeight='350px' scrollable value={selectedProducts}   >
                    <Column field="availability.DIATHESIMA" body={Template} header="Προϊόν" ></Column>
                </DataTable>
            </div>
        </div>
    )
}


const Template = ({ categoryName, name, availability, MTRL }) => {

    const { setWhereHouseLines, wharehouseLines } = useContext(ProductQuantityContext);
    let available = parseInt(availability?.DIATHESIMA)
    const [value, setValue] = useState(available);
    
    // console.log('value')
    // console.log(wharehouseLines)

    const onValueChange = (e) => {
        setValue(e.value);

        // setWhereHouseLines(prev => {
        //     return prev.map(item => {
        //         if (item.MTRL === MTRL[0]) {
        //             return { ...item, QTY1: e.value };
        //         }
        //         return item;
        //     });
        // });
    }

    // const increaseQuantity = () => {
    //     setQuantity(prev => prev + 1)
    //     setMtrLines(prev => {
    //         return prev.map(item => {
    //             if (item.MTRL === MTRL[0]) {
    //                 return { ...item, QTY1: item.QTY1 + 1 };
    //             }
    //             return item;
    //         });
    //     });

    // }

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
                <div className='flex'>
                    <p className="font-bold block mb-2">Διαθέσιμα στην σύστημα:</p>
                    <p>{availability.DIATHESIMA}</p>
                </div>
                <div className="">
                    <label htmlFor="minmax-buttons" className="font-bold block mb-2">Διαθέσιμα στην αποθήκη:</label>
                    <InputNumber inputId="minmax-buttons" value={value} onValueChange={ onValueChange } mode="decimal" showButtons min={0} max={1000} />
                </div>
            </div>
            
        </ProductBasket>
    )
}

// const ProductBaksetTemplate = ({ name, categoryName, PRICER, selectedProducts, setSelectedProducts, MTRL }) => {
//     const [total, setTotal] = useState(PRICER)
//     const [quantity, setQuantity] = useState(1)
//     const { quantityContext, setQuantityContext, setMtrLines, mtrlines } = useContext(ProductQuantityContext);


//     return (
//         <ProductBasket>
//             <div>
//                 <div>
//                     <p className='text-md text-900 font-semibold'>{name}</p>
//                 </div>
//                 <div className='details'>
//                     <i className="pi pi-tag" style={{ fontSize: '12px', marginRight: '3px', marginTop: '2px' }}></i>
//                     <p className='text-xs'>{categoryName}</p>
//                 </div>
//                 <span className='text-xs ml-1'>TIMH:</span>
//                 <span className='text-xs ml-2'>{total},00$</span>
//             </div>
//             <div className='flex'>
//                 <div className='font-xs flex align-items-center border-1 p-2 border-400 border-round'>
//                     <div
//                         onClick={decreaseQuantity}
//                         className='mr-2 border-1  flex align-items-center justify-content-center border-round border-400 pointer-cursor'
//                         style={{ width: '25px', height: '25px' }}>
//                         <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
//                     </div>
//                     <p className='text-lg'>{quantity}</p>
//                     <div
//                         onClick={increaseQuantity}
//                         className='ml-2 border-1  flex align-items-center justify-content-center border-round border-400' style={{ width: '25px', height: '25px' }}>
//                         <i className="pi pi-plus" style={{ fontSize: '10px' }}></i>
//                     </div>
//                 </div>


//                 <div  >
//                 <div>
//                     <CircleDiv />
//                     <span>Διαθεσιμα:</span>
//                     <span className='available'>{data?.DIATHESIMA}</span>
//                 </div>

//                 <div className='row update-row'>

//                     <span>updated:</span>
//                     <span className='date'>{data?.date}</span>
//                 </div>


//             </div>
//             </div>
//         </ProductBasket>
//     )
// }

const ContainerBasket = styled.div`
   

    .basket-icon {
        display: flex;
        align-items: center;

    }

`


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