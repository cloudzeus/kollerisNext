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
import { Dropdown } from 'primereact/dropdown';
import ToolbarActions from './ToolbarActions';
import { Badge } from 'primereact/badge';




const ProductToolbar = ({ selectedProducts, setSelectedProducts, setSubmitted }) => {

    console.log('selected products')
    console.log(selectedProducts)

    const startContent = () => {
        return <MenuComp selectedProducts={selectedProducts}  setSelectedProducts={setSelectedProducts} setSubmitted={setSubmitted}/>
    }

    const endContent = () => {
        return <RightSide selectedProducts={selectedProducts}  setSelectedProducts={setSelectedProducts} setSubmitted={setSubmitted}/>
    }

    return (
        <div>
            <Toolbar start={startContent} end={endContent}/>
        </div>
    )
}


const RightSide = ({ selectedProducts}) => {

    const CalculateBasket = () => {
        let total = 0
        selectedProducts && selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3'>Σύνολο:<span className='font-bold ml-1'>{`${total},00$`}</span> </p>
        )


    }
    return (
        <ContainerBasket >
        <div className='basket-icon'>
        < CalculateBasket />
            <i onClick={() => setVisible(true)} className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '25px', marginRight: '10px' }}>
                <Badge value={selectedProducts == null ? "0" :selectedProducts?.length} ></Badge>
            </i>
        </div>
    </ContainerBasket >
    )
}


const MenuComp = ({ selectedProducts, setSelectedProducts, setSubmitted }) => {
    const [visible, setVisible] = useState(false)
    const CalculateBasket = () => {
        let total = 0
        selectedProducts && selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3 ml-1'><span className='font-normal'>Σύνολο:</span> {`${total},00$`}</p>
        )


    }

    const onMultipleActions = () => {
        setVisible(true)
    }

    const removeProducts = (props) => {
        console.log(props)
        return (
            <RemoveProductTemplate id={props._id}/>
        )
    }

    const RemoveProductTemplate = ({id}) => {

        const remove = () => {
            let newArray = selectedProducts.filter((product) => product._id !== id)
            setSelectedProducts(newArray)
        }
        return (
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={remove} ></Button>
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

    return (
        <>

            <Button 
                icon="pi pi-shopping-cart" 
                label="Kαλάθι λειτουργειών" 
                className="mr-2" 
                onClick={onMultipleActions} 
                aria-controls="popup_menu_right"
                 aria-haspopup 
                 severity="warning"
                 disabled={selectedProducts == null || selectedProducts.length < 1 ? true : false}
                 />
            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} className="md:w-6	 lg:w-5	">
                <div className='flex align-items-center mb-2 mt-2'>
                    <h2>Επεξεργασία:</h2>
                </div>
                <div className='box'>
                    <DataTable className='border-1 border-round-sm	border-50' size="small" scrollHeight='350px' scrollable value={selectedProducts} footer={footer}  >
                        <Column field="Προϊόν" header="Προϊόν" body={ProductBaksetTemplate}></Column>
                        <Column style={{ width: '30px' }} body={removeProducts} ></Column>
                    </DataTable>
                </div>
                <div className='mb-2 mt-2'>
                {/* <Button label="Μenu" icon="pi pi-bars" className="surface-ground text-primary w-full p-mr-2 mt-3" onClick={() => setClickMenu((prev) => !prev)} />
                {clickMenu ?
                    (
                        <MenuOptions setId={setId} setClickMenu={setClickMenu} />
                    )
                    : null} */}
            </div>
                <ToolbarActions gridData={selectedProducts} setSubmitted={setSubmitted} />
              

            </Sidebar>

        </>

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



const ContainerBasket = styled.div`
   

    .basket-icon {
        display: flex;
        align-items: center;

    }

`


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



const ProductGrid = styled.div`
    .details {
        display: flex;
        align-items: center;
        div {
            display: flex;
            margin-top: 2px;
            margin-right: 10px;
        }
    }
`

const MenuDiv = styled.div`
    margin-top: 5px;
    /* display: inline-flex; */
    border: 1px solid #cacaca;
    border-radius: 5px;
    
    li {
        list-style: none;
        cursor: pointer;
        display: block;
        padding: 10px;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #cacaca;
    }
    
`





export default ProductToolbar