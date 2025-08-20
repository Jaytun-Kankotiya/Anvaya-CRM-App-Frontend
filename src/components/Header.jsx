import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="page-wrapper">
            <div className="header-main-div">
                <img className="header-img" src={assets.header_img} alt="" />
                <h4 className="mt-2">Hey Developer <img className="mb-1" style={{width: '28px', height: '28px'}} src={assets.hand_wave} alt="" /></h4>
                <h2>Welcome to Anvaya CRM App</h2>
                <button className="login-btn py-2 px-3 mt-3"><Link to='/login' style={{textDecoration: 'none', color: 'black'}} href="/login">Get Started</Link></button>
            </div>
        </div>
    )
}

export default Header