import React, { useEffect, useRef, useState, createContext, useContext } from 'react'

export const ProductQuantityContext = createContext();
export const ProductQuantityProvider = ({ children }) => {
    const [submitted, setSubmitted] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState(null)
    const [quantityContext, setQuantityContext] = useState(1);
    const [mtrlines, setMtrLines] = useState([])
    const [exportWarehouse, setExportWarehouse] = useState(null)
    const [importWarehouse, setImportWarehouse] = useState(null)
    const [diathesima, setDiathesima]   = useState(null)
    const [diathesimotita, setDiathesimotita] = useState(null)
    const [attribute, setAttribute] = useState([
        {attributes: []}
    ])
  
    return (
        <ProductQuantityContext.Provider value={{ 
            //grid submitions to refresh it:
            submitted, setSubmitted,
             //grid selected Products:
            selectedProducts, setSelectedProducts,
            quantityContext, setQuantityContext, 
            mtrlines, setMtrLines, 
            exportWarehouse, setExportWarehouse,
            importWarehouse, setImportWarehouse,
            attribute, setAttribute,
            diathesima, setDiathesima
           
        }}>
            {children}
        </ProductQuantityContext.Provider>
    );
}