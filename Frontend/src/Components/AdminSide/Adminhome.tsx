import { useState } from "react";
import { Button } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Navbar from "./Navbar";
import Adminsidebar from "./Adminsidebar";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { IUser } from "../Interfaces/Interface";
import useFetchUsers, { updateUser } from "../../Services/Admin_API/UserManagement.ts";

const AdminHomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { usersList, countPosts, loading, fetchUsers } = useFetchUsers(
    currentPage,
    itemsPerPage,
    searchTerm
  );

  const updateBlockStatus = async (userId: string, isActive: boolean) => {
    const actionText = isActive ? "Unblock user" : "Block user";
    const confirmationText = isActive
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?";

    Swal.fire({
      title: confirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: actionText,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await updateUser(userId, isActive);
          toast.success(
           response.success
              ? "User blocked successfully."
              : "User unblocked successfully."
          );
          if (response.success) {
            fetchUsers();
          } else {
              fetchUsers();
          }
        } catch {
          toast.error("Failed to update user status.");
        }
      }
    });
  };

  const totalPages = Math.ceil(countPosts / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Adminsidebar />
        <main className="ml-36 w-3/5 flex-1 p-4">
          <div className="container mx-auto">
            <div className="pb-1 w-full">
              <h1 className="text-left ml-20 mt-20 text-white text-2xl">
                User Management System
              </h1>
            </div>
            <div className="flex justify-end mb-10">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type here..."
                className="bg-gray-800 text-white px-4 py-2 rounded-l-full w-1/3 outline-none"
              />
            </div>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : usersList.length > 0 ? (
                usersList.map((user,index) => (
                  <UserCard
                    key={index}
                    user={user}
                    onUpdateBlock={updateBlockStatus}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No users found.</p>
              )}
            </div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

interface UserCardProps {
  user: IUser;
  onUpdateBlock: (userId: string, isActive: boolean) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onUpdateBlock }) => (
  <div className="bg-white text-black p-4 rounded-lg flex justify-between items-center max-w-4xl mx-auto">
    <div className="flex items-center space-x-4">
      <FaRegUser style={{ fontSize: "45px" }} />
      <div>
        <p className="font-bold">{user.name}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
    <Button
      variant="contained"
      onClick={() => onUpdateBlock(user._id, user.isActive)}
      color={user.isActive ? "secondary" : "primary"}
    >
      {user.isActive ? "Unblock" : "Block"}
    </Button>
  </div>
);

interface pagination {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<pagination> = ({
  totalPages,
  onPageChange,
}) => (
  <div className="flex justify-center mt-8">
    <nav className="flex space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          key={index}
          variant="text"
          color="primary"
          className="text-lg"
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Button>
      ))}
    </nav>
  </div>
);

export default AdminHomePage;
