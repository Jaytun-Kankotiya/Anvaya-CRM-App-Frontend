import { Children, createContext, useContext, useState } from "react";


const ProductContext = createContext()

export const useProduct = () => useContext(ProductContext)

const ProductProvider = ({children}) => {
    const [formData, setFormData] = useState([])



    return (
        <>
            <ProductContext.Provider value={{
                formData,
                setFormData
            }}>
                {children}
            </ProductContext.Provider>
        </>
    )
}

export {ProductProvider}