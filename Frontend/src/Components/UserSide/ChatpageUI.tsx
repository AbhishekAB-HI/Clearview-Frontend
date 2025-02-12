import { useNavigate } from "react-router-dom";
import { FaImage, FaSmile } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { store } from "../../Redux-store/reduxstore";
import axios from "axios";
import data from "@emoji-mart/data";
import io, { Socket } from "socket.io-client";
import Picker from "@emoji-mart/react";
import { IoSend } from "react-icons/io5";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { ActiveUsersType, userInfo } from "../Interfaces/Interface";
import {ActiveUsershere,initilizeSocket,joinChatRoom,sendMessage,setupOnMessageReceived,} from "../UserSide/GlobalSocket/CreateSocket";
import { setSelectedChat } from "../../Redux-store/redux-slice";
import {
  findAllmessage,
  getuserdetails,
  getuserid,
  Sendmessages,
} from "../../Services/User_API/Chatpage";
import { ENDPOINT } from "../Constants/Constants";
import SideNavBarChat from "./SideNavbar2";
import NavbarChat from "./NavbarChat";
let socket: Socket;
let selectedChatCompare: any;

const ChatPage: React.FC<{}> = () => {

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const {chatId, dataId } = useParams<{ chatId: any; dataId: any }>();
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userinfo, setuserinfo] = useState<userInfo | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState(false);
  const [userId, setUserId] = useState<string | any>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUsersType[]>([]);
  const [isOnline, setIsOnline] = useState(false);


    const userToken = useSelector(
      (state: RootState) => state.accessTocken.userTocken
    );




