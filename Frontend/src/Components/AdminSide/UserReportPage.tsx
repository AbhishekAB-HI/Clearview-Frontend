import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IReportUser } from "../Interfaces/Interface";
import Adminsidebar from "./Adminsidebar";
import { Button } from "@mui/material";
import Table from "./Table&Paginations/Table";
import { deleteReportpost, reporttheuser } from "../../Services/Admin_API/Reportuser.ts";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const UserReportmanagement = () => {

  const navigate = useNavigate();
  const {  getPost } = reporttheuser();
  

  const handleDeletePost = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You Want to delete this post",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteReportpost(id)
          if (response.success) {
            toast.success("Post deleted successfully");
          } else {
            toast.error("Post delete failed");
          }
        } else {
          navigate("/reportpage");
        }
      });
    } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "An error occurred";
          toast.error(errorMessage);
        } else {
          toast.error("Unknown error occurred");
        }
        console.error("Error during login:", error);
    }
  };


  
  const columns = [
    {
      header: "No",
      accessor: (_: IReportUser, index?: number) =>
        index !== undefined
          ? index + 1 
          : null,
    },
    {
      header: "Profileimage",
      accessor: (row: IReportUser) =>
        row.userimage ? (
          <img
            src={row.userimage}
            alt="post"
            className="w-20 h-20 object-cover rounded-lg"
          />
        ) : (
          <span>No photo</span>
        ),
    },
    {
      header: "Name",
      accessor: (row: IReportUser) => row.username || "reason not found",
    },
    {
      header: "Report Reason",
      accessor: (row: IReportUser) =>
        truncateText(row.reportReason, 100) || "reason not found",
    },
    {
      header: "Reported By",
      accessor: (row: IReportUser) => row.Reportedby || "reason not found",
    },
    {
      header: "Delete",
      accessor: (row: IReportUser) => (
        <Button variant="contained" onClick={() => handleDeletePost(row?._id)}>
          Delete
        </Button>
      ),
    },
  ];



  return (
    <div>
      <Navbar />
      <div className="flex">
        <Adminsidebar />

        <main className="ml-64 flex-1 p-4">
          <div className="container mx-auto">
            <h1 className="flex justify-left mb-10 mt-14 text-white text-2xl">
              User Report Management System
            </h1>
            <Table
              data={getPost}
              columns={columns}
              emptyMessage="No Posts Found"
            />
          
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserReportmanagement;
