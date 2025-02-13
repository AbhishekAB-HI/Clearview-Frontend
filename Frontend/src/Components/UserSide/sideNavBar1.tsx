import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Home, MessageSquare, Users, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { store } from "../../Redux-store/reduxstore";
import { API_CHAT_URL, ENDPOINT } from "../Constants/Constants";
import toast from "react-hot-toast";
import { IAllNotification, Notification } from "../Interfaces/Interface";
import io, { Socket } from "socket.io-client";
import axiosClient from "../../Services/Axiosinterseptor";

let socket: Socket;
let selectedChatCompare: any;
const SideNavBar1 = () => {
  const [isOpen, setIsOpen] = useState(false);

  type RootState = ReturnType<typeof store.getState>;

  const [SaveAllNotifications, setSaveAllNotifications] = useState<
    Notification[]
  >([]);

  const userDetails = useSelector(
    (state: RootState) => state.accessTocken.userTocken
  );

  useEffect(() => {
    socket = io(ENDPOINT);
    if (userDetails) {
      socket.emit("setup", userDetails);
    }
    return () => {
      socket.disconnect();
    };
  }, [userDetails]);

  const getNotifications = async () => {
    try {
      const { data } = await axiosClient.get(
        `${API_CHAT_URL}/getnotifications`
      );
      if (data.message === "get all notifications") {
        setSaveAllNotifications(data.notifications);
      } else {
        toast.error("No notifications");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [Savenewpost, setSavenewpost] = useState<IAllNotification[]>([]);
  const [savelikeNotify, setsavelikeNotify] = useState<IAllNotification>();

  useEffect(() => {
    socket.on("notification received", (newMessageReceived: any) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        getNotifications();
      } else {
      }
    });
  }, []);

  useEffect(() => {
    socket.on("follow received", (followingUser) => {
      toast.success("User follow you");
      setSavenewpost(followingUser);
    });

    socket.on("Likenotification", (postDetails) => {
      toast.success("User Liked your post");
      setsavelikeNotify(postDetails);
    });

    socket.on("post update", (postdetails) => {
      toast.success("new post uploaded");
      setSavenewpost(postdetails);
    });
  }, []);




  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar after a link is clicked

  return (
    <>
      <button
        className="md:hidden fixed  top-10  left-0 z-50 text-2xl text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-20  border-r border-gray-700  md:top-21 left-0 h-full bg-black text-gray-100 w-60 p-4 space-y-6 shadow-xl
              transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0 md:w-72`}
      >
        {/* Create Post Button */}

        {/* Navigation Links */}
        <nav className="space-y-2">
          {[
            { icon: <Home size={24} />, text: "Home", path: "/homepage" },
            {
              icon: <MessageSquare size={24} />,
              text: "Messages",
              path: "/message",
              notificationCount: SaveAllNotifications.length
                ? SaveAllNotifications.length
                : null,
            },
            {
              icon: <Users size={24} />,
              text: "Followers",
              path: "/followers",
            },
            {
              icon: <Users size={24} />,
              text: "Following",
              path: "/following",
            },
            {
              icon: <Bell size={24} />,
              text: "Notifications",
              path: "/notifications",
              followNotification:
                savelikeNotify !== undefined || Savenewpost.length !== 0,
            },
            {
              icon: <Users size={24} />,
              text: "Find Friends",
              path: "/people",
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800
        transition-all duration-200 group relative overflow-hidden"
            >
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                {item.icon}
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors duration-200 text-sm font-medium">
                {item.text}
              </span>
              {item.text === "Messages" && item?.notificationCount && (
                <span className="absolute top-1 right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                  {item.notificationCount}
                </span>
              )}
              {item.text === "Notifications" && item?.followNotification && (
                <span className="absolute top-1 right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                  1
                </span>
              )}
              <div
                className="absolute inset-y-0 left-0 w-1 bg-blue-600 transform -translate-x-full
          group-hover:translate-x-0 transition-transform duration-200"
              />
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SideNavBar1;
