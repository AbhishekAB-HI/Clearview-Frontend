import React, { useState } from "react";
import { FaImage, FaVideo, FaSmile, FaSpinner } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import toast from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditPostModalProps } from "../Interfaces/Interface";
import axios from "axios";
import { editpost } from "../../Services/User_API/Createnewpost";


const EditPostModal = ({toggleeditpostModal,updateState,postid,
}: EditPostModalProps) => {
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    content: Yup.string()
      .trim()
      .required("Content is required")
      .max(500, "Content must be under 500 characters")
      .test(
      "is-not-only-spaces",
      "Name cannot be only spaces",
      (value) => !!value && value.trim().length > 0
    ),
    images: Yup.mixed().notRequired(),
    videos: Yup.mixed().notRequired(),
  });

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (files) {
       const newImages = Array.from(files);
       const totalImages = postImages.length + newImages.length;

       if (totalImages > 4) {
         toast.error("You can only upload a maximum of 4 images.");
         return; 
       }

       setPostImages((prevImages) => [...prevImages, ...newImages]);
     }
   };


  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files);
      const totalVideos = postVideos.length + newVideos.length;

      if (totalVideos > 4) {
        toast.error("You can only upload a maximum of 4 videos.");
        return;
      }

      setPostVideos((prevVideos) => [...prevVideos, ...newVideos]);
      e.target.value = "";
    }
  };


  const handlePostSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("content", values.content);

    postImages.forEach((image) => {
      formData.append("images", image);
    });

    postVideos.forEach((video) => {
      formData.append("videos", video);
    });

    formData.append("postId", postid || "");

    try {
      const response = await editpost(formData);
      if (response.success) {
        toast.success("Post updated successfully");
        updateState();
        toggleeditpostModal();
      }else{
        toast.error("Post updated Failed");
      }
      setSubmitting(false);
    } catch (error:unknown) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = (
    emoji: any,
    setFieldValue: any,
    currentContent: string
  ) => {
    setFieldValue("content", currentContent + emoji.native);
    setShowEmojiPicker(false);
  };

const handleImageRemove = (index: number) => {
  setPostImages((prevImages) => prevImages.filter((_, i) => i !== index));
};

  const handleVideoRemove = (index: number) => {
    setPostVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full relative text-white">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

        <Formik
          initialValues={{ content: "", images: "", videos: "" }}
          validationSchema={validationSchema}
          onSubmit={handlePostSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <Field
                  as="textarea"
                  name="content"
                  className="w-full p-3 bg-gray-900 text-white mb-4 border border-gray-600 rounded"
                  rows={6}
                  placeholder="What's happening?"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mb-2"
                />
              </div>

              {/* Image and Video Upload */}
              <div className="mb-4">
                {/* Display multiple images */}
                {postImages.length > 0 && (
                  <div className="mb-2">
                    {postImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative inline-block mr-2 mb-2"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Display multiple videos */}

                {postVideos.length > 0 && (
                  <div className="mb-2">
                    {postVideos.map((video, index) => (
                      <div
                        key={index}
                        className="relative inline-block mr-2 mb-2"
                      >
                        <video
                          src={URL.createObjectURL(video)} // Create a preview URL for the video
                          controls
                          className="w-20 h-20 object-cover rounded-lg"
                        ></video>
                        <button
                          onClick={() => handleVideoRemove(index)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="upload-image" className="cursor-pointer">
                    <FaImage className="text-xl hover:text-blue-500" />
                    <input
                      type="file"
                      id="upload-image"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <label htmlFor="upload-videos" className="cursor-pointer">
                    <FaVideo className="text-xl hover:text-blue-500" />
                    <input
                      type="file"
                      id="upload-videos"
                      accept="video/*"
                      multiple
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>

                  <FaSmile
                    className="text-xl hover:text-blue-500 cursor-pointer"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={toggleeditpostModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      "Update post"
                    )}
                  </button>
                </div>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-0">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: unknown) =>
                      handleEmojiSelect(emoji, setFieldValue, values.content)
                    }
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditPostModal;
