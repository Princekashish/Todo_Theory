import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import FormInput from "../../base/FormInput";
import FormButton from "../../base/FormButton";

interface SignUpFormProps {
  onClose: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { email, password } = loginData;

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created: ", userCredential.user);
      onClose(); // Close the popup on successful signup
    } catch (err: any) {
      setError(err.message);
      console.error("Sign up error: ", err.message);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className=" bg-white absolute top-0 h-screen w-full left-0 flex justify-center items-center ">
      <div className=" bg-[#f3f3f4] w-[420px] h-[270px] gap-5 flex flex-col justify-center items-start p-5 rounded-2xl">
        <h1 className="text-2xl font-bold">SignUp</h1>
        <form
          onSubmit={handleSignUp}
          className="flex flex-col justify-center gap-5  w-full"
        >
          <FormInput
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleOnChange}
            placeholder="Email"
            className="border-none"
          />
          <FormInput
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleOnChange}
            placeholder="Password"
            className="border-none"
          />
          {error && <p className="text-red-500">{error}</p>}
          <FormButton label="Sign Up" className="bg-black text-white rounded-lg"/>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
