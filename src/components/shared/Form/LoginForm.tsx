import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import FormInput from "../../base/FormInput";
import FormButton from "../../base/FormButton";
import SignUpForm from "./SignUpForm";


interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState<boolean>(false); // Control for showing signup form
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { email, password } = loginData;

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in: ", userCredential.user);
      onClose(); // Close the popup on successful login
    } catch (err: any) {
      setError(err.message);
      console.error("Login error: ", err.message);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {!isSignup ? (
        <div className="bg-black absolute top-0 h-screen w-full left-0 flex justify-center items-center">
          <div className="bg-white w-[420px] min-h-[270px] gap-5 flex flex-col justify-center items-start p-5 rounded-2xl">
            <h1 className="text-2xl font-bold">Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col justify-center gap-5 w-full">
              <FormInput
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleOnChange}
                placeholder="Email"
              />
              <FormInput
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleOnChange}
                placeholder="Password"
              />
              {error && <p className="text-red-500">{error}</p>}
              <FormButton label="Login" />
            </form>
            <h1
              onClick={() => setIsSignup(true)} // Toggle to show signup form
              className="text-sm text-blue-600 underline font-semibold cursor-pointer"
            >
              Signup
            </h1>
          </div>
        </div>
      ) : (
        <SignUpForm onClose={onClose} /> // Show the signup popup
      )}
    </>
  );
};

export default LoginForm;
