import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

const ProductProvider = (props) => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const backendUrl = import.meta.env.VITE_ANVAYA_BACKEND_URL;

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/v1/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/user/data", {
        withCredentials: true,
      });
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/auth/is-auth", {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/v1/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sidebar = () => {
    return (
      <aside className="dash-board-sidebar">
        <h5 className="sidebar-title">Dashboard Menu</h5>
        <ul className="sidebar-links">
          <li>
            <Link className="sidebar-link">Leads</Link>
          </li>
          <li>
            <Link to="/sales-agent" className="sidebar-link">
              Sales Agents
            </Link>
          </li>
          <li>
            <Link className="sidebar-link">Reports</Link>
          </li>
          <li>
            <Link className="sidebar-link">Settings</Link>
          </li>
        </ul>
      </aside>
    );
  };

  const value = {
    backendUrl,
    formData,
    setFormData,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    sidebar,
    logout,
    sendVerificationOtp,
  };
  return (
    <>
      <ProductContext.Provider value={value}>
        {props.children}
      </ProductContext.Provider>
    </>
  );
};

export { ProductProvider };
