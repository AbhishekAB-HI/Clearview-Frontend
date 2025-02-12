import React, {  useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaSpinner,  } from "react-icons/fa";
import { EditProfileModalProps } from "../Interfaces/Interface";
import { updatePassword } from "../../Services/User_API/Editpassword";

const EditPasswordModal: React.FC<EditProfileModalProps> = ({
  toggleModal,
  updateProfileState,
  userid,
}) => {
  const [loading, setLoading] = useState(false);
 
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    newpassword: Yup.string()
      .min(8, "New password must be at least 8 characters long")
      .required("New password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      newpassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("password", values.password);
      formData.append("newpassword", values.newpassword);
      if (userid) {
        formData.append("userId", userid);
      }
      setLoading(true);
      try {
        const response = await updatePassword(formData);
        if (response.success) {
          toast.success("Profile updated");
          updateProfileState();
          toggleModal();
        } else {
          toast.error("Profile updation failed");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setLoading(false);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "An error occurred";
          toast.error(errorMessage);
        } else {
          toast.error("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
  });

 



  return (
    <div
      id="authentication-modal"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative p-6 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Change Your Password
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg text-sm p-2"
              onClick={toggleModal}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-6">
            <form
              onSubmit={formik.handleSubmit}
              method="PATCH"
              className="space-y-6"
            >
              {/* Other form fields */}

              <div>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3  text-black rounded-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>
              <div>
                <input
                  type="password"
                  name="newpassword"
                  value={formik.values.newpassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3  text-black rounded-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
                {formik.touched.newpassword && formik.errors.newpassword ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.newpassword}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPasswordModal;
