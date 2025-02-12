import  {  useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import {  useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {  IReportpost } from "../Interfaces/Interface2";
import Adminsidebar from "./Adminsidebar";
import { Button } from "@mui/material";
import Table from "./Table&Paginations/Table";
import Pagination from "./Table&Paginations/Pagination";
import { deletetheReportpost, ReportPostApi } from "../../Services/Admin_API/ReportPosts.ts";

const Reportmanagement = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);
  const { totalPosts, getPost, getAllPost } = ReportPostApi(currentPage,postsPerPage);
  const navigate = useNavigate();


  
  const handleDeletePost = async (id: any ,postid:any) => {
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
          const response =await deletetheReportpost(id, postid);
           if (response.success){
              toast.success("Post deleted successfully");
              getAllPost();
           }else{
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

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;


  const columns = [
    {
      header: "No",
      accessor: (_: IReportpost, index?: number) =>
        index !== undefined
          ? index + 1 + (currentPage - 1) * postsPerPage
          : null,
    },
    {
      header: "Post",
      accessor: (row: IReportpost) =>
        row.postimage ? (
          <img
            src={row.postimage}
            alt="post"
            className="w-20 h-20 object-cover rounded-lg"
          />
        ) : row.postVideo ? (
          <video controls className="w-20 h-20 rounded-lg">
            <source src={row.postVideo[0]} type="video/mp4" />
          </video>
        ) : (
          <span>No media</span>
        ),
    },
    {
      header: "Report Reason",
      accessor: (row: IReportpost) => row.postreportReason || "reson not found",
    },
    {
      header: "Description",
      accessor: (row: IReportpost) => truncateText(row?.postcontent, 100),
    },
    {
      header: "Reported by",
      accessor: (row: IReportpost) => row.reportedBy,
    },
    {
      header: "Posted by",
      accessor: (row: IReportpost) => row.postedBy,
    },
    {
      header: "Delete",
      accessor: (row: IReportpost) => (
        <Button
          variant="contained"
          onClick={() => handleDeletePost(row.postId._id,row._id)}
        >
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
            <h1 className="flex justify-left mt-14 mb-10 text-white text-2xl">
              News Report Management System
            </h1>
            <Table
              data={getPost}
              columns={columns}
              emptyMessage="No Posts Found"
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalPosts / postsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reportmanagement;
