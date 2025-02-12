import { useEffect, useState } from "react";
import { store } from "../../Redux-store/reduxstore";
import Lottie from "lottie-react";
import logoWeb from "../Animations/Animation - 1724244656671.json";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearuserAccessTocken } from "../../Redux-store/redux-slice";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { API_USER_URL, ENDPOINT } from "../Constants/Constants";
import toast from "react-hot-toast";
import io, { Socket } from "socket.io-client";
import axiosClient from "../../Services/Axiosinterseptor";


let socket: Socket;
const Navbar2 = () => {
  type RootState = ReturnType<typeof store.getState>;
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [AccOpen, setAccOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saveid, setsaveid] = useState<string | any>(null);

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

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data } = await axiosClient.get(`${API_USER_URL}/getuserid`);
        if (data.message === "user id get") {
          setsaveid(data.userId);
        } else {
          toast.error("Failed to retrieve userid.");
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
              toast.error("Posts not found");
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

    getUserId();
  }, []);

  const logoutUser = (userId: string) => {
    if (socket) socket.emit("logout", userId);
  };



  const handleLogout = async () => {
    try {
      logoutUser(saveid);
      const { data } = await axiosClient.patch(
        `${API_USER_URL}/updatelastseen`
      );

      if (data.message === "lastTime updated") {
        toast.success("Logout successfull");
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
      dispatch(clearuserAccessTocken());
      localStorage.removeItem("usertocken");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-black border-b border-gray-700">
      <div className="px-4 py-3 pb-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Lottie animationData={logoWeb} className="w-12 sm:w-16 md:w-20" />
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "Viaoda Libre" }}
            >
              Clear View
            </h1>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 lg:mr-10 text-white text-base md:text-lg">
            {userDetails ? (
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setAccOpen(!AccOpen)}
                  className="px-4 py-2.5 text-sm cursor-pointer md:block hidden font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Account
                </button>
                {AccOpen && (
                  <div
                className="absolute top-60  lg:right-20 lg:top-0 w-32 mr-5 rounded-md  shadow-lg bg-white text-black  ring-1  ring-opacity-5" // Adjusted width and margin
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <div className="py-1">
                      <Link
                        className="block px-4 py-1 text-sm hover:text-white   hover:bg-gray-400"
                        to="/profile"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-1 text-sm hover:text-white hover:bg-gray-400 "
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <button className="hover:underline">
                  <Link to="/login">Log In</Link>
                </button>
                <span>|</span>
                <button className="hover:underline">
                  <Link to="/register">Sign Up</Link>
                </button>
              </div>
            )}
          </div>
          {/* Mobile search bar and account toggle */}
          <div className="flex items-center lg:hidden">
            <button
              className="ml-4 text-white"
              onClick={() => setAccOpen(!AccOpen)}
            >
              <FaUserCircle size="24px" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
