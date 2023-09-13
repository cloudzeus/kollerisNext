import React, { useEffect, useRef, useState, createContext, useContext } from 'react'

export const ProductQuantityContext = createContext();
export const ProductQuantityProvider = ({ children }) => {
    const [  selectedProducts, setSelectedProducts] = useState(null)
    const [quantityContext, setQuantityContext] = useState(1);
    const [mtrlines, setMtrLines] = useState([])
    const [wharehouseLines, setWhereHouseLines] = useState([])
    const [wharehouseValue, setWhereHouseValue] = useState();
  
    return (
        <ProductQuantityContext.Provider value={{ 
            quantityContext, 
            setQuantityContext, 
            mtrlines, 
            setMtrLines, 
            setWhereHouseLines,
            wharehouseLines,
            wharehouseValue,
            setWhereHouseValue,
            selectedProducts,
            setSelectedProducts
        }}>
            {children}
        </ProductQuantityContext.Provider>
    );
}