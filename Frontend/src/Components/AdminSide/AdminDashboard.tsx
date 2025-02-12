import {  Card, CardContent, Typography } from "@mui/material";
import Navbar from "./Navbar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Adminsidebar from "./Adminsidebar";
import { useAdminDashboard } from "../../Services/Admin_API/Admindashboard.ts";
ChartJS.register(
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const AdminDashboard = () => {
  const { userCount, postCount } =useAdminDashboard();
  const pieData = {
    labels: ["Free", "Premium"],
    datasets: [
      {
        label: "User Account Tiers",
        data: [56, 44], 
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const barData = {
    labels: ["Post 1", "Post 2", "Post 3", "Post 4"],
    datasets: [
      {
        label: "Likes",
        data: [150, 250, 300, 220], 
        backgroundColor: "#36A2EB",
      },
      {
        label: "Comments",
        data: [60, 80, 95, 70], 
        backgroundColor: "#FF6384",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Navbar />
      <div className="flex ">
        <Adminsidebar />

        {/* Main Content */}
        <main className="ml-60 w-3/5 flex-1">
          <div className="grid mt-20 grid-cols-2 gap-4">
            {/* Stats Cards */}
            <Card className="p-4">
              <CardContent>
                <Typography variant="h5">Total Users</Typography>
                <Typography variant="h3">{userCount}</Typography>
              </CardContent>
            </Card> 
            <Card className="p-4">
              <CardContent>
                <Typography variant="h5">Total Articles</Typography>
                <Typography variant="h3">{postCount}</Typography>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div
              className="chart-container"
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                margin: "0 auto",
              }}
            >
              <Pie data={pieData} />
            </div>
            <div className="chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Recent Posts Section */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-bold">Recent Posts</h3>
              <ul>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
