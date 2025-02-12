import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { store } from "../Redux-store/reduxstore";
import { useLocation, useNavigate } from "react-router-dom";

type RootState = ReturnType<typeof store.getState>;

interface ProtectiveCheckProps {
  element: React.ReactNode;
}

const UserPrivateRoute: React.FC<ProtectiveCheckProps> = ({ element }) => {
  const isUserAuthenticated = useSelector(
    (state: RootState) => state.accessTocken.userTocken
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [isUserAuthenticated, navigate, location]);

  return isUserAuthenticated ? element : null;
};

export default UserPrivateRoute;
