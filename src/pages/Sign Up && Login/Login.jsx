import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";
import { data, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../contexts/ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const {
    formData,
    setFormData,
    backendUrl,
    isLoggedIn,
    userData,
    logout,
    setIsLoggedIn,
    getUserData,
    sendVerificationOtp
  } = useProduct();
  const [loginState, setLoginState] = useState(true);

  const navigate = useNavigate();

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (!loginState) {
        const { data } = await axios.post(backendUrl + "/v1/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
        setFormData({ name: "", email: "", password: "" });
      } else {
        const { data } = await axios.post(backendUrl + "/v1/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();

          navigate("/anvaya-dashboard");
        } else {
          toast.error(data.message);
        }
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  console.log(formData);
  console.log(userData);

  return (
    <div className="login-bg">
      <Navbar />
      <div className="login-container">
        <div className="input-form">
          {isLoggedIn ? (
              <div className="p-4 bg-transparent">
                <h2 className="text-center mb-3">Welcome, {userData?.name}</h2>
                <p className="text-center mb-4">Here's your profile info:</p>
                <div className=" text-center mb-4">
                  <img
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    className="rounded-circle img-fluid"
                    src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
                    alt="Profile Pic"
                  />
                </div>
                <div className="mb-4">
                  <p className="mt-3">Name: {userData.name}</p>{" "}
                  <hr className="mb-2 mt-0" />
                  <p>Email: {userData.email}</p>
                  <hr className="mb-2 mt-0" />
                  <p>
                    Account Verified:{" "}
                    {userData.isVerified ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ✅ Verified
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ❌ Not Verified
                      </span>
                    )}
                  </p>
                </div>
                {!userData.isVerified && <button onClick={sendVerificationOtp} className="verify-btn mb-2">Verify Account Now</button>}
                <button
                  type="button"
                  className="verify-btn d-flex justify-content-center align-items-center gap-1"
                  onClick={logout}
                >
                  LogOut<i className="fas fa-sign-out-alt me-2"></i>
                </button>
              </div>
          ) : (
            <>
              <h2 className="form-title mb-0">
                {loginState ? "Login" : "Sign Up"}
              </h2>
              <p className="text-center-login mb-1">
                {loginState ? "Login to your account" : "Create your account"}
              </p>
              <form onSubmit={onSubmitHandler}>
                {loginState ? (
                  ""
                ) : (
                  <div className="input-group mb-4 rounded-pill">
                    <img
                      src={assets.person_icon}
                      alt=""
                      className="input-icon mt-1"
                    />
                    <input
                      required
                      type="text"
                      name="name"
                      onChange={handleFormData}
                      value={formData.name}
                      placeholder="Full Name"
                      className="input-field"
                    />
                  </div>
                )}

                <div className="input-group">
                  <img
                    src={assets.mail_icon}
                    alt=""
                    className="input-icon mt-1"
                  />
                  <input
                    required
                    type="text"
                    name="email"
                    onChange={handleFormData}
                    value={formData.email}
                    placeholder="Email Id"
                    className="input-field"
                  />
                </div>
                <br />

                <div className="input-group">
                  <img
                    src={assets.lock_icon}
                    alt=""
                    className="input-icon mt-1"
                  />
                  <input
                    required
                    type="password"
                    name="password"
                    onChange={handleFormData}
                    value={formData.password}
                    placeholder="Password"
                    className="input-field"
                  />
                </div>

                <div className="forgot-link mt-2">
                  <Link to="/reset-password">Forgot password?</Link>
                  <br />
                  <br />
                </div>

                <button type="submit" className="submit-btn">
                  {loginState ? "Sign In" : "Sign Up"}
                </button>
                <div className="d-flex justify-content-center align-items-center  mt-3 gap-2">
                  <p className="mb-0">
                    {loginState ? "Not a member?" : "Already have an account?"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setLoginState((prev) => !prev)}
                    className="toggle-btn"
                  >
                    {loginState ? "Sign Up" : "Sign In"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
