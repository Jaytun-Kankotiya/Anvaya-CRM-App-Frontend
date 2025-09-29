import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../contexts/ProductContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData, getUserData } = useProduct();

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    const lastIndex = pasteArray.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };

  const onOtpSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/v1/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="login-bg">
      <Navbar />
      <div className="verify-otp-container ">
        <form onSubmit={onOtpSubmitHandler} className="verify-otp-form ">
          <h1 className="text-center  mb-2">Email Verification</h1>
          <p className="text-center mb-4">
            Enter the 6-digit code sent to your email id.
          </p>
          <div onPaste={handlePaste} className="otp-inputs mb-3">
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
          <button className="verify-btn">Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
