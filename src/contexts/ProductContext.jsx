import axios from "axios";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductContext = createContext()
export const useProduct = () => useContext(ProductContext)


const ProductProvider = (props) => {

    axios.defaults.withCredentials = true

    const [formData, setFormData] = useState({name: "", email: "", password: ""})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const backendUrl = import.meta.env.VITE_ANVAYA_BACKEND_URL

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/v1/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/v1/auth/is-auth', {withCredentials: true})
            if(data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

        const inputRefs = React.useRef([])

    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if(inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    useEffect(() => {
        getAuthState()
    }, [])


    const value = {
        backendUrl,
        formData,
        setFormData, 
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        handlePaste, handleKeyDown, handleInput
    }
    return (
        <>
            <ProductContext.Provider value={value}>
                {props.children}
            </ProductContext.Provider>
        </>
    )
}

export {ProductProvider}