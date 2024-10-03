import React, { useState } from "react";
import Header from "../Header";
import { Outlet } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import AuthStatus from "../../custom/AuthStatus";

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  const handleAuthChange = (authStatus: boolean) => {
    setIsAuthenticated(authStatus);
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Error logging out:", error);
    });
  };

  return (
    <>
      <AuthStatus onAuthChange={handleAuthChange} />
      <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Outlet />
    </>
  );
};

export default Layout;
