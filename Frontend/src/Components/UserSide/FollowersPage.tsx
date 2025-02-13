
import toast from "react-hot-toast";
import {  useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../Interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { sendfollow } from "../UserSide/GlobalSocket/CreateSocket";
import { Users2Icon } from "lucide-react";
import { findFollowers, followuser, getuserinfomations } from "../../Services/User_API/FollowerApi";
import SideNavBar1 from "./sideNavBar1";
import Navbar1 from "./Navbar1";

const FollowersPage = () => {

  const [getAlluser, setgetAlluser] = useState<IUser[]>([]);
  const [totalFollowers, settotalFollowers] = useState(0);
  const [userid, setuserID] = useState<string>("");
  const [userinfo, setuserinfo] = useState<IUser>()
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const findUsers = async () => {
        try {
        const response = await getuserinfomations();
           if (response.success) {
             setuserID(response.useridfound);
           } else {
             toast.error("user id not found");
           }
        } catch (error:unknown) {
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


  useEffect(() => {
    const updateUsers = async () => {
      try {
        const response = await findFollowers(currentPage, postsPerPage);
        if (response.success) {
          setgetAlluser(response.users);
          settotalFollowers(response.totalfollowers);
        } else {
          toast.error("followers not found");
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


  useEffect(() => {
    updateUsers();
  }, [currentPage]);




  const updateUsers = async () => {
      try {
        const response = await findFollowers(currentPage, postsPerPage);
         if (response.success) {
           setgetAlluser(response.users);
           settotalFollowers(response.totalfollowers);
         } else {
           toast.error("followers not found");
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

   
  const totalPages = Math.ceil(totalFollowers / postsPerPage);


  

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar and Sidebar */}
      <Navbar1 />
      <SideNavBar1 />

      <div className="flex flex-col md:flex-row mt-12">
        {/* Main Content Area */}
        <main className="w-full md:w-4/5 ml-auto px-4 md:px-8">
          {/* Fixed Header */}
          <div className="fixed bg-black w-full pl-5  pt-5  pb-5 mt-4 md:mt-6 z-10">
            <h1 className="text-xl font-bold">Followers</h1>
          </div>

          {/* Followers List Section */}
          <div className="space-y-4 p-5 mt-25 w-full min-h-[100vh]">
            <div className="space-y-4 w-full">
              {getAlluser && getAlluser.length > 0 ? (
                getAlluser.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col md:flex-row items-center justify-between bg-gray-900 p-4 rounded-lg hover:shadow-lg transition-shadow space-y-4 md:space-y-0"
                  >
                    {/* User Profile and Info */}
                    <div
                      onClick={() => viewProfile(user._id)}
                      className="flex items-center space-x-4 cursor-pointer w-full md:w-auto"
                    >
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border border-gray-700"
                      />
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>

                    {/* Follow/Unfollow Button */}
                    <button
                      onClick={() => followUser(user._id, userinfo?._id)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors duration-300 ${
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
                <div className="flex flex-col items-center justify-center h-[500px] p-8 border border-gray-700 rounded-lg bg-gray-800">
                  <Users2Icon size={48} className="text-blue-400" />
                  <h3 className="text-xl font-semibold">No Followers</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    Looks like there aren't any Followers. Check back later.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-5 pb-10">
            <nav className="flex space-x-2">
              <button
                className={`text-lg text-blue-500 ${
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
                className={`text-lg text-blue-500 ${
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

export default FollowersPage;
