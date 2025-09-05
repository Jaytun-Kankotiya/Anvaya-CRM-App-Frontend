import axios from "axios";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

const ProductProvider = (props) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leads, setLeads] = useState([]);
  const [userData, setUserData] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [salesAgentData, setSalesAgentsData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  
  const backendUrl = import.meta.env.VITE_ANVAYA_BACKEND_URL;
  
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

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

    const fetchLeaders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/v1/leads`);
      if (Array.isArray(data)) {
        setLeads(data);
        setFilteredLeads(data);
      } else {
        toast.error("Failed to fetch leads");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

const getSalesAgent = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/v1/agents");
      if (data.success) {
        setSalesAgentsData(data.salesAgentsList);
      } else {
        console.log("Error fetching sales Agents data");
      }
    } catch (error) {
      console.log("Failed to fetch the Sales Agents");
    }
  };

  const sidebar = () => {
    return (
      <aside className="dash-board-sidebar">
        <h5 className="sidebar-title">Dashboard Menu</h5>
        <ul className="sidebar-links">
          <li>
            <NavLink to="/leads" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Leads</NavLink>
          </li>
          <li>
            <NavLink to="/sales-agent" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              Sales Agents
            </NavLink>
          </li>
          <li>
            <NavLink to="/report" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Reports</NavLink>
          </li>
          <li>
            <NavLink to="/setting" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Settings</NavLink>
          </li>
        </ul>
      </aside>
    );
  };

  const handleStatusChnage = async (status) => {
    setStatusFilter(status);
    if (!status) {
      setFilteredLeads(leads);
      return;
    }
    try {
      const { data } = await axios.get(
        `${backendUrl}/v1/leads?status=${status}`
      );
      if (Array.isArray(data)) {
        setFilteredLeads(data);
      } else {
        toast.info("Mo Leads for this status");
        setFilteredLeads([]);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

useEffect(() => {
    getAuthState();
    fetchLeaders()
    getSalesAgent()
  }, []);

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
    navigate,
    leads, 
    setLeads,
    fetchLeaders,
    filteredLeads, 
    setFilteredLeads,
    salesAgentData,
    setSalesAgentsData,
    getSalesAgent,
    statusFilter,
    setStatusFilter,
    handleStatusChnage
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
