import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Sign Up && Login/Home';
import Login from './pages/Sign Up && Login/Login';
import EmailVerify from './pages/Sign Up && Login/EmailVerify';
import ResetPassword from './pages/Sign Up && Login/ResetPassword';
import {ProductProvider} from './contexts/ProductContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Leads && Sales Agent/Dashboard';
import AddNewLead from './pages/Leads && Sales Agent/AddNewLead';
import SalesAgent from './pages/Leads && Sales Agent/SalesAgents';
import Leads from './pages/Leads && Sales Agent/Leads';
import AddNewAgent from './pages/Leads && Sales Agent/AddNewAgent';
import Reports from './pages/Leads && Sales Agent/Reports';
import Settings from './pages/Leads && Sales Agent/Settings';

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
        <Route path='/anvaya-dashboard' element={<Dashboard />} />
        <Route path='/leads' element={<Leads />} />
        <Route path='/add-new-lead' element={<AddNewLead />} />
        <Route path='/sales-agent' element={<SalesAgent />} />
        <Route path='/add-new-agent' element={<AddNewAgent />} />
        <Route path='/report' element={<Reports />} />
        <Route path='/setting' element={<Settings />} />
      </Routes>
    {/* </ProductProvider> */}
    </>
  )
}

export default App

