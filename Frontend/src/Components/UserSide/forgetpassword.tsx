
import newlogo from "../Images/newslogo.jpg";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import logoWeb from "../Animations/Animation - 1724244656671.json";
import { forgetmail } from "../../Services/User_API/Forgotsideapis";
const Forgetpassword: React.FC = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });
  console.log("started password");
  const handleSubmit = async (values: { email: string }) => {

  const emaildata = { email: values.email };
    try {
      const response = await forgetmail(emaildata);
      if (response.success) {
        const secretKey = "your-secret-key-crypto";
        const emailget = response.emaildetail;
        const encryptedEmail = CryptoJS.AES.encrypt(
          emailget,
          secretKey
        ).toString();
        navigate("/forgetotp", { state: { email: encryptedEmail } });
      } else {
        toast.error("confirm user failed");
      }
    } catch (error:unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "No user found";
        toast.error(errorMessage);
      } else {
        toast.error("Unknown error occurred");
      }
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div>
      <nav className="fixed w-full top-0 left-0 z-50 bg-black border-b border-gray-700 h-[60px] flex items-center">
        <div className="px-3 sm:px-4 py-2">
          <div className="flex items-center space-x-2">
            <Lottie
              animationData={logoWeb}
              className="w-14 sm:w-18 md:w-24 lg:w-32"
              style={{ maxWidth: "100px", height: "auto" }}
            />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold font-['Viaoda_Libre']">
              Clear View
            </h1>
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
          <div className="mb-0 text-center"></div>

          <div className="mb-1 text-center">
            <h2
              className="text-3xl md:text-3xl"
              style={{ fontFamily: "junge" }}
            >
              Your trusted source for <br /> the latest news and insights
            </h2>
          </div>

          <div className="flex flex-col mx-auto w-full md:w-3/4">
            <h1
              style={{ fontFamily: "junge", fontSize: "30px", padding: "20px" }}
            >
              Email
            </h1>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="py-3 px-4 border bg-black rounded mb-5 md:mb-10 text-lg w-full"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  />
                  <ErrorMessage
                    name="email"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgetpassword;
