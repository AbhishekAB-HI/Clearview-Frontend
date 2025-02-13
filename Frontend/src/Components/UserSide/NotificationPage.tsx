import toast from "react-hot-toast";
import {  useEffect, useState } from "react";
import {
  API_CHAT_URL,
  
} from "../Constants/Constants";
import axios from "axios";
import { IAllNotification, LikeNotification, postinfos } from "../Interfaces/Interface";
import {  Users2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../Services/Axiosinterseptor";
import SideNavBar1 from "./sideNavBar1";
import Navbar1 from "./Navbar1";

const NotificationPage = () => {

  const [notifications, setnotifications] = useState<IAllNotification[]>([]);
  const [likenotifications, setlikenotifications] = useState<LikeNotification[]>([]);
  const [AllPosts, setAllPosts] = useState<postinfos[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const updateUsers = async () => {
      try {
        const { data } = await axiosClient.get(
          `${API_CHAT_URL}/findnotifications`
        );
        if (data.message === "Allnotifications get") {
    
          setnotifications(data.followNotifications);
          setAllPosts(data.postNotifications);
          setlikenotifications(data.likeNotifications);
        } else {
          toast.error("Notifications not found");
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
    updateUsers();
  }, []);

  

  

  const ViewProfilePage = async (userID: string) => {
    try {
      navigate("/viewProfile", { state: { userID } });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar1 />
      <SideNavBar1 />
      <div className="flex flex-col sm:flex-row mt-12">
        <main className="w-full sm:w-3/4 lg:ml-70 lg:w-4/5 mx-auto">
          <div className="max-w-full mt-5 sm:mt-10 mx-auto bg-white dark:bg-black rounded-xl shadow-lg p-4 sm:p-6">
            <div className="divide-y divide-gray-200 border rounded-md border-gray-500 dark:divide-gray-800">
              {/* Notifications Section */}
              <h2 className="text-lg sm:text-xl p-4 font-bold dark:text-white text-center sm:text-left">
                Notifications
              </h2>

              {notifications?.length > 0 ||
              likenotifications?.length > 0 ||
              AllPosts?.length > 0 ? (
                <>
                  {/* Follow Notifications */}
                  {notifications?.length > 0 &&
                    notifications.map((user, index) => (
                      <div
                        onClick={() => ViewProfilePage(user.followuserId)}
                        key={index}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold dark:text-white text-sm sm:text-base">
                            {user.userName}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            started following you
                          </span>
                        </div>
                      </div>
                    ))}

                  {/* Like Notifications */}
                  {likenotifications?.length > 0 &&
                    likenotifications.map((post, index) => (
                      <div
                        key={index}
                        onClick={() => ViewProfilePage(post.likeduserId)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex items-center gap-3"
                      >
                        {post.postimage?.length > 0 && (
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                            <img
                              src={post.postimage[0]}
                              alt="Post"
                              className="w-full h-full rounded object-cover"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="blue"
                              stroke="blue"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full p-1 transform translate-x-1/2 translate-y-1/2"
                            >
                              <path d="M12 21C12 21 7 16.5 5 12.5C3 8.5 5.5 4.5 8 4.5C10.5 4.5 12 6.5 12 6.5C12 6.5 13.5 4.5 16 4.5C18.5 4.5 21 8.5 19 12.5C17 16.5 12 21 12 21Z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {post.postcontent}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Liked by {post.likedusername}
                          </span>
                        </div>
                      </div>
                    ))}

                  {/* New Posts */}
                  {AllPosts?.length > 0 &&
                    AllPosts.map((post, index) => (
                      <div
                        key={index}
                        onClick={() => ViewProfilePage(post.followuserId)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex items-center gap-3"
                      >
                        {post.image?.length > 0 ? (
                          <img
                            src={post.image[0]}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
                            alt="Post"
                          />
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            A new post uploaded
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Posted by {post.postUsername}
                          </span>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                // No Notifications
                <div className="relative mb-10 h-[400px] flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-sm animate-pulse" />
                      <Users2Icon
                        size={40}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                      No Notifications or Posts
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                      Looks like there aren't any notifications or posts yet.
                      Check back later.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationPage;
