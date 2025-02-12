import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { store } from "../Redux-store/reduxstore.ts";
import { useLocation, useNavigate } from "react-router-dom";

type RootState = ReturnType<typeof store.getState>;

interface ProtectiveCheckProps {
  element: React.ReactNode;
}

const AdminprivateRoute: React.FC<ProtectiveCheckProps> = ({ element }) => {
  try {
    const isAdminauthenticate = useSelector(
      (state: RootState) => state.accessTocken.AdminTocken
    );

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!isAdminauthenticate) {
        navigate("/Adminlogin", { state: { from: location } });
      }
    }, [isAdminauthenticate, navigate, location]);

    return isAdminauthenticate ? element : null;
  } catch (error) {
    console.log(error);
  }
};

export default AdminprivateRoute;
