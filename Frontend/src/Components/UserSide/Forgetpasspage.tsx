import newlogo from "../Images/newslogo.jpg";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import Lottie from "lottie-react";
import logoWeb from "../Animations/Animation - 1724244656671.json";
import toast from "react-hot-toast";
import { forgetpassword } from "../../Services/User_API/Forgotsideapis";
const ForgetPassPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const encryptedEmail = location.state?.email;
  const secretKey = "your-secret-key-crypto";
  const bytes = CryptoJS.AES.decrypt(encryptedEmail, secretKey);
  const email = bytes.toString(CryptoJS.enc.Utf8);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });
  console.log("stating done")

  const handlesubmit = async (values: {
    password: string;
    confirmpassword: string;
  }) => {
    const { password } = values;
 
    try {
   const dataget = { password, email };
       const response = await forgetpassword(dataget);
      if (response.success) {
        navigate("/login");
      } else {
        toast.error("Password Changed  Failed");
      }
    } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        const status = error.response.status;
        if (status === 404) {
          toast.error("Posts not found.");
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Something went wrong.");
        }
      }
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
    console.log("Error fetching posts:", error);
    }
  };

  return (
    <div>
      <nav className="fixed w-full top-0 left-0 z-50 bg-black border-b border-gray-700">
        <div className="px-4 py-3 pb-5 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-0">
              <Lottie
                animationData={logoWeb}
                className="w-24  sm:w-36" // Responsive sizing for logo
              />
              <h1
                className="text-3xl sm:text-4xl  text-white  font-bold"
                style={{ fontFamily: "Viaoda Libre" }}
              >
                Clear View
              </h1>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 bg-purple-700 flex justify-center items-center order-1 md:order-2 p-5 md:p-10">
          <img
            src={newlogo}
            alt="News illustration"
            className="w-full md:w-4/5 max-w-xs md:max-w-md rounded-lg"
          />
        </div>

        <div className="flex-1 bg-black text-white flex flex-col justify-center p-5 md:p-10 order-2 md:order-1">
          <div className="mb-5 text-center"></div>

          <div className="mb-5 text-center">
            <h2
              className="text-3xl md:text-3xl"
              style={{ fontFamily: "junge" }}
            >
              Your trusted source for <br /> the latest news and insights
            </h2>
          </div>

          <div className="flex flex-col mx-auto w-full md:w-3/4">
            <Formik
              initialValues={{ password: "", confirmpassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handlesubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    className="py-3 px-4 border bg-black rounded mb-5 md:mb-10 text-lg w-full"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 mb-2"
                  />

                  <Field
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm your new password"
                    className="py-3 px-4 border bg-black rounded mb-5 md:mb-10 text-lg w-full"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  />
                  <ErrorMessage
                    name="confirmpassword"
                    component="div"
                    className="text-red-500 mb-2"
                  />

                  <button
                    type="submit"
                    className="bg-white text-black py-1 rounded text-lg mb-5"
                    style={{ fontFamily: "Roboto, sans-serif", width: "100%" }}
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            <div className="text-center text-sm">
              <br />
              <p
                className="text-white"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Don't have an account?{" "}
                <Link to="/register" className="font-bold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassPage;
