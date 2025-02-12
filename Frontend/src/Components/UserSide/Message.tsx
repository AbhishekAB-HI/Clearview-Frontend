import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setSelectedChat } from "../../Redux-store/redux-slice";
import { store } from "../../Redux-store/reduxstore";
import Navbar2 from "../UserSide/Navbar2";
import { API_CHAT_URL, ENDPOINT } from "../Constants/Constants";
import axios from "axios";
import {
  ActiveUsersType,
  FormattedChat,
  IUser,
} from "../Interfaces/Interface";
import SideNavBar from "../UserSide/SideNavbar";
import { MessageCircle, PlusCircle, Search, Users, X } from "lucide-react";
import io, { Socket } from "socket.io-client";
import axiosClient from "../../Services/Axiosinterseptor";
let socket: Socket;
let selectedChatCompare: any;
const MessagePage = () => {
  const [getAlluser, setgetAlluser] = useState<IUser[]>([]);
  const [saveAllgroupmessage, setsaveAllgroupmessage] = useState<FormattedChat[]>([]);
  const [saveAllUsers, setsaveAllUsers] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchusers, setsearchusers] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [findtheUsers, setfindtheUsers] = useState<IUser[]>([]);
  const [saveTheUser, setsaveTheUser] = useState<FormattedChat[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUsersType[]>([]);
  const [findAllUsers, setfindAllUsers] = useState<IUser[]>([]);
  const [postsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentgroupPage, setCurrentgroupPage] = useState(1);
  const [totalGroupPosts, setTotalGroupPosts] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  type RootState = ReturnType<typeof store.getState>;
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Function to toggle form visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };



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
    socket.on("get-users", (users: ActiveUsersType[]) => {
      setActiveUsers(users);
    });
  }, []);


  console.log(saveTheUser,'xxxxxxxx');
  



 

  useEffect(() => {
    getAllPost();
  }, [currentPage]);

  useEffect(() => {
    socket.on("hello", () => {
      toast.success("hello");
    });
  }, []);
  useEffect(() => {
    socket.on("notification received", (newMessageReceived: any) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
      
        getAllPost();
      } else {
      }
    });
  }, []);

  const getchat = useSelector((state: RootState) => state.accessTocken.chats);

  useEffect(() => {
    const FindAllUsers = async () => {
      const { data } = await axiosClient.get(`${API_CHAT_URL}/getusers`);
      if (data.message === "Get all users") {
        setfindAllUsers(data.getTheuser);
      } else {
        toast.error("No user found here");
      }
    };
    FindAllUsers();
  }, []);

  useEffect(() => {
    const getGroupchats = async () => {
      try {
        const { data } = await axiosClient.get(
          `${API_CHAT_URL}/getgroupchats?page=${currentgroupPage}&limit=${postsPerPage}`
        );
        if (data.message === "get all chats") {
          setsaveTheUser(data.groupChats);
          setTotalGroupPosts(data.totalGroupChats);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getGroupchats();
  }, []);

  const accessgroupChat = async (chatId: String, groupname: String) => {
    try {
      const { data } = await axiosClient.post(`${API_CHAT_URL}/getgroup`, {
        chatId,
      });
      if (data.message === "Chat created succesfully") {
        if (!getchat.find((c) => c._id === data.fullChat._id))
        dispatch(setChats([data.fullChat, ...getchat]));
        dispatch(setSelectedChat(data.fullChat));
        navigate(`/groupchatpage/${chatId}/${data.fullChat._id}/${groupname}`);
      } else {
        toast.error("Chat created  Failed");
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

  const accessChat = async (chatId: String) => {
    try {
      const { data } = await axiosClient.post(`${API_CHAT_URL}`, { chatId });
      if (data.message === "Chat created succesfully") {
        if (!getchat.find((c) => c._id === data.fullChat._id))
        dispatch(setChats([data.fullChat, ...getchat]));
        dispatch(setSelectedChat(data.fullChat));
        navigate(`/chatpage/${chatId}/${data.fullChat._id}`);
      } else {
        toast.error("Chat created  Failed");
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
    if (searchusers) {
      const filtered = findAllUsers.filter((user) =>
        user.name.toLowerCase().includes(searchusers.toLowerCase())
      );
      setfindtheUsers(filtered);
    } else {
      setfindtheUsers([]);
    }
  }, [searchusers, findAllUsers]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = saveAllUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, saveAllUsers]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const { data } = await axiosClient.get(`${API_CHAT_URL}/groupusers`);
        if (data.message === "Users found") {
          setsaveAllUsers(data.getusers);
        } else {
          toast.error("No users found here");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, []);

   const getAllPost = async () => {
     try {
       const { data } = await axiosClient.get(
         `${API_CHAT_URL}/allmessages?page=${currentPage}&limit=${postsPerPage}`
       );
       if (data.message === "other message get here") {
         setgetAlluser(data.foundUsers);
         setTotalPosts(data.totalDirectChats);
       } else {
         toast.error("other message is not get here");
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

   useEffect(()=>{
     getGroupchats()
    getAllPost()
   },[])

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const { data } = await axiosClient.get( `${API_CHAT_URL}/allmessages?page=${currentPage}&limit=${postsPerPage}`);
        if (data.message === "other message get here") {
          setgetAlluser(data.foundUsers);
          setsaveAllgroupmessage(data.formatgroupchats);
          setTotalPosts(data.totalDirectChats);
          setTotalGroupPosts(data.totalGroupChats);
        } else {
          toast.error("other message is not get here");
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
              // toast.error("Posts not found.");
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

  const getGroupchats = async () => {
    try {
      const { data } = await axiosClient.get(
        `${API_CHAT_URL}/getgroupchats?page=${currentgroupPage}&limit=${postsPerPage}`
      );
      if (data.message === "get all chats") {
        setsaveTheUser(data.groupChats);
        setTotalGroupPosts(data.totalGroupChats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupchats();
  }, [currentgroupPage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Please provide a group name and select at least one user.");
      return;
    }

    try {
      const response = await axiosClient.post(`${API_CHAT_URL}/creategroup`, {
        groupName,
        users: selectedUsers,
      });

      if (response.data.message === "created new Group") {
        toast.success("Group created successfully!");
        setIsFormVisible(!isFormVisible);
        setGroupName("");
        setSearchTerm("");
        setSelectedUsers([]);
        getGroupchats();
        getAllPost();
      } else {
        toast.error("Failed to create group.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  const FindUserSearch = (term: string) => {
    setsearchusers(term);
    const filtered = findAllUsers.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setfindtheUsers(filtered);
  };

  const handleUserSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = getAlluser.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (user: IUser) => {
    if (!selectedUsers.some((u: IUser) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = selectedUsers.filter(
      (user: any) => user._id !== userId
    );
    setSelectedUsers(updatedUsers);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const totalGPages = Math.ceil(totalGroupPosts / postsPerPage);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar2 />
      <SideNavBar />
      <div className="flex ">
        <main className="w-full md:w-4/5 ml-0 md:ml-auto">
          <div className="max-w-full md:max-w-xl mt-5 mx-auto  p-4 md:p-6">
            {/* Fixed Header */}
            <div className="fixed w-full   md:w-4/5 pt-4 mt-8 ml-2  md:pt-10 pb-5 right-0 md:right-2 bg-black z-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:ml-20 mb-4 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center mb-4 md:mb-0">
                  <MessageCircle className="mr-3 text-blue-500" />
                  Messages
                </h1>
                <button
                  onClick={toggleForm}
                  className="w-2/4 md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle className="mr-2 md:mr-5" />
                  New Group
                </button>
              </div>

              {/* Search Form */}
              <form className="w-3/4 md:w-2/4 mx-4 md:ml-20 group">
                <div className="relative">
                  <input
                    type="text"
                    value={searchusers}
                    onChange={(e) => FindUserSearch(e.target.value)}
                    placeholder="Find Friends"
                    className="w-full pl-12 text-black pr-4 py-2 md:py-3 text-sm md:text-base bg-white rounded-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm placeholder:text-gray-400"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 md:h-5 w-4 md:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Search Results */}
          {findtheUsers.length > 0 && (
            <ul className="z-10 w-3/4    md:w-1/4 mx-4 md:ml-5  bg-white dark:bg-gray-800 rounded-xl mt-50 md:mt-50 max-h-48 overflow-y-auto shadow-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {findtheUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={() => accessChat(user._id)}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <div className="">
                    <img
                      src={user.image}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                      alt=""
                    />
                    {/* {user.name.charAt(0)} */}
                  </div>

                  <div className="ml-3 ">
                    <p className="text-sm  font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    {/* Add additional user info if available */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email.toLowerCase().replace(/\s+/g, "_")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Main Content Area */}
          <div className="bg-black min-h-screen text-white pt-32 md:pt-40">
            <div className="container mx-auto px-4 py-4 md:py-8">
              {/* Group Creation Form */}
              {isFormVisible && (
                <div className="bg-black rounded-lg p-4 md:p-6 mb-6 md:mb-8 shadow-xl">
                  <form onSubmit={handleSubmit}>
                    {/* ... Form fields with responsive padding and margins ... */}
                    <div className="mb-4 mt-10 md:mb-6">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="groupname"
                      >
                        Group Name
                      </label>
                      <input
                        type="text"
                        id="groupname"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full bg-gray-800 border-none rounded-lg py-2 md:py-3 px-4 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter group name..."
                        required
                      />
                    </div>

                    {/* User Search and Selection */}
                    <div className="mb-4 md:mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Add users
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => handleUserSearch(e.target.value)}
                          className="w-full bg-gray-800 border-none rounded-lg py-2 md:py-3 px-10 focus:ring-2 focus:ring-blue-500"
                          placeholder="Search for users..."
                        />
                      </div>
                      {filteredUsers.map((user) => (
                        <li
                          key={user._id}
                          onClick={() => handleUserSelect(user)}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                        >
                          <div className="">
                            <img
                              src={user.image}
                              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                              alt=""
                            />
                            {/* {user.name.charAt(0)} */}
                          </div>

                          <div className="ml-3 ">
                            <p className="text-sm  font-medium text-gray-900 dark:text-gray-100">
                              {user.name}
                            </p>
                            {/* Add additional user info if available */}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email.toLowerCase().replace(/\s+/g, "_")}
                            </p>
                          </div>
                        </li>
                      ))}
                    </div>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                      <div className="mb-4 md:mb-6">
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map((user) => (
                            <div
                              key={user._id}
                              className="bg-blue-700 rounded-full px-3 py-1 flex items-center text-sm"
                            >
                              {user.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveUser(user._id)}
                                className="ml-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 rounded-lg transition-colors"
                    >
                      Create Group
                    </button>
                  </form>
                </div>
              )}

              {/* Users List */}
              <div className="space-y-4 md:space-y-6">
                {getAlluser.length > 0 && (
                  <div>
                    <h2 className="text-lg mt-20 md:mt-10 md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                      <Users className="mr-2 text-blue-500" />
                      Users
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {getAlluser.map((user, index) => (
                        <div
                          key={index}
                          onClick={() => accessChat(user._id)}
                          className="flex items-center bg-gray-900 hover:bg-gray-800 rounded-lg p-3 md:p-4 cursor-pointer transition-colors"
                        >
                          <span
                            className={`h-2 md:h-3 w-2 md:w-3 rounded-full mr-0 mt-8 md:mt-10 ${
                              activeUsers.some(
                                (activeUser) => activeUser.userId === user._id
                              )
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>

                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 md:w-12 h-10 md:h-12 rounded-full mx-2 md:mr-4 object-cover"
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-base md:text-lg font-medium truncate">
                              {user.name}
                            </p>
                            {/* Messages and timestamps with responsive text sizes */}
                            {/* ... Message content ... */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-6 md:mt-8">
                  <nav className="flex space-x-2">
                    <button
                      className={`text-lg text-blue-500 ${
                        currentPage === 1 && "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      {"<"}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`text-sm ${
                            page === currentPage
                              ? "bg-blue-500 text-white"
                              : "bg-gray-700 text-blue-500"
                          } px-3 py-1 rounded-md`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className={`text-sm text-blue-500 ${
                        currentPage === totalPages &&
                        "opacity-50 cursor-not-allowed"
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

                {/* Group Chats Section */}
                {saveTheUser.length > 0 && (
                  <div className="mt-6 md:mt-10">
                    <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                      <MessageCircle className="mr-2 text-blue-500" />
                      Group Chats
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {saveTheUser.map((group) => (
                        <div
                          key={group._id}
                          onClick={() =>
                            accessgroupChat(group._id, group.chatName)
                          }
                          className="flex items-center bg-gray-900 hover:bg-gray-800 rounded-lg p-3 md:p-4 cursor-pointer transition-colors"
                        >
                          <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3 md:mr-4">
                            <Users className="w-5 md:w-6 h-5 md:h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-base md:text-lg font-medium">
                              {group.chatName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {getAlluser.length === 0 &&
                  saveAllgroupmessage.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center bg-gray-900 rounded-lg p-6 md:p-10">
                      <MessageCircle className="w-12 md:w-16 h-12 md:h-16 text-blue-500 mb-3 md:mb-4" />
                      <h2 className="text-xl md:text-2xl font-bold mb-2">
                        No Chats Found
                      </h2>
                      <p className="text-sm md:text-base text-gray-400">
                        Start a conversation by creating a new group or finding
                        users
                      </p>
                    </div>
                  )}
              </div>
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <button
                    className={`text-lg text-blue-500 ${
                      currentgroupPage === 1 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      setCurrentgroupPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentgroupPage === 1}
                  >
                    {"<"}
                  </button>
                  {Array.from({ length: totalGPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`text-sm ${
                          page === currentgroupPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-blue-500"
                        } px-3 py-1 rounded-md`}
                        onClick={() => setCurrentgroupPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className={`text-lg text-blue-500 ${
                      currentgroupPage === totalGPages &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      setCurrentgroupPage((prev) =>
                        Math.min(prev + 1, totalGPages)
                      )
                    }
                    disabled={currentgroupPage === totalGPages}
                  >
                    {">"}
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagePage;
