import toast from "react-hot-toast";
import {  useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../Interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { sendfollow } from "../UserSide/GlobalSocket/CreateSocket";
import { Users2Icon } from "lucide-react";
import { findfollowing, followuser, getuserinfomations } from "../../Services/User_API/FollowerApi";
import SideNavBar1 from "./sideNavBar1";
import Navbar1 from "./Navbar1";

const FollowingPage = () => {
  const [getAlluser, setgetAlluser] = useState<IUser[]>([]);
  const [userid, setuserID] = useState<string>("");
  const [userinfo, setuserinfo] = useState<IUser>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(1);

  useEffect(() => {
    const getAllPost = async () => {
      try {
         const responce = await findfollowing(currentPage, postsPerPage);

        if (responce.success) {
          setgetAlluser(responce.followusers);
          setTotalPosts(responce.totalfollow);
        } else {
          toast.error("Failed to get other users");
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

    getAllPost();
  }, []);


  useEffect(() => {
    updateUsers();
  }, [currentPage]);

  const updateUsers = async () => {
    try {
   const responce = await findfollowing(currentPage, postsPerPage);
      if (responce.success) {
        setgetAlluser(responce.followusers);
        setTotalPosts(responce.totalfollow);
      } else {
        toast.error("Failed to get other users");
      }
    } catch (error: unknown) {
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
    const findUsers = async () => {
      try {
          const response = await getuserinfomations();
        if (response.success) {
          setuserID(response.useridfound);
        } else {
          toast.error("user id not found");
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
    findUsers();
  }, []);

  const viewProfile = async (userID: string) => {
    try {
      if (userID === userid) {
        navigate("/profile");
      } else {
        navigate("/viewProfile", { state: { userID } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserinfo = async () => {
    try {
       const response = await getuserinfomations();
      if (response.success) {
        setuserinfo(response.userdetails);
      } else {
        toast.error("No user found");
      }
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

  const followUser = async (userId: string, LoguserId: string) => {
    try {

      const response = await followuser(userId, LoguserId);
      if (response.success) {
        sendfollow(userId, response.usersinfos, response.followingUsers);
        getUserinfo();
        updateUsers();
      } else {
        toast.error("followers found failed");
      }
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

  useEffect(() => {
    const getUserinfo = async () => {
      try {
     const response = await getuserinfomations();
        if (response.success) {
          setuserinfo(response.userdetails);
        } else {
          toast.error("No user found");
        }
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
    getUserinfo();
  }, []);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar1 />
      <SideNavBar1 />

      <div className="flex flex-col md:flex-row mt-12">
        {/* Sidebar - Hidden on small screens, shows on larger screens */}
        <aside className="hidden md:block md:w-1/4 lg:w-1/5">
          <SideNavBar1 />
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 lg:w-4/5 ml-auto px-4 md:px-6">
          {/* Messages Section */}
          <div className="fixed top-15  md:top-20 md:left-80  w-full bg-black pl-5  pt-5 pb-5 z-10">
            <h1 className="text-xl  md:text-2xl font-bold">Following</h1>
          </div>

          <div className="space-y-4 p-5 mt-25 w-full min-h-screen">
            {getAlluser && getAlluser.length > 0 ? (
              getAlluser.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-gray-900 p-4 rounded-lg hover:shadow-lg transition-shadow"
                >
                  {/* User Profile and Info */}
                  <div
                    onClick={() => viewProfile(user._id)}
                    className="flex items-center space-x-5 w-full cursor-pointer"
                  >
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-700"
                    />
                    <div>
                      <p className="text-sm md:text-lg font-medium">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  {/* Follow/Unfollow Button */}
                  <button
                    onClick={() => followUser(user._id, userinfo?._id)}
                    className={`px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-semibold rounded-full border transition-colors duration-300 ${
                      userinfo?.following.some(
                        (userOne) => userOne._id === user._id
                      )
                        ? "text-white border-blue-600 bg-transparent hover:bg-blue-700 hover:border-blue-700"
                        : "text-white border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700"
                    }`}
                  >
                    {userinfo?.following.some(
                      (userOne) => userOne._id === user._id
                    )
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              ))
            ) : (
              // No Followers Placeholder
              <div className="flex flex-col items-center justify-center h-80 p-8 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-sm animate-pulse" />
                    <Users2Icon
                      size={48}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    No Following
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    Looks like there aren't any Following. Check back later.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 mb-20">
            <nav className="flex space-x-2">
              <button
                className={`text-lg text-blue-500 px-3 py-1 rounded-md ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`text-sm px-3 py-1 rounded-md ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-blue-500"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className={`text-lg text-blue-500 px-3 py-1 rounded-md ${
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FollowingPage;
