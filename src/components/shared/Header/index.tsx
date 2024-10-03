import React from "react"; 
import FormButton from "../../base/FormButton";

interface HeaderProps {
  isAuthenticated: boolean;
  userEmail: string | null; 
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userEmail, handleLogout }) => {
  return (
    <div className="flex justify-between items-center h-16 p-5 sticky top-0 w-full z-10 ">
      <h1 className="text-lg font-bold leading-none">Co.</h1>
      <div className="flex items-center">
        {/* check if user is authentication or not as well email is ther or not  */}
        {isAuthenticated && userEmail && ( 
          <span className="mr-4 text-gray-700">{userEmail}</span> 
        )}
        {isAuthenticated ? (
          <FormButton 
            label="Logout" 
            className="rounded-full text-red-600 font-semibold bg-gray-200" 
            onClick={handleLogout} 
          />
        ) : (
          <FormButton 
            label="Login" 
            className="text-blue-600 bg-gray-200 font-semibold rounded-xl cursor-not-allowed "
            disabled 
          />
        )}
      </div>
    </div>
  );
};

export default Header;
