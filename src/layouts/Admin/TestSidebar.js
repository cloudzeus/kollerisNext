'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
const TestSidebar = () => {
    const [state, setState] = useState({
        products: false,
        something: false,
    })

    const handleProducts = () => { setState({ ...state, products: !state.products }) }
    return (
        <Container >
            <TopSidebar>
                <Image src="/uploads/DGSOFTWhiteIcon.svg" width={30} height={30} alt="dgsoft-logo" />
            </TopSidebar>
            <MainSidebar className='p-2'>
                <Item >
                    <Link className='w-full h-full text-white block flex align-items-center p-4' href='/page1' shallow>Product</Link>
                </Item>
                <Item >
                    <Link className='w-full h-full text-white block flex align-items-center p-4' href='/page2' shallow >Test brand</Link>
                </Item>
                <Expandable header="Προϊόντα" state={state.products} onClick={handleProducts} />
                {state.products ? (
                    <>
                        <SubItem >
                            <Link className='w-full h-full text-white block flex align-items-center p-4' href='/page1'  shallow>Προϊόντα</Link>
                        </SubItem>
                        <SubItem >
                            <Link className='w-full h-full text-white block flex align-items-center p-4' href='/page2'  shallow>Μάρκες</Link>
                        </SubItem>
                    </>
                ) : null}
            </MainSidebar>

        </Container>
    )
}




const Expandable = ({ children, state, setState, header, onClick }) => {
    return (
        <ExpandableItem onClick={onClick}>
            Προϊόντα
            <i className={`pi pi-angle-down`} style={{ fontSize: '1rem' }}></i>
        </ExpandableItem>
    )
}

export default TestSidebar



const Container = styled.div`
    background-color:#171717;
    width: 240px;
`

const TopSidebar = styled.div`
    height: 12vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
`
const MainSidebar = styled.div`
    height: 88vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Item = styled.div`
    background-color: #272727;
    border-radius: 5px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
`

const ExpandableItem = styled.span`
    color: white;
    background-color: #272727;
    border-radius: 5px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 4px 20px;
    margin-bottom: 5px;
`

const SubItem = styled.div`
  background-color: #323232;
    border-radius: 5px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
`
