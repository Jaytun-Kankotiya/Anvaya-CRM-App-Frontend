import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const { backendUrl, userData, isLoggedIn, logout, setUserData, sendVerificationOtp } =
    useProduct();

  console.log(isLoggedIn);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/user/data", {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
        console.log("User Data:", data.userData);
      } else {
        toast.error(data.message);
        setUserData(null)
      }
    } catch (error) {
        setUserData(null)
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  console.log("userData state: ", userData);

  return (
    <div className="container d-flex justify-content-between align-items-center py-2">
      <h3 className="mb-0">
        <Link
          to={isLoggedIn ? "/anvaya-dashboard" : "/"}
          style={{ textDecoration: "none", color: "#4a3333" }}>
          Anvaya CRM App
        </Link>
      </h3>
      {userData ? (
        <div className="user-badge">
          {userData.name}
          <div className="user-dropdown">
            <ul>
              <li>
                <Link className="my-profile" to="/login">
                  My Profile
                </Link>
              </li>
              {!userData.isVerified && (
                <li onClick={sendVerificationOtp}>Verify email</li>
              )}
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <Link
          className="login-btn"
          to="/login"
          style={{ textDecoration: "none", color: "black" }}>
          Login
          <img
            className="ms-1"
            style={{ width: "18px", height: "18px" }}
            src={assets.arrow_icon}
            alt=""
          />
        </Link>
      )}
    </div>
  );
};

export default Navbar;
