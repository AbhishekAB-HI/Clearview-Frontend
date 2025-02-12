
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import newlogo from "../Images/newslogo.jpg";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { resendotp, verifyforgetotp } from "../../Services/User_API/Forgotsideapis";

const forgetOtppage: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(false);
  const location = useLocation();
  const encryptedEmail = location.state?.email;
  const secretKey = "your-secret-key-crypto";
  const bytes = CryptoJS.AES.decrypt(encryptedEmail, secretKey);
  const email = bytes.toString(CryptoJS.enc.Utf8);
  const navigate = useNavigate();
  const startTimer = (duration: number) => {
    const endTime = Date.now() + duration * 1000;
    localStorage.setItem("otpEndTime", endTime.toString());
    setTimer(duration);
    setCanResend(false);
    setIsVerifyDisabled(false);
  };

  useEffect(() => {
    const savedEndTime = localStorage.getItem("otpEndTime");

    if (savedEndTime) {
      const currentTime = Date.now();
      const remainingTime = Math.max(
        Math.floor((parseInt(savedEndTime) - currentTime) / 1000),
        0
      );

      if (remainingTime > 0) {
        setTimer(remainingTime);
        setCanResend(false);
        setIsVerifyDisabled(false);
      } else {
        setCanResend(true);
        setIsVerifyDisabled(true);
        localStorage.removeItem("otpEndTime");
      }
    } else {
      startTimer(30);
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          const newTimer = prevTimer - 1;
          if (newTimer === 0) {
            setCanResend(true);
            setIsVerifyDisabled(true);
            localStorage.removeItem("otpEndTime");
          }
          return newTimer;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyforgetotp(otp, email);
      if (response.success) {
        const secretKey = "your-secret-key-crypto";
        const emailget = response.emaildetail;
        console.log(emailget, "email.....get");

        const encryptedEmail = CryptoJS.AES.encrypt(
          email,
          secretKey
        ).toString();

        navigate("/ForgetPassPage", { state: { email: encryptedEmail } });
      } else {
        toast.error("confirm user Failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occured";
        toast.error(errorMessage);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  };

  const handleChange = (
    index: number,
    value: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = otp.split("");
      newOtp[index] = value;
      setOtp(newOtp.join(""));

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      } else if (!value && e.key === "Backspace" && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendotp(email);
      if (response.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error("OTP resent Failed");
      }
      startTimer(30);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.error("Unknown error occurred");
      }
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-purple-700 flex justify-center items-center order-1 md:order-2 p-5 md:p-10">
        <img
          src={newlogo}
          alt="News illustration"
          className="w-full md:w-4/5 max-w-xs md:max-w-md rounded-lg"
        />
      </div>

      <div className="flex-1 bg-black text-white flex flex-col justify-center p-5 md:p-10 order-2 md:order-1">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-3xl" style={{ fontFamily: "junge" }}>
            Your trusted source for <br /> the latest news and insights
          </h2>
        </div>
        <div className="mb-5 text-center">
          <h2 className="text-3xl md:text-3xl " style={{ fontFamily: "junge" }}>
            Verify OTP
          </h2>
        </div>

        <div className="flex flex-col mx-auto w-full md:w-3/4">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-3 mb-10">
              {[...Array(4)].map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={otp[index] || ""}
                  onChange={(e) =>
                    handleChange(index, e.target.value, e as any)
                  }
                  onKeyDown={(e) => handleChange(index, "", e as any)}
                  className="w-12 h-12 text-center border bg-black text-white text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                />
              ))}
            </div>

            <button
              className={`bg-white text-black py-2 px-5 rounded text-lg mb-5 ${
                isVerifyDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ fontFamily: "Roboto, sans-serif" }}
              type="submit"
              disabled={isVerifyDisabled}
            >
              Verify OTP
            </button>
          </form>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-purple-500"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Resend OTP
              </button>
            ) : (
              <span
                className="text-gray-500"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Resend OTP in {timer}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default forgetOtppage;
