import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import {useProduct} from '../contexts/ProductContext'


const Login = () => {

    const {formData, setFormData} = useProduct()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <>
        <Navbar />
            <div className="login-container">
                <div className="input-form">
                <h2 className="form-title mb-0">{isLoggedIn ? 'Login' : 'Sign Up'}</h2>
                <p className="text-center mb-1">{isLoggedIn ? 'Login to your account' : 'Create your account' }</p>
                <form>
                    {isLoggedIn ?
                    '' : 
                    <div className="input-group mb-4">
                        <img src={assets.person_icon} alt="" className="input-icon mt-1" />
                        <input type="text" placeholder="Full Name" className="input-field" />
                    </div>
                    }

                    <div className="input-group">
                        <img src={assets.mail_icon} alt="" className="input-icon mt-1" />
                        <input type="text" placeholder="Email Id" className="input-field"/>
                    </div><br/>

                    <div className="input-group">
                        <img src={assets.lock_icon} alt="" className="input-icon mt-1" />
                        <input type="text" placeholder="Password" className="input-field"/>
                    </div>

                    <div className="forgot-link mt-2">
                    <Link to='/reset-password'>Forgot password?</Link><br/><br />
                    </div>

                    <button type="submit" className="submit-btn">{isLoggedIn ? 'Sign In': 'Sign Up'}</button>
                    <div className="d-flex justify-content-center align-items-center text-center mt-3 gap-2">
                        <p className="mb-0">{isLoggedIn ? 'Not a member?' : 'Already have an account?'}</p>
                        <button type="button" onClick={() => setIsLoggedIn((prev) => !prev)} className="btn btn-success">{isLoggedIn ? 'Sign Up' : 'Sign In'}</button>
                    </div>
                    
                </form>
                </div>
            </div>
        </>
    )
}

export default Login