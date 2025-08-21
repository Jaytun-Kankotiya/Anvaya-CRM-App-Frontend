import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {

    const navigate = useNavigate()
    const {userData, backendUrl, setUserData, setIsLoggedIn, logout} = useProduct()


    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true

            const {data} = await axios.post(backendUrl + '/v1/auth/send-verify-otp')
            if(data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div className="container d-flex justify-content-between align-items-center py-2">
            <h3 className="mb-0"><Link to="/" style={{textDecoration: 'none', color: 'black'}}>Anvaya CRM App</Link></h3>
            {userData ? 
            <div className="user-badge">
                {userData.name[0].toUpperCase()}
                <div className="user-dropdown">
                    <ul>
                        <li><Link className="my-profile" to='/login'>My Profile</Link></li>
                        {!userData.isVerified && 
                            <li onClick={sendVerificationOtp}>Verify email</li>
                        }
                        <li onClick={logout}>Logout</li>
                    </ul>
                </div>
            </div>
            : <button className="login-btn" style={{padding: '6px 14px', }}><Link to='/login' style={{textDecoration: 'none', color: 'black'}}>Login<img className="ms-1" style={{width: '18px', height: '18px'}} src={assets.arrow_icon} alt="" /></Link></button>
            }
        </div>
    )
}

export default Navbar