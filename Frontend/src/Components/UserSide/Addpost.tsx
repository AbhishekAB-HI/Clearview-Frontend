import React, { useRef, useState, useEffect } from "react";
import { FaImage, FaVideo, FaSmile, FaSpinner } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import toast from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  CreatePostModalProps,
  IAllNotification,
  IUser,
} from "../Interfaces/Interface";
import axios from "axios";
import Cropper from "cropperjs";
import io, { Socket } from "socket.io-client";
import "cropperjs/dist/cropper.css";
import { createNewPost } from "../../Services/User_API/Createnewpost";
import { useSelector } from "react-redux";
import { store } from "../../Redux-store/reduxstore";
import { ENDPOINT } from "../Constants/Constants";
let socket: Socket;
const CreatePostModal = ({
  togglepostModal,
  updateState,
  userid,
}: CreatePostModalProps) => {
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  // Image cropping logic
  const [croppedImages, setCroppedImages] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const [enableCrop, setEnableCrop] = useState(false);

  type RootState = ReturnType<typeof store.getState>;
  const userDetails = useSelector(
    (state: RootState) => state.accessTocken.userTocken
  );

  console.log("started")

  useEffect(() => {
    socket = io(ENDPOINT);
    if (userDetails) {
      socket.emit("setup", userDetails);
    }
    return () => {
      socket.disconnect();
    };
  }, [userDetails]);

  const validationSchema = Yup.object({
    content: Yup.string()
      .trim()
      .required("Content is required")
      .max(500, "Content must be under 500 characters")
      .test(
        "is-not-only-spaces",
        "Content cannot be only spaces",
        (value) => !!value && value.trim().length > 0
      ),
    Category: Yup.string().required("Category is required"),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      const totalImages = postImages.length + newImages.length;

      if (enableCrop) {
        if (totalImages > 1) {
          toast.error("You can only upload a maximum of 1 images.");
          return;
        }
        setCurrentImage(newImages[0]);
        setModalVisible(true);
      } else {
        if (totalImages > 4) {
          toast.error("You can only upload a maximum of 4 images.");
          return;
        }
        setPostImages((prevImages) => [...prevImages, ...newImages]);
      }
    }
  };

  useEffect(() => {
    if (modalVisible && imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
      });
    }

    return () => {
      cropperRef.current?.destroy();
      cropperRef.current = null;
    };
  }, [modalVisible]);

  const handleCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.getCroppedCanvas().toBlob((blob: Blob | null) => {
        if (blob) {
          const croppedFile = new File(
            [blob],
            `cropped-${currentImage?.name}`,
            {
              type: currentImage?.type,
            }
          );
          setCroppedImages((prev) => [...prev, croppedFile]);
          setModalVisible(false);
        }
      });
    }
  };

  const sendPostNotify = async (
    userInfo: IUser,
    postdetails: IAllNotification
  ) => {
    try {
      if (socket) {
        socket.emit("newpost", userInfo, postdetails);
      }
    } catch (error) {
      console.error("Error fetching or emitting data:", error);
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
    formData.append("Category", values.Category);
    const imagesToUpload = enableCrop ? croppedImages : postImages;
    imagesToUpload.forEach((image) => {
      formData.append("images", image);
    });
    postVideos.forEach((video) => {
      formData.append("videos", video);
    });
    formData.append("userId", userid || "");

    try {
      const response = await createNewPost(formData);
      if (response.success) {
        sendPostNotify(response.userdetail, response.postinfo);
        toast.success("Post uploaded successfully");
        updateState(1);
        togglepostModal();
      } else {
        toast.error("Post upload failed");
      }
      setSubmitting(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          const status = error.response.status;
          if (status === 404) toast.error("Posts not found.");
          else if (status === 500)
            toast.error("Server error. Please try again later.");
          else toast.error("Something went wrong.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
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
    if (postImages.length > 0) {
      setPostImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    if (croppedImages.length > 0) {
      setCroppedImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    }
  };

  const handleVideoRemove = (index: number) => {
    setPostVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full relative text-white">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <Formik
          initialValues={{ content: "", Category: "", images: "", videos: "" }}
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
                <Field
                  as="select"
                  name="Category"
                  className="w-full p-3 bg-gray-900 text-white mb-4 border border-gray-600 rounded"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Breaking news">Breaking news</option>
                  <option value="Sports news">Sports news</option>
                </Field>
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mb-2"
                />
                <ErrorMessage
                  name="Category"
                  component="div"
                  className="text-red-500 text-sm mb-2"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={enableCrop}
                    onChange={() => setEnableCrop(!enableCrop)}
                  />
                  <span>Enable image cropping</span>
                </label>
              </div>
              {croppedImages.length > 0 && (
                <div className="mb-2">
                  {croppedImages.map((image, index) => (
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
              {postVideos.length > 0 && (
                <div className="mb-2">
                  {postVideos.map((video, index) => (
                    <div
                      key={index}
                      className="relative inline-block mr-2 mb-2"
                    >
                      <video
                        src={URL.createObjectURL(video)}
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
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  />
                </div>

                {showEmojiPicker && (
                  <div className="absolute top-16 right-4 z-10">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) =>
                        handleEmojiSelect(emoji, setFieldValue, values.content)
                      }
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={togglepostModal}
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
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Modal for cropping */}
      {modalVisible && (
        <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg  w-96 h-60  pr-5  ">
            <h3 className="text-lg text-black font-semibold m-4  ">
              Crop Image
            </h3>
            <img
              ref={imageRef}
              src={currentImage ? URL.createObjectURL(currentImage) : ""}
              alt="To be cropped"
              className="w-full mb-0"
            />
            <div className="flex justify-end mt-5 mb-5 ">
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg text-white"
                onClick={handleCrop}
              >
                Crop
              </button>
              <button
                className="ml-2 bg-red-500 px-4 py-2 rounded-lg text-white"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;
