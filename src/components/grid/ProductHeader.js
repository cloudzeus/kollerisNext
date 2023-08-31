'use client'
import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge'
import styled from 'styled-components'
import { Sidebar } from 'primereact/sidebar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'
import { set } from 'mongoose'

const ProductHeader = ({ searchTerm, onSearch, selectedProducts }) => {

    const [visible, setVisible] = useState(false);
    const [basket, setBasket] = useState([])

    const addAlltoBasket = () => {
        setBasket(selectedProducts)
    }

    const CalculateBasket = () => {
        let total = 0
        basket.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3'><span className='font-normal'>Σύνολο:</span> {`${total},00$`}</p>
        )


    }

    const deleteFromBasket = (id) => {
        console.log(id)
        console.log('item to delete')
        let newArray = basket.filter((item) => item._id !== id)
        console.log(newArray)
        setBasket(newArray)
    }

    return (
        <Container >
            <div className="left-header">
                <span className="p-input-icon-left mr-3">
                    <i className="pi pi-search" />
                    <InputText type="search" value={searchTerm} onChange={onSearch} placeholder="Αναζήτηση" />
                </span>
                <Button onClick={addAlltoBasket} icon="pi pi-shopping-cart" label="Προσθήκη Όλων" severity="warning" />

            </div>
            <div className="middle-header">

            </div>
            <div className="right-header">
                <div className='basket-icon'>
                < CalculateBasket />
                    <i onClick={() => setVisible(true)} className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '25px', marginRight: '10px' }}>
                        <Badge value={basket.length < 1 ? "0" : basket.length} ></Badge>
                    </i>
                </div>
            </div>
            <Side
                visible={visible}
                setVisible={setVisible}
                basket={basket}
                deleteFromBasket={deleteFromBasket}
            />



        </Container>
    )
}


const Side = ({ visible, setVisible, basket, deleteFromBasket}) => {

    const CalculateBasket = () => {
        let total = 0
        basket.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3'><span className='font-normal'>Σύνολο:</span> {`${total},00$`}</p>
        )


    }

    const removeProduct = (props) => {
        console.log('props')
        console.log(props)
        console.log(props._id)
        return (
            <RemoveProductTemplate 
                deleteFromBasket={deleteFromBasket} 
                id={props._id}
            />
        )
    }


    const footer = () => {
        return (
            <div className='flex justify-between'>
               <CalculateBasket />
            </div>
        )
    }
    return (
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} className="w-full md:w-60rem lg:w-30rem">
            <div className='flex align-items-center mb-4 mt-2'>
                <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '25px', marginRight: '10px' }} />
            <h2>Καλάθι</h2>
            </div>
            <DataTable size="small" scrollHeight='450px' scrollable value={basket} footer={footer}  >
                <Column field="Προϊόν" header="Προϊόν" body={ProductBaksetTemplate}></Column>
                <Column style={{width: '30px'}} body={removeProduct} ></Column>
            </DataTable>
        </Sidebar>
    )
}


const RemoveProductTemplate = ({id, deleteFromBasket}) => {
    console.log('this is the id')
    console.log(id)
    return (
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => deleteFromBasket(id)} ></Button>
    )
}

const ProductBaksetTemplate = ({ name, PRICER, categoryName, }) => {
    return (
        <ProductBasket>
            <div>
                <p className='text-md text-900 font-semibold	'>{name}</p>
            </div>
            <div className='details'>
                <div>
                    <i className="pi pi-tag" style={{ fontSize: '12px',  marginRight: '3px', marginTop: '2px'  }}></i>
                    <p className='text-xs'>{categoryName}</p>
                    
                </div>
               
            </div>
            <span className='text-xs ml-1'>TIMH:</span>
            <span className='text-xs ml-2'>{PRICER},00$</span>
        </ProductBasket>
    )
}


const ProductBasket = styled.div`
    .details {
        display: flex;
        align-items: center;
        div {
            display: flex;
            margin-top: 2px;
            margin-bottom: 10px;
            margin-right: 10px;
        }
    }
`

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    .left-header {
    }

    .middle-header {
    }
    .right-header {
        display: flex;
        align-items: center;
        justify-content: end;
       
    }

    .basket-icon {
        display: flex;
        align-items: center;

    }

`

export default ProductHeader