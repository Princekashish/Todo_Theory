import React from "react";
import LoginForm from "../../components/shared/Form/LoginForm";


const Login: React.FC = () => {
  return (
    <div>
      {/* Passing handleSignupSubmit to SignupForm */}
      <LoginForm/>
    </div>
  );
};

export default Login;
