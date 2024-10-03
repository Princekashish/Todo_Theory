import React from "react";
import FormButton from "../../base/FormButton";

interface HeaderProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, handleLogout }) => {
  return (
    <div className="flex justify-between items-center h-16 text-white shadow-xl p-5 absolute top-0 w-full z-10 bg-zinc-900">
      <h1 className="text-lg font-bold leading-none">Co.</h1>
      {isAuthenticated ? (
        <FormButton label="Logout" className="text-red-600" onClick={handleLogout} />
      ) : (
        <FormButton label="Login" className="text-blue-600" />
      )}
    </div>
  );
};

export default Header;
