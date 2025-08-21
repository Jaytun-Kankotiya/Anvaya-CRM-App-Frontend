import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { data, Link, useNavigate } from "react-router-dom";
import {useProduct} from '../contexts/ProductContext'
import axios from "axios";
import { toast } from "react-toastify";


const Login = () => {

    const {formData, setFormData, backendUrl, setIsLoggedIn, getUserData} = useProduct()
    const [loginState, setLoginState] = useState(false)

    const navigate = useNavigate()

    const handleFormData = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()

            axios.defaults.withCredentials = true

            if(!loginState) {
                const {data} = await axios.post(backendUrl + '/v1/auth/register', {name: formData.name, email: formData.email, password: formData.password})

                if(data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                }else {
                    toast.error(data.message)
                }
            }else {
                const {data} = await axios.post(backendUrl + '/v1/auth/login', {email: formData.email, password: formData.password})

                if(data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                }else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }




    console.log(formData)

    return (
        <div className="login-bg">
        <Navbar />
            <div className="login-container">
                <div className="input-form">
                <h2 className="form-title mb-0">{loginState ? 'Login' : 'Sign Up'}</h2>
                <p className="text-center-login mb-1">{loginState ? 'Login to your account' : 'Create your account' }</p>
                <form onSubmit={onSubmitHandler}>
                    {loginState ?
                    '' : 
                    <div className="input-group mb-4 rounded-pill">
                        <img src={assets.person_icon} alt="" className="input-icon mt-1" />
                        <input required type="text" name="name" onChange={handleFormData} value={formData.name} placeholder="Full Name" className="input-field" />
                    </div>
                    }

                    <div className="input-group">
                        <img src={assets.mail_icon} alt="" className="input-icon mt-1" />
                        <input required type="text" name="email" onChange={handleFormData} value={formData.email} placeholder="Email Id" className="input-field"/>
                    </div><br/>

                    <div className="input-group">
                        <img src={assets.lock_icon} alt="" className="input-icon mt-1" />
                        <input required type="password" name="password" onChange={handleFormData} value={formData.password} placeholder="Password" className="input-field"/>
                    </div>

                    <div className="forgot-link mt-2">
                    <Link to='/reset-password'>Forgot password?</Link><br/><br />
                    </div>

                    <button type="submit" className="submit-btn">{loginState ? 'Sign In': 'Sign Up'}</button>
                    <div className="d-flex justify-content-center align-items-center  mt-3 gap-2">
                        <p className="mb-0">{loginState ? 'Not a member?' : 'Already have an account?'}</p>
                        <button type="button" onClick={() => setLoginState((prev) => !prev)} style={{backgroundColor: '#3749b0', color: 'white'}} className="btn">{loginState ? 'Sign Up' : 'Sign In'}</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Login