import React from "react";
import SignupForm from "../../components/shared/Form/LoginForm";

const Signup: React.FC = () => {
  return (
    <div>
      {/* Passing handleSignupSubmit to SignupForm */}
      <SignupForm />
    </div>
  );
};

export default Signup;
