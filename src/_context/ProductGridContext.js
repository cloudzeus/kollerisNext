import React, {  useState, createContext } from 'react'

export const ProductQuantityContext = createContext();


export const ProductQuantityProvider = ({ children }) => {
    const [visible, setVisible] = useState(false)
    const [quantityContext, setQuantityContext] = useState(1);
    const [exportWarehouse, setExportWarehouse] = useState(null)
    const [importWarehouse, setImportWarehouse] = useState(null)
    const [diathesima, setDiathesima]   = useState(null)
    const [diathesimotita, setDiathesimotita] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const [attribute, setAttribute] = useState([
        {attributes: []}
    ])
  
    return (
        <ProductQuantityContext.Provider value={{ 
            quantityContext, setQuantityContext, 
            exportWarehouse, setExportWarehouse,
            importWarehouse, setImportWarehouse,
            attribute, setAttribute,
            diathesima, setDiathesima,
            diathesimotita, setDiathesimotita,
            activeIndex, setActiveIndex,
            visible, setVisible
        }}>
            {children}
        </ProductQuantityContext.Provider>
    );
}