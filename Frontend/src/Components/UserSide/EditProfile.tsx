import React, { ChangeEvent, useState } from "react";
import profileimg from "../Images/Userlogo.png";
import axios from "axios";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaSpinner, FaUpload, FaTrashAlt } from "react-icons/fa";
import { EditProfileModalProps } from "../Interfaces/Interface";
import { updateprofile } from "../../Services/User_API/Editpassword";

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  toggleModal,
  updateProfileState,
  userid,
}) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .required("Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image: null as File | null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.image) {
        formData.append("image", values.image);
      }
      if (userid) {
        formData.append("userId", userid);
      }
      setLoading(true);
      try {
        const response = await updateprofile(formData);
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      formik.setFieldValue("image", file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setIsImageUploaded(true);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
    setIsImageUploaded(false);

    // Reset the file input value to allow re-uploading the same file
    const fileInput = document.querySelector(
      'input[name="image"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

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
              Edit Profile
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
            <div className="flex flex-col items-center mb-5 space-y-4">
              {/* Modern Image Upload with Preview and Remove Option */}
              <div className="relative flex flex-col items-center group">
                <img
                  src={imagePreview || profileimg}
                  alt="Profile Preview"
                  className="h-32 w-32 rounded-full border-4 border-gray-200 shadow-md object-cover transition-transform transform hover:scale-105"
                />
                <label
                  className={`cursor-pointer mt-4 p-2 rounded-lg bg-blue-500 text-white flex items-center space-x-2 hover:bg-blue-600 transition duration-150 ease-in-out ${
                    isImageUploaded ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaUpload className="text-sm" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isImageUploaded}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-2 p-2 text-red-500 hover:text-red-700 flex items-center space-x-2 transition duration-150 ease-in-out"
                  >
                    <FaTrashAlt className="text-sm" />
                    <span>Remove Image</span>
                  </button>
                )}
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              method="POST"
              encType="multipart/form-data"
              className="space-y-6"
            >
              {/* Other form fields */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 text-black rounded-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter your name"
                  required
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
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

export default EditProfileModal;