useEffect(()=>{
  socket = io(ENDPOINT);
  socket.emit("setup", userToken);
 ActiveUsershere(setActiveUsers);
  },[])

  useEffect(() => {
    const socketInstance = initilizeSocket(userToken);
    const onMessageReceived = (newMessageReceived: any) => {
      if (!selectedChatCompare ||selectedChatCompare._id == newMessageReceived.chat._id
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        scrollToBottom();
      } else {
         
      }
    };
  setupOnMessageReceived(onMessageReceived);
    return () => {
      socketInstance.off("message received");
    };
  }, []);




  useEffect(() => {
    const GetUserId = async () => {
      try {
        const response = await getuserdetails(chatId);
        if (response.success) {
          setuserinfo(response.userdetails);
        } else {
          toast.error("User id not found");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            toast.error(
              "Network error. Please check your internet connection."
            );
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

    GetUserId();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    handleOnline();
  }, [activeUsers]);

  const handleJoinRoom = useCallback(() => {
    navigate(`/room/${dataId}`);
  }, [navigate, dataId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success("file uploaded");
      const imageFiles: File[] = [];
      const videoFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          imageFiles.push(file);
        } else if (file.type.startsWith("video/")) {
          videoFiles.push(file);
        }
      });

      if (imageFiles.length > 0) {
        setPostImages((prevImages) => [...prevImages, ...imageFiles]);
      }

      if (videoFiles.length > 0) {
        setPostVideos((prevVideos) => [...prevVideos, ...videoFiles]);
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prevContent) => prevContent + emoji.native);
    setShowEmojiPicker(false);
  };

  type RootState = ReturnType<typeof store.getState>;

  const selectedChat = useSelector(
    (state: RootState) => state.accessTocken.SelectedChat
  );

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const response = await findAllmessage(dataId);
      if (response.success) {
        setMessages(response.getmessages);
        joinChatRoom(dataId);
      } else {
        toast.error("Failed to get all messages");
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

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (
      !newMessage.trim() &&
      postImages.length === 0 &&
      postVideos.length === 0
    ) {
      return;
    }

    try {
      const formData = new FormData();
      if (newMessage.trim()) {
        formData.append("content", newMessage);
      }
      formData.append("chatId", dataId);
      postImages.forEach((image) => {
        formData.append(`images`, image);
      });
      postVideos.forEach((video) => {
        formData.append(`videos`, video);
      });

      const response = await Sendmessages(formData);
      if (response.success) {
        setLoading(false);
        sendMessage(response.getData);
        setMessages([...messages, response.getData]);
        setSelectedChat([...messages, response.getData]);
        setNewMessage("");
        setPostImages([]);
        setPostVideos([]);
        scrollToBottom();
      } else {
        toast.error("Failed to upload file");
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


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    scrollToBottom();
  }, [selectedChat]);

  useEffect(() => {
    const getUserToken = async () => {
      if (!userToken) return;
      try {
        const response = await getuserid(userToken);
        if (response.success) {
          setUserId(response.useriD);
        } else {
          toast.error("No id get here");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            toast.error(
              "Network error. Please check your internet connection."
            );
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
    getUserToken();
  }, [userToken]);



  const handleOnline = () => {
    activeUsers.some((user) => user.userId === userinfo?._id)
      ? setIsOnline(true)
      : setIsOnline(false);
  };

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("33333333333333333333333333333")
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      // handleTyping(dataId);
      socket.emit("typing", dataId);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        // stopTyping(dataId);
        socket.emit("stop typing", dataId);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <NavbarChat />
      <SideNavBarChat />
      <div className="flex  md:mt-20 ">
        <main className="w-full lg:w-5/5   md:ml-68 md:p-4   flex flex-col space-y-4 relative  h-screen">
          <div className="top-20 fixed  w-full lg:w-4/5 rounded-xl bg-gray-900  p-4 flex items-center justify-between z-50">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50">
              <div className="relative">
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer block"
                >
                  <img
                    src={userinfo?.image || "/api/placeholder/40/40"}
                    alt="Profile"
                    className="rounded-full w-10 h-10 object-cover border-2 border-gray-700"
                  />
                </label>
                <div
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-gray-800 ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-white">
                  {userinfo?.name || "User Name"}
                </h1>
                <span
                  className={`text-sm ${
                    isOnline ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-10 mr-2 lg:mr-20">
              <button
                onClick={handleJoinRoom}
                className="bg-red-600 p-2 lg:p-3 rounded-full text-white hover:bg-red-500 transition text-sm lg:text-base"
              >
                📹 Video
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-black  rounded-lg h-full w-full lg:w-[165vh] overflow-y-auto mt-20 lg:mt-24">
            <div className="mt-20 mb-24 px-4 space-y-6">
              {messages.map((m) => (
                <div
                  className={`flex items-start space-x-2 ${
                    m.sender._id === userId ? "justify-end" : "justify-start"
                  } `}
                  key={m._id}
                >
                  {m.sender._id !== userId && (
                    <img
                      className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                      src={
                        m.sender.image
                          ? m.sender.image
                          : "https://dummyimage.com/150x150/cccccc/ffffff&text=Uploadimage"
                      }
                      alt="profile"
                    />
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg p-2 mt-5 ${
                      m.sender._id === userId
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-700 text-white shadow-md"
                    }`}
                  >
                    <p className="text-sm  lg:text-lg font-semibold">
                      {m.content}
                    </p>
                    {(m.image || m.videos) && (
                      <div className="mt-2">
                        {m.image && m.image.length > 0 ? (
                          <img
                            className="rounded-md w-32 h-32 lg:w-40 lg:h-40 object-cover"
                            src={
                              m.image ||
                              "https://dummyimage.com/150x150/cccccc/ffffff&text=Uploadimage"
                            }
                            alt="sendimage"
                          />
                        ) : (
                          m.videos &&
                          m.videos.length > 0 && (
                            <video controls className="w-full mt-2 rounded-md">
                              <source src={m.videos} type="video/mp4" />
                            </video>
                          )
                        )}
                      </div>
                    )}
                    <p className="text-xs text-left lg:text-sm text-gray-400 mt-2">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {loading && (
                <OrbitProgress
                  color="#32cd32"
                  size="medium"
                  text=""
                  textColor=""
                />
              )}
            </div>
          </div>

          {/* Message Input Form */}
          <div className="bottom-0 fixed w-full lg:w-4/5  rounded-xl bg-gray-900 p-4 flex items-center justify-between z-50">
            <form
              onSubmit={handleSubmit}
              className="flex items-center w-full space-x-2 lg:space-x-4"
            >
              <FaSmile
                className="text-3xl lg:text-4xl hover:text-blue-500 cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              <input
                type="text"
                value={newMessage}
                onChange={typingHandler}
                className="p-2 flex-grow-0 w-full lg:w-3/4 rounded-md bg-gray-800 border border-gray-700 text-white text-sm lg:text-base"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="text-blue-500 w-10 h-10 lg:w-12 lg:h-12 hover:text-green-500 transition flex items-center justify-center"
              >
                <IoSend className="hover:text-green-500 text-xl lg:text-3xl" />
              </button>

              {/* Image Upload Label and Input */}
              <label
                htmlFor="upload-files"
                className="cursor-pointer w-10 h-10 lg:w-12  mt-3 ml-2 lg:ml-2"
              >
                <FaImage className="text-xl lg:text-3xl hover:text-blue-500 transition" />
              </label>
              <input
                type="file"
                id="upload-files"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </form>

            {showEmojiPicker && (
              <div className="absolute bottom-16 left-0">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
