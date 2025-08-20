import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="container d-flex justify-content-between align-items-center py-2">
            <h3 className="mb-0"><Link to="/" style={{textDecoration: 'none', color: 'black'}}>Anvaya CRM App</Link></h3>
            <button className="login-btn" style={{padding: '6px 14px', }}><Link to='/login' style={{textDecoration: 'none', color: 'black'}}>Login<img className="ms-1" style={{width: '18px', height: '18px'}} src={assets.arrow_icon} alt="" /></Link></button>
        </div>
    )
}

export default Navbar