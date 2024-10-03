import React, { useState } from "react";
import Header from "../Header";
import { Outlet } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import AuthStatus from "../../custom/AuthStatus";

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const auth = getAuth();

  const handleAuthChange = (authStatus: boolean, email?: string | null) => {
    setIsAuthenticated(authStatus);
    setUserEmail(email || null);
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Error logging out:", error);
    });
  };

  return (
    <>
      <AuthStatus onAuthChange={handleAuthChange} />
      {/* we are showing user authentication email */}
      <Header
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        handleLogout={handleLogout}
      />
      <Outlet />
    </>
  );
};

export default Layout;
