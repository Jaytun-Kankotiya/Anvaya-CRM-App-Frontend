import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import {ProductProvider} from './contexts/ProductContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function App() {

  return (
    <>
    <ToastContainer toastStyle={{marginTop: '2.5rem'}} pauseOnFocusLoss={false} draggable={true} pauseOnHover={false} closeOnClick={true} />
    {/* <ProductProvider> */}
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    {/* </ProductProvider> */}
    </>
  )
}

export default App

