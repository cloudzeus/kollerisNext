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



const MenuOptions = ({ setId, setClickMenu }) => {
    const onClick = (id) => {
        setClickMenu(false)
        setId(id)
        console.log(id)
    }

    return (
        <MenuDiv>
            <ul>
                <li onClick={() => onClick(1)}>Αλλαγή κατηγοριοποίησης</li>
                <div className='line'></div>
                <li onClick={() => onClick(2)}>Αλλαγή Impa</li>
            </ul>
        </MenuDiv>
    )
}


const ProductToolbar = ({ selectedProducts, setSelectedProducts, setSubmitted }) => {


    const startContent = () => {
        return <MenuComp selectedProducts={selectedProducts}  setSelectedProducts={setSelectedProducts} setSubmitted={setSubmitted}/>
    }

    return (
        <div>
            <Toolbar start={startContent} />
        </div>
    )
}



const MenuComp = ({ selectedProducts, setSelectedProducts, setSubmitted }) => {
    const [clickMenu, setClickMenu] = useState(false)
    const [id, setId] = useState(null);
    const [visible, setVisible] = useState(false)
    const [products, setProducts] = useState(null)


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
            <>
                <p>{`Σύνολο Προϊόντων: ${products !== null ? products.length : 0}`}</p>
            </>
        )
    }

    return (
        <>

            <Button icon="pi pi-align-right" label="Επεξεργασία όλων " className="mr-2" onClick={onMultipleActions} aria-controls="popup_menu_right" aria-haspopup />
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