import  {  useState } from "react";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Adminsidebar from "./Adminsidebar";
import Table from "./Table&Paginations/Table";
import Pagination from "./Table&Paginations/Pagination";
import SearchInput from "./Table&Paginations/SearchInput";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { IPost } from "../Interfaces/Interface";
import { deletethepost, newsApiPost } from "../../Services/Admin_API/NewsApi.ts";

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

const Newsmanagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);
  const {getPost, totalPosts, getAllPosts} = newsApiPost(currentPage, postsPerPage, searchTerm );

  const handleDeletePost = async (id: string, block: boolean) => {
    const action = block ? "Unblock Post" : "Block Post";
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const responce = await deletethepost(id);
          if (responce?.success) {
            toast.success("Post updated successfully");
            getAllPosts();
          } else {
            toast.error("Failed to update post");
          }
        } catch (error) {
          toast.error("Failed to update post");
        }
      }
    });
  };

  const columns = [
    {
      header: "No",
      accessor: (_: IPost, index?: number) =>
        index !== undefined
          ? index + 1 + (currentPage - 1) * postsPerPage
          : null,
    },
    {
      header: "Image",
      accessor: (row: IPost) =>
        row.image ? (
          <img
            src={row.image}
            alt="post"
            className="w-20 h-20 object-cover rounded-lg"
          />
        ) : row.videos ? (
          <video controls className="w-20 h-20 rounded-lg">
            <source src={row.videos} type="video/mp4" />
          </video>
        ) : (
          <span>No media</span>
        ),
    },
    {
      header: "Description",
      accessor: (row: IPost) => truncateText(row.description, 100),
    },
    {
      header: "Posted By",
      accessor: (row: IPost) => row?.user?.name || "Unknown",
    },
    {
      header: "Block",
      accessor: (row: IPost) => (
        <Button
          variant="contained"
          onClick={() => handleDeletePost(row._id, row?.BlockPost)}
          sx={{
            backgroundColor: row.BlockPost ? "#006400" : "#FF0000",
            "&:hover": {
              backgroundColor: row.BlockPost ? "#00CC00" : "#CC0000",
            },
          }}
        >
          {row.BlockPost ? "Unblock Post" : "Block Post"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Adminsidebar />
        <main className="ml-60 w-3/5 flex-1 p-4">
          <h1 className="flex justify-left mt-14 mb-10 text-white text-2xl">
            News  Management System
          </h1>
          <div className="flex justify-end mb-6">
            <SearchInput
              value={searchTerm}
              onChange={(value: string) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              placeholder="Type here..."
            />
          </div>
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
        </main>
      </div>
    </div>
  );
};

export default Newsmanagement;
