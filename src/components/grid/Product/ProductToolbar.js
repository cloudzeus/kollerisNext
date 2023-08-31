import React, { useRef, useState } from 'react'
import { Toolbar } from 'primereact/toolbar';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import { Sidebar } from 'primereact/sidebar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import TreeSelectComp from './TreeSelectComp';
import MultiDelete from './MultiDelete';
import MultiImpa from './MultiImpa';



const ProductToolbar = ({ selectedProducts }) => {


    const startContent = () => {
        return <MenuComp selectedProducts={selectedProducts} />
    }



    return (
        <div>
            <Toolbar start={startContent} />
        </div>
    )
}


const MenuComp = ({ selectedProducts }) => {

    const [visible, setVisible] = useState(false)
    const [products, setProducts] = useState(null)
    const onMultipleActions = () => {
        //When you pres the button: "επεξεργασία πολλών":
        setProducts(selectedProducts)
        setVisible(true)
    }

    const removeProducts = (id) => {

        let newArray = basket.filter((item) => item._id !== id)
        console.log(newArray)
        setBasket(newArray)
    }

    const RemoveProductTemplate = ({ id, deleteFromBasket }) => {

        return (
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => deleteFromBasket(id)} ></Button>
        )
    }

    const footer = () => {
        return (
            <>
                <p>{`Σύνολο Προϊόντων: ${products !== null ? products.length : 0}`}</p>
            </>
        )
    }

    return (
        <>

            <Button icon="pi pi-align-right" label="Επεξεργασία όλων " className="mr-2" onClick={onMultipleActions} aria-controls="popup_menu_right" aria-haspopup />
            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} className=" md:w-3	 lg:w-3	">
                <div className='flex align-items-center mb-4 mt-2'>
                    {/* <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '25px', marginRight: '10px' }} /> */}
                    <h2>Επεξεργασία:</h2>
                </div>
                
                <div className='box'>
                    <DataTable className='border-1 border-round-sm	border-50' size="small" scrollHeight='350px' scrollable value={products}  footer={footer}  >
                        <Column field="Προϊόν" header="Προϊόν" body={ProductBaksetTemplate}></Column>
                        <Column style={{ width: '30px' }} body={RemoveProductTemplate} ></Column>
                    </DataTable>
                </div>
                <p>Επιλογή action:</p>
                <div className="card">
                    <TreeSelectComp />
                </div>
                <div className="card">
                    <MultiImpa />
                </div>
                <div className="card">
                    <MultiDelete />
                </div>
               
            </Sidebar>

        </>

    )
}



const ProductBaksetTemplate = ({ name, PRICER, categoryName, }) => {
    return (
        <ProductGrid>
            <div>
                <p className='text-md text-900 font-semibold	'>{name}</p>
            </div>
            <div className='details'>
                <div>
                    <i className="pi pi-tag" style={{ fontSize: '12px', marginRight: '3px', marginTop: '2px' }}></i>
                    <p className='text-xs'>{categoryName}</p>
                </div>

            </div>
          
        </ProductGrid>
    )
}



const ProductGrid = styled.div`
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


const StyledMenu = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    cursor: pointer;
    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #6366F1;
        margin-right: 5px;
    }
  
`
export default ProductToolbar