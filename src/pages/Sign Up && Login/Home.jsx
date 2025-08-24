import React from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useProduct } from "../../contexts/ProductContext";


const Home = () => {

    const {userData, isLoggedIn} = useProduct()
    return (
        <div className="home-maindiv" >
            <Navbar />
            <div className="page-wrapper">
            <div className="header-main-div">
                <img className="header-img" src={assets.header_img} alt="" />
                <h4 className="mt-2">Hello {userData ? userData.name : "Developer"}! <img className="mb-1" style={{width: '28px', height: '28px'}} src={assets.hand_wave} alt="" /></h4>
                <h2>Welcome to Anvaya CRM App</h2>
                <p className="mb-1">📊 Maintain detailed records of your sales agents and their performance.</p>
                <p >⚡Streamline your sales process to save time and grow faster.</p>
                <button className="login-btn py-2 px-3 mt-3"><Link to={isLoggedIn ? '/anvaya-dashboard' : '/login'} style={{textDecoration: 'none', color: 'black'}} href="/login">Get Started</Link></button>
            </div>
        </div>
        </div>
    )
}

export default Home