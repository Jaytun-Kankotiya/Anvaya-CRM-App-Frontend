import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useProduct } from "../contexts/ProductContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {

    const navigate = useNavigate()

  const {
    backendUrl,
    isLoggedIn,
    userData,
    getUserData,
    // handlePaste,
    // handleKeyDown,
    // handleInput,
  } = useProduct();
  

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState();
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmited] = useState(false);

  axios.defaults.withCredentials = true

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
        const {data} = await axios.post(backendUrl + '/v1/auth/send-reset-otp', {email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
    } catch (error) {
        toast.error(error.message)
    }
  }

  const inputRefs = React.useRef([]);
      const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if(inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

  const onSubmitOTP = async (e) => {
    e.preventDefault()
    try {
        const otpArray = inputRefs.current.map(e => e.value)
        setOtp(otpArray.join(''))
        const {data} = await axios.post(backendUrl + '/v1/auth/verify-reset-otp', {otp, email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsOtpSubmited(true)
    } catch (error) {
        toast.error(error.message)
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
        const {data} = await axios.post(backendUrl + '/v1/auth/reset-password', {email, newPassword})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && navigate('/login')
    } catch (error) {
        toast.error(error.message)
    }
  }

  return (
    <div className="login-bg">
      <Navbar />
      <div className="verify-otp-container">
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="verify-otp-form">
            <h1 className="text-center  mb-2">Reset Password</h1>
            <p className="text-center mb-4">
              Enter your registered email address
            </p>
            <div className="input-group">
              <img src={assets.mail_icon} alt="" className="input-icon mt-1" />
              <input
                required
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email Id"
                className="input-field"
              />
            </div>
            <br />
            <button type="submit" className="verify-btn">Send Verification OTP</button>
          </form>
        )}

        {!isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitOTP} className="verify-otp-form">
            <h1 className="text-center  mb-2">Verify Your OTP</h1>
            <p className="text-center mb-4">Enter your OTP</p>
            <div onPaste={handlePaste} className="otp-inputs">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{ width: "40px", height: "50px" }}
                    className="bg-light ms-3 text-center"
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                  />
                ))}
            </div>
            
            <button type="submit" className="verify-btn">Verify OTP</button>
          </form>
        )}

        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword} className="verify-otp-form">
            <h1 className="text-center  mb-2">Reset Password</h1>
            <p className="text-center mb-4">Enter your new password</p>
            <div className="input-group">
              <img src={assets.lock_icon} alt="" className="input-icon mt-1" />
              <input
                required
                type="password"
                name="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="Enter your new password"
                className="input-field"
              />
            </div>
            <br />
            <button type="submit" className="verify-btn">Change Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
